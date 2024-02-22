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
  selector: 'app-paymentreceiptdetails',
  templateUrl: './paymentreceiptdetails.component.html',
  styleUrls: ['./paymentreceiptdetails.component.css'],
})
export class PaymentreceiptdetailsComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      exportType: new FormControl('PDF'),
      name: new FormControl<string>(
        'RptSocietyLessorRentPayable-PayCycle.rpt',
        Validators.required
      ),
      coyCode: new FormControl<string[]>([]),
      partyCode: new FormControl<string[]>([]),
      tranType: new FormControl<string[]>([]),
      location: new FormControl<string[]>([]),
      unitGroup: new FormControl<string[]>([]),
      payCycle: new FormControl<string[]>([]),
      checkAll: new FormControl(true),
      checkLocation: new FormControl(),
      checkUnitGroup: new FormControl(),
      checkExcludingCoy: new FormControl(),
      checkSelectiveCoy: new FormControl(),
      checkProprietor: new FormControl(),
      // range: new FormGroup({
      //   FromDate: new FormControl<Date | null>(null),
      //   ToDate: new FormControl<Date | null>(null),
      // }),
    }
    //    { validators: all() }
  );
  loaderToggle: boolean = false;
  formName!: string;
  coyCodeFilter = "par_partycode in('SOGR','SABC')";
  StrPaymentMode!: string;
  StrReportPara!: string;
  StrLocQuery!: string;
  StrLocExtraWhereCluse!: string;
  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _sales: SalesService,
    public _service: ServiceService,
    private router: Router,
    private _dynapop: DynapopService
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }
  getReport(print: Boolean) {
    console.log(this.queryForm.value);

    let strtranType = this.queryForm.get('tranType')?.value;
    let Allchecked = this.queryForm.get('checkAll')?.value;
    let UnitGroupchecked = this.queryForm.get('checkUnitGroup')?.value;
    let Locationchecked = this.queryForm.get('checkLocation')?.value;
    let checkedExcludingCoy = this.queryForm.get('checkExcludingCoy')?.value;
    let checkedSelectiveCoy = this.queryForm.get('checkSelectiveCoy')?.value;
    let checkedProprietor = this.queryForm.get('checkProprietor')?.value;
    console.log('strtranType', strtranType);

    if (Allchecked) {
      console.log('checked all');
    } else {
      console.log('not checked all');
    }

    if (UnitGroupchecked) {
      console.log('checked unit gropup');
    } else {
      console.log('not checked unit gropup');
    }
    if (Locationchecked) {
      console.log('checked Location');
    } else {
      console.log('not checked Location');
    }
    if (checkedExcludingCoy) {
      console.log('checked ExcludingCoy');
    } else {
      console.log('not checked ExcludingCoy');
    }
    if (checkedProprietor) {
      console.log('checked Proprietor');
    } else {
      console.log('not checked Proprietor');
    }
    if (checkedSelectiveCoy) {
      console.log('checked SelectiveCoy');
    } else {
      console.log('not checked SelectiveCoy');
    }

    if (checkedExcludingCoy || checkedSelectiveCoy) {
      var componyName: any = this.queryForm.get('coyCode');
      console.log('checked ExcludingCoy', componyName.value);

      componyName.value.length != 0
        ? componyName.setErrors(null)
        : componyName.setErrors({ isCompanyCodeRequired: true });
    } else {
      console.log('not checked ExcludingCoy');
      var componyName: any = this.queryForm.get('coyCode');
      componyName.setErrors(null);
    }

    console.log('from v', this.queryForm);
    // let from = this.queryForm.get('range')?.value.FromDate;
    // let to = this.queryForm.get('range')?.value.ToDate;
    if (this.queryForm.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.queryForm.get('exportType')?.value
        )
      ) {
        if (strtranType == 'Both') {
          this.StrPaymentMode = " 'P','R'";
        }
        if (strtranType == 'Payment') {
          this.StrPaymentMode = "'P'";
        }
        if (strtranType == 'Receipt') {
          this.StrPaymentMode = "'R'";
        }
        console.log('StrPaymentMode11', this.StrPaymentMode);

        if (checkedProprietor) {
          console.log('checked11 Proprietor');
            this.queryForm.patchValue({ name: 'RptLessorPropritorwise.rpt' });
          //this.queryForm.controls["name"].setValue("RptLessorPropritorwise.rpt") ;
          console.log('before 1 StrPaymentMode',this.StrPaymentMode);
          this.StrPaymentMode = ' in (' + this.StrPaymentMode + ') ';
          console.log('before 2 StrPaymentMode',this.StrPaymentMode);
          this.StrReportPara = this.StrPaymentMode;
          console.log('after StrPaymentMode',this.StrPaymentMode);
          console.log('after StrReportPara',this.StrReportPara);

        } else {
          console.log('not checked12 Proprietor');
          if (Allchecked) {
            console.log('checked all');
            this.StrLocExtraWhereCluse = '';
          } else {
            console.log('not checked all');
            if (checkedExcludingCoy) {
              console.log('checked13 ExcludingCoy');
              this.StrLocExtraWhereCluse =
                " and trim(a.lessor_coy) not in('" +
                this.queryForm.get('coyCode')?.value[0].trim() +
                "') ";

              console.log(
                'excthis.StrLocExtraWhereCluse',
                this.StrLocExtraWhereCluse
              );
            } else {
              if (checkedSelectiveCoy) {
                this.StrLocExtraWhereCluse =
                  " and trim(a.lessor_coy) not in('" +
                  this.queryForm.get('coyCode')?.value[0].trim() +
                  "') ";
                console.log(
                  'selthis.StrLocExtraWhereCluse',
                  this.StrLocExtraWhereCluse
                );
              }
            }
          }
          if (Locationchecked && !UnitGroupchecked) {
            this.queryForm.patchValue({
              name: 'RptSocietyLessorRentPayable-PayCycle.rpt',
            });
            if (!this.queryForm.get('location')?.value[0]) {
              console.log("location undefine");
              
              this.StrLocQuery =
                ' and a.lessor_paytype	in (' +
                this.StrPaymentMode +
                ') ' +
                this.StrLocExtraWhereCluse;
            } else {
              this.StrLocQuery =
                ' and a.lessor_paytype	in (' +
                this.StrPaymentMode +
                ") and trim(a.lessor_location) ='" +
                this.queryForm.get('location')?.value[0].trim() +
                "'" +
                this.StrLocExtraWhereCluse;
            }
            this.StrReportPara = this.StrLocQuery;
            //            ArrProParamValues.Add(StrLocQuery)
          } else {
            if (Locationchecked && UnitGroupchecked) {
              this.queryForm.patchValue({
                name: 'RptSocietyLessorRentPayable-PayCycle.rpt',
              });
              if (
                (!this.queryForm.get('location')?.value[0]) &&
                (!this.queryForm.get('unitGroup')?.value[0])
              ) {
                this.StrLocQuery =
                  ' and a.lessor_paytype	in (' +
                  this.StrPaymentMode +
                  ') ' +
                  this.StrLocExtraWhereCluse;
              } else {
                if (
                  (!this.queryForm.get('location')?.value[0]) &&
                  (this.queryForm.get('unitGroup')?.value[0])
                ) {
                  this.StrLocQuery =
                    ' and a.lessor_paytype	in (' +
                    this.StrPaymentMode +
                    ") and trim(b.lessor_unitgroup)='" +
                    this.queryForm.get('unitGroup')?.value[0].trim() +
                    "'" +
                    this.StrLocExtraWhereCluse;
                } else {
                  this.StrLocQuery =
                    ' and a.lessor_paytype	in (' +
                    this.StrPaymentMode +
                    ") and trim(a.lessor_location) ='" +
                    this.queryForm.get('location')?.value[0].trim() +
                    "' and trim(b.lessor_unitgroup)='" +
                    this.queryForm.get('unitGroup')?.value[0].trim() +
                    "'" +
                    this.StrLocExtraWhereCluse;
                }
              }
              this.StrReportPara = this.StrLocQuery;
              //              ArrProParamValues.Add(StrLocQuery)
            } else {
              if (!Locationchecked && UnitGroupchecked) {
                this.queryForm.patchValue({
                  name: 'RptSocietyLessorRentPayable-PayCycle.rpt',
                });
                this.StrLocQuery =
                  ' and a.lessor_paytype in (' +
                  this.StrPaymentMode +
                  ") and trim(b.lessor_unitgroup)='" +
                  this.queryForm.get('unitGroup')?.value[0].trim() +
                  "'" +
                  this.StrLocExtraWhereCluse;
                //                ArrProParamValues.Add(StrLocQuery)
              } else {
                if (
                  (this.queryForm.get('partyCode')?.value[0]) &&
                  (!this.queryForm.get('location')?.value[0]) &&
                  (!this.queryForm.get('payCycle')?.value[0])
                ) {
                  this.queryForm.patchValue({
                    name: 'RptSocietyLessorRentPartyType.rpt',
                  });
                  this.StrPaymentMode =
                    ' in (' +
                    this.StrPaymentMode +
                    ") and trim(lpersonmst.lessor_partycode)='" +
                    this.queryForm.get('partyCode')?.value[0].trim() +
                    "'" +
                    this.StrLocExtraWhereCluse;
                    this.StrReportPara = this.StrPaymentMode;
                    //                  ArrProParamValues.Add(StrPaymentMode)
                } else {
                  if (
                    (this.queryForm.get('location')?.value[0]) &&
                    (!this.queryForm.get('partyCode')?.value[0]) &&                    
                    (!this.queryForm.get('payCycle')?.value[0])
                  ) {
                    this.queryForm.patchValue({
                      name: 'RptSocietyLessorRentPayable.rpt',
                    });
                    this.StrPaymentMode = " in (" + this.StrPaymentMode + ") and trim(lprop.lessor_location)='" + this.queryForm.get('location')?.value[0].trim() + "'" + this.StrLocExtraWhereCluse;
                    this.StrReportPara = this.StrPaymentMode;
                    //                  ArrProParamValues.Add(StrPaymentMode)
                  } else {
                    if (
                      (this.queryForm.get('location')?.value[0]) &&
                      (this.queryForm.get('partyCode')?.value[0]) &&                    
                      (!this.queryForm.get('payCycle')?.value[0])
                    ) {
                      this.queryForm.patchValue({
                        name: 'RptSocietyLessorRentPartyType.rpt',
                      });
                      this.StrPaymentMode = " in (" + this.StrPaymentMode + ") and trim(lpersonmst.lessor_partycode)='" + this.queryForm.get('partyCode')?.value[0].trim() + "' and trim(lprop.lessor_location)='" + this.queryForm.get('location')?.value[0].trim() + "'" + this.StrLocExtraWhereCluse;
                      this.StrReportPara = this.StrPaymentMode;
//                      ArrProParamValues.Add(StrPaymentMode)
                    } else {
                      if (this.queryForm.get('payCycle')?.value[0]
                      ) {
                        this.queryForm.patchValue({
                          name: 'RptSocietyLessorRentPayable.rpt',
                        });
                        this.StrPaymentMode = " in (" + this.StrPaymentMode + ") and trim(lessor_paycycle)='" + this.queryForm.get('payCycle')?.value[0]?.trim() + "'" + this.StrLocExtraWhereCluse;
                        this.StrReportPara = this.StrPaymentMode;
//                        ArrProParamValues.Add(StrPaymentMode)
                      } else {
                        this.queryForm.patchValue({
                          name: 'RptSocietyLessorRentPayable.rpt',
                        });
                        this.StrPaymentMode = " in (" + this.StrPaymentMode + ") " + this.StrLocExtraWhereCluse;
                        this.StrReportPara = this.StrPaymentMode;
//                        ArrProParamValues.Add(StrPaymentMode)

                      } 
                    }
                  }
                }
              }
            }
          }
          console.log('after1 StrReportPara',this.StrReportPara);

          // If chkLocation.Checked = True And chkUnitGroup.Checked = False Then
          //     Me.ReportFilename = "RptSocietyLessorRentPayable-PayCycle.rpt"
          //     'a.lessor_paytype 	in ({?StrPayType})
          //     If TxtLocation.Text = "" Then
          //         StrLocQuery = " and a.lessor_paytype	in (" & StrPaymentMode & ") " & StrLocExtraWhereCluse
          //     Else
          //         StrLocQuery = " and a.lessor_paytype	in (" & StrPaymentMode & ") and a.lessor_location ='" & TxtLocation.Text & "'" & StrLocExtraWhereCluse
          //     End If
          //     ArrProParamValues.Add(StrLocQuery)
          // Else
          //     If chkLocation.Checked = True And chkUnitGroup.Checked = True Then
          //         Me.ReportFilename = "RptSocietyLessorRentPayable-PayCycle.rpt"
          //         If TxtLocation.Text = "" And txtUnitGroup.Text = "" Then
          //             StrLocQuery = " and a.lessor_paytype	in (" & StrPaymentMode & ") " & StrLocExtraWhereCluse
          //         Else
          //             If TxtLocation.Text = "" And txtUnitGroup.Text <> "" Then
          //                 StrLocQuery = " and a.lessor_paytype	in (" & StrPaymentMode & ") and trim(b.lessor_unitgroup)='" & Trim(txtUnitGroup.Text) & "'" & StrLocExtraWhereCluse
          //             Else
          //                 StrLocQuery = " and a.lessor_paytype	in (" & StrPaymentMode & ") and a.lessor_location ='" & TxtLocation.Text & "' and trim(b.lessor_unitgroup)='" & Trim(txtUnitGroup.Text) & "'" & StrLocExtraWhereCluse
          //             End If
          //         End If
          //         ArrProParamValues.Add(StrLocQuery)
          //     Else
          //         If chkLocation.Checked = False And chkUnitGroup.Checked = True Then
          //             Me.ReportFilename = "RptSocietyLessorRentPayable-PayCycle.rpt"
          //             StrLocQuery = " and a.lessor_paytype in (" & StrPaymentMode & ") and trim(b.lessor_unitgroup)='" & Trim(txtUnitGroup.Text) & "'" & StrLocExtraWhereCluse
          //             ArrProParamValues.Add(StrLocQuery)
          //         Else
          //             If TxtParty.Text <> "" And TxtLocation.Text = "" And TxtPAYCYCLE.Text = "" Then
          //                 Me.ReportFilename = "RptSocietyLessorRentPartyType.rpt"
          //                 StrPaymentMode = " in (" & StrPaymentMode & ") and lpersonmst.lessor_partycode='" & Trim(TxtParty.Text) & "'" & StrLocExtraWhereCluse
          //                 ArrProParamValues.Add(StrPaymentMode)
          //             Else
          //                 If TxtLocation.Text <> "" And TxtParty.Text = "" And TxtPAYCYCLE.Text = "" Then
          //                     StrPaymentMode = " in (" & StrPaymentMode & ") and lprop.lessor_location='" & Trim(TxtLocation.Text) & "'" & StrLocExtraWhereCluse
          //                     ArrProParamValues.Add(StrPaymentMode)
          //                     Me.ReportFilename = "RptSocietyLessorRentPayable.rpt"
          //                 Else
          //                     If TxtLocation.Text <> "" And TxtParty.Text <> "" And TxtPAYCYCLE.Text = "" Then
          //                         StrPaymentMode = " in (" & StrPaymentMode & ") and lpersonmst.lessor_partycode='" & Trim(TxtParty.Text) & "' and lprop.lessor_location='" & Trim(TxtLocation.Text) & "'" & StrLocExtraWhereCluse
          //                         ArrProParamValues.Add(StrPaymentMode)
          //                         Me.ReportFilename = "RptSocietyLessorRentPartyType.rpt"
          //                     Else
          //                         If TxtPAYCYCLE.Text <> "" Then
          //                             StrPaymentMode = " in (" & StrPaymentMode & ") and lessor_paycycle='" & Trim(TxtPAYCYCLE.Text) & "'" & StrLocExtraWhereCluse
          //                             Me.ReportFilename = "RptSocietyLessorRentPayable.rpt"
          //                             ArrProParamValues.Add(StrPaymentMode)
          //                         Else
          //                             Me.ReportFilename = "RptSocietyLessorRentPayable.rpt"
          //                             StrPaymentMode = " in (" & StrPaymentMode & ") " & StrLocExtraWhereCluse
          //                             ArrProParamValues.Add(StrPaymentMode)
          //                         End If
          //                     End If
          //                 End If
          //             End If
          //         End If
          //     End If
          // End If
        }
        let payload: any = {
          name: this.queryForm.get('name')?.value,
          exportType: this.queryForm.get('exportType')?.value,
          isPrint: false,
          seqId: 1,
          reportParameters: {
            //StrPayType: this.StrPaymentMode,
            StrPayType: this.StrReportPara,

            // bldgCode: this.queryForm.get('bldgCode')?.value.length &&
            //   this.queryForm.get('bldgCode')?.value[0] != 'ALL'
            //   ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
            //   : `'ALL'`,

            formname: "'" + this.formName + "'",
          },
        };

        console.log('PAYLOAD', payload);

        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReport(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(print, res);
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

  resetForm() {
    this.queryForm.reset({
      exportType: 'PDF',
      name: 'RptSocietyLessorRentPayable-PayCycle.rpt',
    });
    setTimeout(function () {
      document.getElementById('party123')?.focus();
    }, 100);
  }
}

// export function all() {
//   return (g: AbstractControl) => {
//     return g.get('coyCode')?.value.length ? null : { atLeastOneFilter: true };
//   };
// }
