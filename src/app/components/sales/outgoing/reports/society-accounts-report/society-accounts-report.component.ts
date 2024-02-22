import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OutgoingService } from 'src/app/services/sales/outgoing.service';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-society-accounts-report',
  templateUrl: './society-accounts-report.component.html',
  styleUrls: ['./society-accounts-report.component.css'],
})
export class SocietyAccountsReportComponent implements OnInit {
  initialMode: Boolean = true;
  dateUptoStr = new Date().toDateString();
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'Rpt_OutgoingSocAccRpt.rpt',
        Validators.required
      ),
      proprietor: new FormControl<string[]>([]),
      company: new FormControl<string[]>([]),
      dateUpto: new FormControl<string[]>([], [Validators.required]),
      // dateUpto: new FormControl<string[]>(this.dateUptoStr)
      // dateUpto: ((new Date())),
    },
    { validators: this.all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  companyFilter = '';

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _ogService: OutgoingService,
    public _service: ServiceService,
    public commonService: CommonService,
    public _sales: SalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
    setTimeout(function () {
      document.getElementById('proprietor')?.focus();
    }, 100);
    var datePipe = new DatePipe('en-US');

    this.queryForm.controls['dateUpto'].setValue(
      datePipe.transform(this.dateUptoStr, 'dd/MM/yyyy')
    );
    this.initialMode = true;
    this.queryForm.get('proprietor')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let proprietor = res.data[0][0];
          console.log(proprietor);

          this.companyFilter = `coy_prop = '${proprietor}')`;
        }
      },
    });
  }

  filterPropcodeForCompany() {
    let proprietor = this.queryForm.get('proprietor')?.value[0][0];

    this.companyFilter = `coy_prop = '${proprietor}'`;
    console.log(this.companyFilter);
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      let to = this.queryForm.get('dateUpto')?.value;
      let dateUpto = moment(to).format('DD/MM/YYYY');
      let proprietor = this.queryForm.get('proprietor')?.value[0][0];
      let company = this.queryForm.get('company')?.value[0][0];
      let sessId = 0;
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let sessionPayload: any = {
          dateUpto: dateUpto,
          proprietor: proprietor,
          company: company,
        };
        console.log('sessionPayload', sessionPayload);
        this.loaderToggle = true;
        this._ogService
          .getOutgoingSocietyAccountsTempTableData(sessionPayload)
          .pipe(
            take(1),
            switchMap((res: any) => {
              sessId = res.data;
              let payload: any = {
                name: this.queryForm.get('name')?.value,
                exportType: this.queryForm.get('exportType')?.value,
                isPrint: false,
                seqId: 1,
                reportParameters: {
                  formname: this.formName,
                  SecId: sessId,
                  PropId: "'" + proprietor + "'",
                  HeaderText1: dateUpto,
                },
              };
              console.log('payload', payload);
              return this._commonReport.getParameterizedReport(
                payload
              );
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

              // return payload;
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
              // API CALL to delete rows from Temp tables for session id
              this.delSessId('saogrp06', 'soc_sessid',String(sessId));
              // this.commonService
              //   .deleteSessionId('saogrp06', 'soc_sessid', String(sessId))
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

  delSessId( tempTableName: string,
    sesIdColName: string,
    sessionId: string ) {
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

   commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this._service.exportReport(
      print,
      res,
      this.queryForm.get('exportType')?.value,
      filename
    );
  }

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'Rpt_OutgoingSocAccRpt.rpt',
      proprietor: [],
      company: [],
      dateUpto: [],
    });
    this.queryForm.enable();
    this.initialMode = true;
    setTimeout(function () {
      document.getElementById('proprietor')?.focus();
    }, 100);
  }

  all() {
    return (g: AbstractControl) => {
      return g.get('proprietor')?.value.length
        ? null
        : { atLeastOneFilter: true };
      return g.get('company')?.value.length ? null : { atLeastOneFilter: true };
    };
  }
  setCompanyProp() {
    let proprietor = this.queryForm.get('proprietor')?.value[0][0];
  }
}
