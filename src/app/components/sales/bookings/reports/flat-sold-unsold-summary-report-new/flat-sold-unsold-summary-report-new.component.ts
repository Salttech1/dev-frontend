import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { windowToggle } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-flat-sold-unsold-summary-report-new',
  templateUrl: './flat-sold-unsold-summary-report-new.component.html',
  styleUrls: ['./flat-sold-unsold-summary-report-new.component.css'],
})
export class FlatSoldUnsoldSummaryReportNewComponent implements OnInit {
  filter_wing = '';
  maxDate = new Date(); // use for future date disabled
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  ReportCriteria: FormGroup = this.formBuilder.group({
    bldgCode: [''],
    wing: [{ value: '', disabled: true }],
    asOnDate: [new Date(), Validators.required],
  });

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _service: ServiceService,
    private _commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {}

  buttonAction(event: string) {
    if (event === 'download') {
      this.downloadReport(false);
    } else if (event === 'print') {
      this.downloadReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.ReportCriteria.reset();
    }
  }

  downloadReport(isPrint: boolean) {
    if (this.ReportCriteria.valid) {
      let payload: any = {
        name: 'Web_Book_PartyDets.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: "''",

          bldgCode: this.ReportCriteria.get('bldgCode')?.value
            ? "'" + this.commonService.convertArryaToString(this.ReportCriteria.get('bldgCode')?.value) + "'"
            : "'ALL'",

          wing: this.ReportCriteria.get('wing')?.value
            ? "'" + this.ReportCriteria.get('wing')?.value + "'"
            : "' '",

          asOnDate: moment(this.ReportCriteria.getRawValue().asOnDate).format(
            'YYYY-MM-DD'
          ),
        },
      };
      this.PrintReport(payload, isPrint);
      this.config.isLoading = false;
     
    }
  }

  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.commonPdfReport(isPrint, res);
        }
      },
      error: (error) => {
        this.config.isLoading = false;
      },
    });
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.config.isLoading = false;
    this._service.exportReport(print, res, 'PDF', filename);
  }

  onLeaveBuildingCode(val: string) {
    if (val.length > 0) {
      this.ReportCriteria.get('wing')?.enable();
      this.filter_wing = `bldg_code = '` + val + `'`;
    } else {
      this.ReportCriteria.get('wing')?.disable();
    }
  }
}
