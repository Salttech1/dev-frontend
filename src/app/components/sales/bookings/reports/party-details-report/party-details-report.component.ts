import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-party-details-report',
  templateUrl: './party-details-report.component.html',
  styleUrls: ['./party-details-report.component.css'],
})
export class PartyDetailsReportComponent implements OnInit {
  filter_wing = '';
  filter_flat = '';
  config = {
    isLoading: false,
  };

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'download',
    'print',
    'reset',
    'exit',
  ]);

  exportTypes = [{ name: 'PDF', id: 'PDF' }];

  ReportCriteria: FormGroup = this.formBuilder.group({
    //exportType: ['PDF'],
    // name : "Web_Book_PartyDets.rpt",
    formname: '',
    bldgCode: ['', Validators.required],
    bldgName: [{ value: '', disabled: true }],
    wing: [''],
    flatNum: [],
  });

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
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

          bldgCode: "'" + this.ReportCriteria.get('bldgCode')?.value + "'",

          wing: this.ReportCriteria.get('wing')?.value
          ? "'" + this.ReportCriteria.get('wing')?.value + "'"
          : "' '",

          flatNum: this.ReportCriteria.get('flatNum')?.value
            ? "'" +
              this.commonService.convertArryaToString(
                this.ReportCriteria.get('flatNum')?.value
              ) +
              "'"
            : "'ALL'",
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
    this.filter_wing = `bldg_code = '` + val + `'`;
    this.filter_flat = `flat_bldgcode = '` + val + `'`;
  }
}
