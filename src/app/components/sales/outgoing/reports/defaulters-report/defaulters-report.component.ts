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
import { OutgoingService } from 'src/app/services/sales/outgoing.service';

@Component({
  selector: 'app-defaulters-report',
  templateUrl: './defaulters-report.component.html',
  styleUrls: ['./defaulters-report.component.css'],
})
export class DefaultersReportComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      custType: new FormControl<string>('ALL', Validators.required),
      name: new FormControl<string>(
        'RptOutgoingDefaulterList.rpt',
        Validators.required
      ),
      showsplfields: new FormControl<string>('1', Validators.required),
      bldgCode: new FormControl<string[]>([]),
      wing: new FormControl<string[]>([]),
      ownerId: new FormControl<string[]>([]),
      checkedSpecial: new FormControl(),
      checkedOGStart: new FormControl(),
      checkedOSAmt: new FormControl(),
      osAmt: new FormControl<number | 0>({
        value: 0,
        disabled: true,
      }),
      ogStart: new FormControl(),
      cutOffDate: new FormControl<Date | null>(new Date()),
    },
    { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  getSessId!: number | null;
  subidBldgcode?: string;
  subidBldgcodeAndWing?: string = '';

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _sales: SalesService,
    public _service: ServiceService,
    public _ogService: OutgoingService
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }

  osAmtstatusChanged(values: any): void {
    if (values.currentTarget.checked == true) {
      this.queryForm.patchValue({
        osAmt: 0,
      });
      this.queryForm.get('osAmt')?.enable();
    } else {
      this.queryForm.patchValue({
        osAmt: 0,
      });
      this.queryForm.get('osAmt')?.disable();
    }
  }

  setSubidBldgcode() {
    // Filter building wings
    if (this.queryForm.get('bldgCode')?.value.length > 0) {
      this.subidBldgcode =
        "flat_bldgcode='" +
        this.queryForm.get('bldgCode')?.value[0].trim() +
        "'";
      this.setSubidBldgcodeAndWing();
    }
  }

  setSubidBldgcodeAndWing() {
    // Filter flat owners
    let wing: string | undefined;
    if (this.queryForm.get('wing')?.value.length == 0) {
      this.subidBldgcodeAndWing =
        "fown_bldgcode = '" +
        this.queryForm.get('bldgCode')?.value[0].trim() +
        "'";
    } else {
      this.subidBldgcodeAndWing =
        "fown_bldgcode = '" +
        this.queryForm.get('bldgCode')?.value[0].trim() +
        "' and fown_wing='" +
        this.queryForm.get('wing')?.value?.[0] +
        "'";
    }
  }

  getReport(print: Boolean) {
    this.getSessId = null;
    const to = this.queryForm.get('cutOffDate')?.value;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        let sessionPayload: any = {
          bldgCode:
            this.queryForm.get('bldgCode')?.value.length &&
            this.queryForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,

          // wing: this.queryForm.get('wing')?.value.length
          // ? this.queryForm.get('wing')?.value
          // : ['ALL'],
          wing:
            this.queryForm.get('wing')?.value.length &&
            this.queryForm.get('wing')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('wing')?.value.join(`','`)}'`
              : `'ALL'`,
          // flatOwner: this.queryForm.get('ownerId')?.value.length
          // ? this.queryForm.get('ownerId')?.value
          // : ['ALL'],

          flatOwner:
            this.queryForm.get('ownerId')?.value.length &&
            this.queryForm.get('ownerId')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('ownerId')?.value.join(`','`)}'`
              : `'ALL'`,
          cutOffDate: moment(to).format('DD/MM/YYYY'),
          custType: this.queryForm.get('custType')?.value,
          osAmount: this.queryForm.get('osAmt')?.value,
        };
        if (this.queryForm.get('checkedOSAmt')?.value == '1') {
          sessionPayload['osAmtCheck'] =
            this.queryForm.get('checkedOSAmt')?.value;
        } else {
          sessionPayload['osAmtCheck'] = false;
        }

        console.log('sessionPayload', sessionPayload);
        this.loaderToggle = true;
        this._ogService
          .getOutgoingDefaultersListTempTableData(sessionPayload)
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
                  Intsessid: res?.data,
                  formname: this.formName,
                  HeaderText3: moment(to).format('DD/MM/YYYY'),
                },
              };
              this.getSessId = res.data;    // This is used to delete processed rows from temp table

              if (this.queryForm.get('osAmtYN')?.value == '1') {
                payload.seqId = 1;
                payload.reportParameters['osAmt'] =
                  this.queryForm.get('osAmt')?.value;
              } else {
                payload.seqId = 2;
              }

              if (this.queryForm.get('checkedSpecial')?.value == '1') {
                payload.reportParameters.HeaderText1 = 'Y';
              } else {
                payload.reportParameters.HeaderText1 = '';
              }
              if (this.queryForm.get('checkedOGStart')?.value == '1') {
                payload.reportParameters.HeaderText2 = 'True';
              } else {
                payload.reportParameters.HeaderText2 = 'False';
              }
              console.log('PAYLOAD', payload);

              return this._commonReport.getParameterizedReport(payload);
            }),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
              // delete session id API CALL
              this.delSessId();
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }
  }

  // getReport(print: Boolean) {
  //   if (this.queryForm.valid) {
  //     let getSessId = 547741;
  //     if (
  //       this._service.printExcelChk(
  //         print,
  //         this.queryForm.get('exportType')?.value
  //       )
  //     ) {
  //       let payload: any = {
  //         name: this.queryForm.get('name')?.value,
  //         exportType: this.queryForm.get('exportType')?.value,
  //         isPrint: false,
  //         seqId: 1,
  //         reportParameters: {
  //           formname: this.formName,
  //           Intsessid: getSessId
  //         },
  //       };
  //       if (this.queryForm.get('checkedSpecial')?.value == true) {
  //         payload.reportParameters.HeaderText1 = "Y";
  //       } else{
  //         payload.reportParameters.HeaderText1 = "";
  //       }
  //       if (this.queryForm.get('checkedOGStart')?.value == true) {
  //         payload.reportParameters.HeaderText2 = "True";
  //       } else{
  //         payload.reportParameters.HeaderText2 = "False";
  //       }
  //       payload.reportParameters.HeaderText3 = `${moment(this.queryForm.get('cutOffDate')?.value.FromDate).format(
  //         'DD/MM/YYYY'
  //       )}`;
  //       console.log('PAYLOAD', payload);

  //       this.loaderToggle = true;
  //       this._commonReport
  //         .getParameterizedReport(payload)
  //         .pipe(
  //           take(1),
  //           finalize(() => (this.loaderToggle = false))
  //         )
  //         .subscribe({
  //           next: (res: any) => {
  //             if (res) {
  //               this.commonPdfReport(print, res);
  //             } else {
  //               this.toastr.showError('No Data Found');
  //             }
  //           },
  //         });
  //     }
  //   } else {
  //     this.toastr.showError('Please fill the form properly');
  //     this.queryForm.markAllAsTouched();
  //   }
  // }

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
      name: 'RptOutgoingDefaulterList.rpt',
      osAmtYN: '2',
      showsplfields: 'Y',
      bldgCode: [],
      wing: [],
      ownerId: [],
      osAmt: 0,
      cutOffDate: new Date(),
    });
    setTimeout(function () {
      document.getElementById('bldgCode')?.focus();
    }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('bldgCode')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('wing')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('ownerId')?.value.length ? null : { atLeastOneFilter: true };
    return g.get('cutOffDate')?.value.length
      ? null
      : { atLeastOneFilter: true };
    return g.get('osAmt')?.value.length ? null : { atLeastOneFilter: true };
  };
}
