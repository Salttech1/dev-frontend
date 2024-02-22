import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-loan-statement',
  templateUrl: './loan-statement.component.html',
  styleUrls: ['./loan-statement.component.css'],
})
export class LoanStatementComponent implements OnInit {
  filter_wing = '';
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
    bldgCode: ['', Validators.required],
    wing: [''],
    loanInst: [],
    date: this.formBuilder.group({
      fromDate: [],
      toDate: [],
    }),
    reportType: ['bldg'],
  });

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}

  ngOnInit(): void {}

  // list action buttons method
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
      const reportChoice: string = this.ReportCriteria.getRawValue().reportType;

      let payload: any = {
        name: reportChoice.includes('bldg')
          ? 'LoanStatementBldg.rpt'
          : 'LoanStatementLoan.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          bldgCode: "'" + this.commonService.convertArryaToString(this.ReportCriteria.get('bldgCode')?.value) + "'",

          wing: this.ReportCriteria.get('wing')?.value
            ? "'" + this.ReportCriteria.get('wing')?.value + "'"
            : "",

          loanInst: this.ReportCriteria.getRawValue().loanInst
            ? "'" + this.commonService.convertArryaToString(this.ReportCriteria.getRawValue().loanInst) + "'"
            : '',

          fromDate: this.ReportCriteria.getRawValue().date.fromDate
            ? moment(this.ReportCriteria.getRawValue().date.fromDate).format(
                'YYYY-MM-DD'
              )
            : '',
          toDate: this.ReportCriteria.getRawValue().date.toDate
            ? moment(this.ReportCriteria.getRawValue().date.toDate).format(
                'YYYY-MM-DD'
              )
            : '',
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
  }
}
