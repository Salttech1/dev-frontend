import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
@Component({
  selector: 'app-authorisations-bldg-mat-supp-detail',
  templateUrl: './authorisations-bldg-mat-supp-detail.component.html',
  styleUrls: ['./authorisations-bldg-mat-supp-detail.component.css']
})
export class AuthorisationsBldgMatSuppDetailComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    //  name: new FormControl<string>('CoyWise', Validators.required),
    range: new FormGroup({
      suppBillFromDate: new FormControl<Date | null>(null),
      suppBillToDate: new FormControl<Date | null>(null),
    }),
    exportType: new FormControl('PDF')
  }, {
    // validators: filterAtLeastOne()
  });

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    public _service: ServiceService
  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    console.log('queryForm', this.queryForm,);
    if (this.queryForm?.valid) {
      let fromDt = this.queryForm.controls['range'].get('suppBillFromDate')?.value;
      let toDt = this.queryForm.controls['range'].get('suppBillToDate')?.value;
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true
        let payload: Object = {
          name: "AuthDetailBldgMatSupSumm.rpt",
          isPrint: false,
          seqId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          conditionId: (this.queryForm.controls['range'].get('suppBillFromDate')?.value && this.queryForm.controls['range'].get('suppBillToDate')?.value) ? 1 : 2,
          reportParameters: {
            bldgCode: this.queryForm.get('bldgCode')?.value.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
            matCode: this.queryForm.get('matGroup')?.value.length &&
              this.queryForm.get('matGroup')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
              : `'ALL'`,
            formname: this.formName,
            partyCode: this.queryForm.get('partyCode')?.value.length &&
              this.queryForm.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            FromDate: `'${moment(this.queryForm.controls['range'].get('suppBillFromDate')?.value).format('DD/MM/YYYY')}'`,
            ToDate: `'${moment(this.queryForm.controls['range'].get('suppBillToDate')?.value).format('DD/MM/YYYY')}'`,
            chkPeriod: (fromDt && toDt)? "'Y'":"'N'"
          }
        }
        this._commonReport
          .getTtxParameterizedReportWithCondition(payload)
          .pipe(
            take(1),
            finalize(() => (this.loaderToggle = false))
          )
          .subscribe({
            next: (res: any) => {
              if (res) {
                let filename = this._commonReport.getReportName();
                this._service.exportReport(print, res, this.queryForm.get('exportType')?.value, filename)
              }
            },
          });
      }
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }

  }

  resetForm(){
    this.queryForm.reset({
     exportType: 'PDF'})
    setTimeout(function() {
      document.getElementById("building123")?.focus();
   }, 100);
  }

}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return (!g.get('bldgCode')?.value?.length && !g.get('matGroup')?.value?.length && !g.get('partyCode')?.value?.length) ? { atLeastOneFilter: true } : null
  };
}
