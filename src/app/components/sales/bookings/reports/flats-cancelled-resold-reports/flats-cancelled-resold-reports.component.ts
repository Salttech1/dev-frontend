import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-flats-cancelled-resold-reports',
  templateUrl: './flats-cancelled-resold-reports.component.html',
  styleUrls: ['./flats-cancelled-resold-reports.component.css'],
})
export class FlatsCancelledResoldReportsComponent implements OnInit {
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

  ReportCriteria: FormGroup = this.formBuilder.group({
    bldgCode: [''],
    wing: [''],
    flatNum: [''],
    date: this.formBuilder.group({
      fromDate: [],
      toDate: [],
    }),
    reportType: ['cancel'],
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
      // this.downloadReport(false);
    } else if (event === 'print') {
      // this.downloadReport(true);
    } else if (event === 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event === 'reset') {
      this.ReportCriteria.reset();
    }
  }

  downloadReport(isPrint: boolean) {
    if (this.ReportCriteria.valid) {
      const reportChoice: string = this.ReportCriteria.getRawValue().reportType;

      let payload: any = {
        name: 'FlatsCR.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          bldgCode: this.ReportCriteria.get('bldgCode')?.value
            ? "'" +
              this.commonService.convertArryaToString(
                this.ReportCriteria.get('bldgCode')?.value
              ) +
              "'"
            : "''",
          fromDate: this.ReportCriteria.getRawValue().bookingDate.fromDate
            ? moment(
                this.ReportCriteria.getRawValue().bookingDate.fromDate
              ).format('YYYY-MM-DD')
            : '',
          toDate: this.ReportCriteria.getRawValue().bookingDate.toDate
            ? moment(
                this.ReportCriteria.getRawValue().bookingDate.toDate
              ).format('YYYY-MM-DD')
            : '',

          custType: this.ReportCriteria.getRawValue().custType ? "'N'" : '', //N means Only NRI
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

  onLeaveBuildingCode(bldgVal: string) {
    if (bldgVal.split(',').length > 1) {
      this.ReportCriteria.get('wing')?.disable();
      this.ReportCriteria.get('flatNum')?.disable();
      document.getElementById('id_date')?.focus();
    } else {
      this.ReportCriteria.get('wing')?.enable();
      this.ReportCriteria.get('flatNum')?.enable();
      this.filter_wing = `flat_bldgcode = '` + bldgVal + `'`;
      this.filter_flat = `flat_bldgcode = '` + bldgVal + `'`;
      document.getElementById('id_wing')?.focus();
    }
  }

  onLeaveWing(wingVal: string) {
    if (wingVal.length > 0) {
      this.filter_flat =
        this.filter_flat + ` AND flat_wing IN ('` + wingVal + `')`;

      console.log('test2', this.filter_flat);
    }
  }
}
