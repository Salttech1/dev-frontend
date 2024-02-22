import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-purchase-bills-outstanding',
  templateUrl: './purchase-bills-outstanding.component.html',
  styleUrls: ['./purchase-bills-outstanding.component.css'],
})
export class PurchaseBillsOutstandingComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`;
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      coyCode: new FormControl<string[]>([]),
      partyCode: new FormControl<string[]>([]),
      bldgCode: new FormControl<string[]>([]),
      matGroup: new FormControl<string[]>([]),
      name: new FormControl<string>('CoyWise', Validators.required),
      report: new FormControl<string>('Detail', Validators.required),
      Remarks: new FormControl<string | null>(''),
      range: new FormGroup({
        suppBillFromDate: new FormControl<Date | null>(null),
        suppBillToDate: new FormControl<Date | null>(null),
      }),
    },
    // { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  url!: string;
  getSessId!: number | null;
  isAgeing: boolean = false

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    public _service: ServiceService,
    private router: Router,
    private _dynapop: DynapopService
  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName =
          this.url == 'purchasebillsoutstanding'
            ? `'${val.formName}'`
            : `${val.formName}`;
      },
    });
  }

  getReport(print: Boolean) {
    this.getSessId = null
    console.log('queryForm', print);
    let from = this.queryForm.get('range')?.value.suppBillFromDate;
    let to = this.queryForm.get('range')?.value.suppBillToDate;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let addAgingPayload: any = {};
        //get session code to use in form payload
        let sessionPayload: any = {
          coyCode: this.queryForm.get('coyCode')?.value.length
            ? this.queryForm.get('coyCode')?.value
            : ['ALL'],
          bldgCode: this.queryForm.get('bldgCode')?.value.length
            ? this.queryForm.get('bldgCode')?.value
            : ['ALL'],
          matGroup: this.queryForm.get('matGroup')?.value.length
            ? this.queryForm.get('matGroup')?.value
            : ['ALL'],
          partyCode: this.queryForm.get('partyCode')?.value.length
            ? this.queryForm.get('partyCode')?.value
            : ['ALL'],
          isAgeingReport: this.url == 'purchasebillsoutstanding' ? false : true,
        };

        if (from && to) {
          sessionPayload.suppBillFromDate =
            this.url == 'purchasebillsoutstanding'
              ? moment(from).format('DD.MM.YYYY')
              : moment(from).format('DD/MM/YYYY');
          sessionPayload.suppBillToDate =
            this.url == 'purchasebillsoutstanding'
              ? moment(to).format('DD.MM.YYYY')
              : moment(to).format('DD/MM/YYYY');
        }

        console.log('sessionPayload', sessionPayload);
        // return;
        this.loaderToggle = true;
        this._purch
          .getSessionPurchBillOutstanding(sessionPayload)
          .pipe(
            take(1),
            switchMap((res: any) => {
              // get report name based, BldgMatwise does not have Detail report hence if condition
              let name = this.queryForm.get('name')?.value;
              name =
                this.url == 'purchasebillsoutstanding'
                  ? name == 'BldgMatwise'
                    ? `PurchaseBill_BldgMatwise_Summ.rpt`
                    : `PurchaseBill_${this.queryForm.get('name')?.value}_${this.queryForm.get('report')?.value
                    }.rpt`
                  : (name = 'FA_RP_DRS_CRS_Ageing.rpt');

              let payload: any = {
                name: name,
                isPrint: false,
                seqId: 1,
                exportType: this.queryForm.get('exportType')?.value,
                reportParameters: {
                  sessionId: res.data,
                  formname: this.formName,
                },
              };
              this.getSessId = res.data

              this.url == 'supplierageingreport' &&
                (sessionPayload.sessionId = res.data);
              if (this.url == 'purchasebillsoutstanding') {
                // In payload added remarks for purchasebillsOutstanding
                payload.reportParameters.Remarks = `'${this.queryForm.get('Remarks')?.value
                  }'`;
              } else if (this.url == 'supplierageingreport') {
                let all: string[] = ['All'],
                  response: any;
                this.queryForm.get('coyCode')?.value.length > 1 &&
                  (payload.reportParameters.HeaderText2 = this.queryForm
                    .get('coyCode')
                    ?.value?.join(','));
                this.queryForm.get('coyCode')?.value == all &&
                  (payload.reportParameters.HeaderText2 = null);
                this.queryForm.get('coyCode')?.value.length == 1 &&
                  this.queryForm.get('coyCode')?.value !== all &&
                  this._dynapop
                    .getDynaPopSearchListObj(
                      'COMPANY',
                      ``,
                      this.queryForm.get('coyCode')?.value[0]
                    )
                    .subscribe({
                      next: (res: any) => {
                        response = res;
                      },
                      complete: () => {
                        payload.reportParameters.HeaderText2 =
                          response.data.dataSet[0][1]?.trim();
                      },
                    });
                payload.reportParameters.HeaderText1 =
                  from && to
                    ? `As On ${moment(to).format('DD/MM/YYYY')}`
                    : `As On ${moment(new Date()).format('DD/MM/YYYY')}`;
              }
              console.log('payload', payload);

              if (from && to) {
                payload.reportParameters.BillFrom = `'${moment(from).format(
                  'DD/MM/YYYY'
                )}'`;
                payload.reportParameters.BillUpTo = `'${moment(to).format(
                  'DD/MM/YYYY'
                )}'`;
              }
              addAgingPayload = payload;
              return this.url == 'purchasebillsoutstanding'
                ? this._commonReport.getTtxParameterizedReport(payload)
                : this._commonReport.addIntoAgeingTempTable(sessionPayload);
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if(this.url == 'purchasebillsoutstanding' && res ){
                this.commonPdfReport(print, res);
                // delete session id API CALL
                this.delSessId()
              }
              if (this.url == 'supplierageingreport') {
                if (res.status) {
                  this._commonReport
                    .getParameterizedReport(addAgingPayload)
                    .subscribe({
                      next: (res) => {
                        this.commonPdfReport(print, res);
                        // delete session id API CALL
                        this.delSessId()
                      },
                    });
                } else {
                  this.toastr.showError('No Data Found');
                }
              }
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
    this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
  }

  delSessId() {
    this.isAgeing = this.url == 'purchasebillsoutstanding' ? false : true;
    if (this.getSessId) {
      this._purch.deleteSessionId(this.getSessId, this.isAgeing).pipe(take(1), finalize(() => {
        this.loaderToggle = false
      })).subscribe({
        next: (res: any) => {
          if (res.status) {
          }
          else {
            this.toastr.showError(res.message)
          }
        }
      })
    }
  }

  resetForm(){
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'CoyWise',
      report: 'Detail'
    })
    setTimeout(function() {
      document.getElementById("party123")?.focus();
   }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('coyCode')?.value.length ||
      g.get('partyCode')?.value.length ||
      g.get('bldgCode')?.value.length ||
      g.get('matGroup')?.value.length
      ? null
      : { atLeastOneFilter: true };
  };
}
