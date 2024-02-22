import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { OutgoingService } from 'src/app/services/sales/outgoing.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-outgoing-summary-report',
  templateUrl: './outgoing-summary-report.component.html',
  styleUrls: ['./outgoing-summary-report.component.css'],
})
export class OutgoingSummaryReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'rpt_OutgoingSummary.rpt',
        Validators.required
      ),
      fromMonth: new FormControl<string[]>([]),
      toMonth: new FormControl<string[]>([]),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    public _service: ServiceService,
    private _ogService: OutgoingService,
    public commonService: CommonService,
    public _sales: SalesService
  ) {}

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
    setTimeout(function () {
      document.getElementById('fromMonth')?.focus();
    }, 100);
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      let fromMonth = this.queryForm.get('fromMonth')?.value;
      let toMonth = this.queryForm.get('toMonth')?.value;
      let sessId = 0;
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let sessionPayload: any = {
          fromMonth: fromMonth,
          toMonth: toMonth,
        };
        console.log('sessionPayload', sessionPayload);
        this.loaderToggle = true;
        this._ogService
          .getOutgoingSummaryTempTableData(sessionPayload)
          .pipe(
            take(1),
            switchMap((res: any) => {
              // get report name based, BldgMatwise does not have Detail report hence if condition
              sessId = res.data;
              let payload: any = {
                name: this.queryForm.get('name')?.value,
                exportType: this.queryForm.get('exportType')?.value,
                isPrint: false,
                seqId: 1,
                reportParameters: {
                  StrWhereclause: ` AND sumc_sessid = '${sessId}' `,
                  formname: this.formName,
                  HeaderText1: fromMonth,
                  HeaderText2: toMonth,
                },
              };
              return this._commonReport.getParameterizedReport(payload);
              // this._commonReport
              //   .getParameterizedReport(payload)
              //   .pipe(
              //     take(1),
              //     finalize(() => (this.loaderToggle = false))
              //   )
              //   .subscribe({
              //     next: (res: any) => {
              //       if (res) {
              //         this.commonPdfReport(print, res);
              //       } else {
              //         this.toastr.showError('No Data Found');
              //       }
              //     },
              //   });

              //   return payload
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
              // API CALL to delete rows from Temp tables for session id
              this.delSessId('saogrp04p', 'sump_sessid', String(sessId));
              this.delSessId('saogrp04c', 'sumc_sessid', String(sessId));
              this.delSessId('saogrp04f', 'sumf_sessid', String(sessId));

              // this._sales
              //   .deleteSessionId(sessId)
              //   .pipe(
              //     take(1),
              //     finalize(() => {
              //       this.loaderToggle = false;
              //     })
              //   )
              //   .subscribe({
              //     next: (res: any) => {
              //       if (res.status) {
              //       } else {
              //         this.toastr.showError(res.message);
              //       }
              //     },
              //   });
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.queryForm.get('exportType')?.value,
      filename
    );
  }

  delSessId(tempTableName: string, sesIdColName: string, sessionId: string) {
    if (sessionId) {
      this.commonService
        .deleteSessionId(tempTableName, sesIdColName, sessionId)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.status) {
            } else {
              this.toastr.showError(res.message);
            }
          },
        });
    }
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'rpt_OutgoingSummary.rpt',
      fromMonth: [],
      toMonth: [],
    });
    setTimeout(function () {
      document.getElementById('fromMonth')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('fromMonth')?.value.length ? null : { atLeastOneFilter: true };
  };
}
