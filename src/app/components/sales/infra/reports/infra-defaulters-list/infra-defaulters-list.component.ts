import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { SalesService } from 'src/app/services/sales/sales.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-infra-defaulters-list',
  templateUrl: './infra-defaulters-list.component.html',
  styleUrls: ['./infra-defaulters-list.component.css'],
})
export class InfraDefaultersListComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      custType: new FormControl<string>('ALL', Validators.required),
//      chargeCode: new FormControl<string>('INAP', Validators.required),
      name: new FormControl<string>('RptInfraDefaulterList.rpt', Validators.required),
      osAmtYN: new FormControl<string>('2', Validators.required),
      showsplfields: new FormControl<string>('Y', Validators.required),
      bldgCode: new FormControl<string[]>([]),
//      osAmt: new FormControl<number>(0, Validators.required ),
      osAmt: new FormControl<number | 0>({
        value: 0,
        disabled: true,
      }),

      cutOffDate: new FormControl<Date | null>(new Date()),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  url!: string;
  chargeCode!: string;
  getSessId!: number | null;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    private _dynapop: DynapopService
  ) {}

  ngOnInit(): void {
    this.url =
    this.router.url.split('/')[this.router.url.split('/').length - 1];
    console.log('URL I', this.url);
//     setTimeout(() => {
//       this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
// }, 10);
  //this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
  this.url == 'auxidefaultersreport' ? this.chargeCode = 'AUXI' : this.chargeCode = 'INAP'
  
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }
 enableOsAmt() {
    this.queryForm.patchValue({
      osAmt: 0,
    });
    this.queryForm.get('osAmt')?.enable();

}
disableOsAmt() {
  this.queryForm.patchValue({
    osAmt: 0,
  });
  this.queryForm.get('osAmt')?.disable();
}

  
  getReport(print: Boolean) {
    this.getSessId = null;
    console.log('URL', this.url);
    console.log('form', this.queryForm);
    const to = this.queryForm.get('cutOffDate')?.value;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let sessionPayload: any = {
          cutOffDate: moment(to).format('DD/MM/YYYY'),
          bldgCode: this.queryForm.get('bldgCode')?.value.length
            ? this.queryForm.get('bldgCode')?.value
            : ['ALL'],
          custType: this.queryForm.get('custType')?.value,
          osAmt: this.queryForm.get('osAmt')?.value,
//          chargeCode: this.queryForm.get('chargeCode')?.value,
chargeCode: this.chargeCode,
};

        console.log('sessionPayload', sessionPayload);
        this.loaderToggle = true;
        this._sales
          .getSessionInfraDefaultersList(sessionPayload)
          .pipe(
            take(1),
            switchMap((res: any) => {
              console.log('sess', res);

              // get report name based, BldgMatwise does not have Detail report hence if condition
              let payload: any = {
                name: this.queryForm.get('name')?.value,
                exportType: this.queryForm.get('exportType')?.value,
                isPrint: false,
                reportParameters: {
                  sessionId: res?.data,
                  formname: "'" + this.formName + "'",
                  HeaderText1: "'" + moment(to).format('DD/MM/YYYY') + "'",
                },

              };
              this.getSessId = res.data

              if (this.queryForm.get('osAmtYN')?.value == '1') {
                payload.seqId = 1;
              }else {
                payload.seqId = 2;
              }

              if (this.queryForm.get('osAmtYN')?.value == '1') {
                payload.reportParameters['osAmt'] =
                  this.queryForm.get('osAmt')?.value;
              }

              if (this.queryForm.get('showsplfields')?.value == 'Y') {
                payload.reportParameters['HeaderText2'] =
                "'" + this.queryForm.get('showsplfields')?.value + "'" ;
              }else {
                payload.reportParameters['HeaderText2'] ="'" + "" + "'";
              }

              // if (this.queryForm.get('chargeCode')?.value == 'INAP') {
              //   payload.reportParameters['HeaderText3'] =
              //   "'" + ' Defaulters List (Infra)' + "'" ;
              // } else {
              //   payload.reportParameters['HeaderText3'] =
              //   "'" + ' Defaulters List (Auxiliary)' + "'";
              // }
              if (this.chargeCode == 'INAP') {
                payload.reportParameters['HeaderText3'] =
                "'" + ' Defaulters List (Infra)' + "'" ;
              } else {
                payload.reportParameters['HeaderText3'] =
                "'" + ' Defaulters List (Auxiliary)' + "'";
              }
              console.log('PAYLOAD', payload);

              return this._commonReport.getParameterizedReportWithMultipleConditionAndParameter(
                payload
              );
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
                this.commonPdfReport(print, res);
                // delete session id API CALL
                this.delSessId()
            },
          });      }
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

  delSessId() {
    if (this.getSessId) {
      this._sales
        .deleteSessionId(this.getSessId)
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
      report: 'Detail',
      custType: 'ALL',
      name: 'RptInfraDefaulterList.rpt',
      osAmtYN: '2',
      showsplfields: 'Y',
      bldgCode: ([]),
      osAmt: 0,
      cutOffDate:(new Date()),
    });
       this.url =
    this.router.url.split('/')[this.router.url.split('/').length - 1];
//    this.url == 'auxidefaultersreport' ? this.queryForm.patchValue({chargeCode: 'AUXI'}) : this.queryForm.patchValue({chargeCode: 'INAP'})
this.url == 'auxidefaultersreport' ? this.chargeCode = 'AUXI' : this.chargeCode = 'INAP'
    setTimeout(function () {
      document.getElementById('party123')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgCode')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('cutOffDate')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('osAmt')?.value.length ? null : { atLeastOneFilter: true };
  };
}