import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-bankwise-loan-statement',
  templateUrl: './bankwise-loan-statement.component.html',
  styleUrls: ['./bankwise-loan-statement.component.css'],
})
export class BankwiseLoanStatementComponent implements OnInit {
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
    formname: '',
    city: ['', Validators.required],
    date: this.formBuilder.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, Validators.required],
    }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
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
        name: 'BankwiseLoanStmt.rpt',
        exportType: 'PDF',
        isPrint: false,
        seqId: 1,
        reportParameters: {

          formname: "''", 
          city: "'" + this.ReportCriteria.get('city')?.value + "'",

          fromDate: moment(
            this.ReportCriteria.getRawValue().date.fromDate
          ).format('YYYY-MM-DD'),

          toDate: moment(
            this.ReportCriteria.getRawValue().date.toDate
          ).format('YYYY-MM-DD'),
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
}
