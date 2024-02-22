import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-booking-by-month',
  templateUrl: './booking-by-month.component.html',
  styleUrls: ['./booking-by-month.component.css'],
})
export class BookingByMonthComponent implements OnInit {
  filter_wing = '';
  loaderToggle: boolean = false;
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
    wing: [''],
    yearMonth: [''],
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
      let condition;
      let strWing = `${this.ReportCriteria.get('wing')?.value}`.trim();
      let strYm = `${this.ReportCriteria.get('yearMonth')?.value}`;

      if (strWing != '' && strYm != '') {
        condition = 4;
      } else if (strWing == '' && strYm != '') {
        condition = 3;
      } else if (strWing != '' && strYm == '') {
        condition = 2;
      } else {
        condition = 1;
      }

      let payload: any = {
        name: 'Booking By Month.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        conditionId: condition,
        reportParameters: {
          bldgCode: this.ReportCriteria.get('bldgCode')?.value
            ? this.commonService.convertArryaToString(
                this.ReportCriteria.get('bldgCode')?.value
              )
            : 'ALL',

          wing: this.ReportCriteria.get('wing')?.value
            ? this.commonService.convertArryaToString(
                this.ReportCriteria.get('wing')?.value
              )
            : '',

          yearMonth: this.ReportCriteria.get('yearMonth')?.value,

          formname: "'FrmBookingByMonth'",
        },
      };
      this.PrintReport(payload, isPrint);
      this.config.isLoading = false;
    }
  }

  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport
      .getTtxParameterizedReportWithCondition(payload)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.loaderToggle = false;
          let pdfFile = new Blob([res], { type: 'application/pdf' });
          let fileName = this._commonReport.getReportName();
          if (isPrint) {
            const blobUrl = URL.createObjectURL(pdfFile);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdfFile, fileName);
          }
        },
        error: (error) => {
          this.config.isLoading = false;
        },
      });
  }
  onLeaveBuildingCode(bldgVal: string) {
    if (bldgVal.split(',').length > 1) {
      this.ReportCriteria.get('wing')?.disable();
    } else {
      this.ReportCriteria.get('wing')?.enable();
      this.filter_wing = `flat_bldgcode = '` + bldgVal + `'`;
      document.getElementById('id_wing')?.focus();
    }
  }
}
