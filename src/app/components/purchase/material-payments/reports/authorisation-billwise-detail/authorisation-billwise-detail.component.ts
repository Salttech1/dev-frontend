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
  selector: 'app-authorisation-billwise-detail',
  templateUrl: './authorisation-billwise-detail.component.html',
  styleUrls: ['./authorisation-billwise-detail.component.css'],
})
export class AuthorisationBillwiseDetailComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  regionCode: any
  conditionId = 1
  loaderToggle: boolean = false;
  formName!: string;
  bldgCodeVal: string = '';
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    coyCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    name: new FormControl<string>('Bldgwise', Validators.required),
    report: new FormControl<boolean>(false, Validators.required),
    Remarks: new FormControl<string | null>(''),
    region: new FormControl<string | null>(''),
    range: new FormGroup({
      billFromDate: new FormControl<Date | null>(null),
      billToDate: new FormControl<Date | null>(null),
    }),
    authRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    exportType: new FormControl('PDF')
  }, {
    // validators: filterAtLeastOne()
  });

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
    this.queryForm.get('region')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.regionCode = res[0][0];
        }
      },
    })
    this.queryForm.get('bldgCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.bldgCodeVal = res[0][0];
        }
      },
    })
  }
  setConditionId() {
    if (this.queryForm.controls['range'].get('billFromDate')?.value && this.queryForm.controls['range'].get('billToDate')?.value && this.queryForm.controls['authRange'].get('from')?.value && this.queryForm.controls['authRange'].get('to')?.value) {
      this.conditionId = 1
    }
    else if (!this.queryForm.controls['range'].get('billFromDate')?.value && !this.queryForm.controls['range'].get('billToDate')?.value && !this.queryForm.controls['authRange'].get('from')?.value && !this.queryForm.controls['authRange'].get('to')?.value) {
      this.conditionId = 2
    }
    else if (!this.queryForm.controls['authRange'].get('from')?.value && !this.queryForm.controls['authRange'].get('to')?.value && this.queryForm.controls['range'].get('billFromDate')?.value && this.queryForm.controls['range'].get('billToDate')?.value) {
      this.conditionId = 3
    }
    else if (this.queryForm.controls['authRange'].get('from')?.value && this.queryForm.controls['authRange'].get('to')?.value && !this.queryForm.controls['range'].get('billFromDate')?.value && !this.queryForm.controls['range'].get('billToDate')?.value) {
      this.conditionId = 4
    }
  }

  getPeriod() {
    let authFrmRange = this.queryForm.controls['authRange'].get('from')?.value;
    let authToRange = this.queryForm.controls['authRange'].get('to')?.value;
    let billFrmDt = this.queryForm.controls['range'].get('billFromDate')?.value;
    let billToDt = this.queryForm.controls['range'].get('billToDate')?.value;
    if (authFrmRange && authToRange && billFrmDt && billToDt) {
      return `'Bill Date From ${moment(billFrmDt).format('DD.MM.YYYY')} to ${moment(billToDt).format('DD.MM.YYYY')} Authorisation Date From ${moment(authFrmRange).format('DD.MM.YYYY')} to ${moment(authToRange).format('DD.MM.YYYY')}'`
    }
    else {
      if (authFrmRange && authToRange) {
        return `'Authorisation Date From ${moment(authFrmRange).format('DD.MM.YYYY')} to ${moment(authToRange).format('DD.MM.YYYY')}'`
      }
      else if (billFrmDt && billToDt) {
        return `'Bill Date From ${moment(billFrmDt).format('DD.MM.YYYY')} to ${moment(billToDt).format('DD.MM.YYYY')}'`
      }
    }
    return ''
  }



  getReport(print: Boolean) {
    this.setConditionId()
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true
        let payLoad: Object = {
          name: (this.queryForm.get('name')?.value == 'Bldgwise' && "AuthBillwiseDet_BldgWise.rpt") || (this.queryForm.get('name')?.value == 'PartyWise' && "AuthBillwiseDet_PartyWise.rpt") || (this.queryForm.get('name')?.value == 'MaterialWise' && "AuthBillwiseDet_MaterialWise.rpt") || (this.queryForm.get('name')?.value == 'CoyWise' && "AuthBillwiseDet_CoyWise.rpt"),
          seqId: 1,
          conditionId: this.conditionId,
          isPrint: false,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            coy: this.queryForm.get('coyCode')?.value.length &&
              this.queryForm.get('coyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('coyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            bldgCode: this.queryForm.get('bldgCode')?.value.length && this.queryForm.get('bldgCode')?.value[0]!='ALL'
            ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
            : `'ALL'`,
            partyCode: this.queryForm.get('partyCode')?.value.length &&
              this.queryForm.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            matGroup: this.queryForm.get('matGroup')?.value.length &&
              this.queryForm.get('matGroup')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
              : `'ALL'`,
            region: this.queryForm.get('region')?.value.length
              ? `'${this.regionCode?.trim()}'`
              : `'ALL'`,
            billType: this.queryForm.get('report')?.value ? "'T'" : "'ALL'",
            billFromDate: `${moment(this.queryForm.get("range.billFromDate")?.value).format('DD/MM/YYYY')}`,
            billToDate: `${moment(this.queryForm.get("range.billToDate")?.value).format('DD/MM/YYYY')}`,
            authFromDate: `${moment(this.queryForm.get("authRange.from")?.value).format('DD/MM/YYYY')}`,
            authToDate: `${moment(this.queryForm.get("authRange.to")?.value).format('DD/MM/YYYY')}`,
            Period: this.getPeriod(),
            Remarks: this.queryForm.get('Remarks')?.value.length
              ? (this.queryForm.get('report')?.value ? `'${this.queryForm.get('Remarks')?.value} Transport'` : `'${this.queryForm.get('Remarks')?.value}'`)
              : (this.queryForm.get('report')?.value ? `'Transport'` : `''`),
            formName: this.formName,
            coyCloseDate: "01/01/2050"
          },
        }
        this._commonReport
          .getTtxParameterizedReportWithCondition(payLoad)
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
    }
    else {
      this.queryForm.markAllAsTouched();
      this.toastr.showError('Please fill the form properly');
    }
  }
  resetForm(){
    this.queryForm.reset({
    name:'Bldgwise',
     exportType: 'PDF'
    })
    setTimeout(function() {
      document.getElementById("company4")?.focus();
   }, 100);
  }
}
export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return (!g.get('bldgCode')?.value?.length && !g.get('matGroup')?.value?.length && !g.get('partyCode')?.value?.length && !g.get('coyCode')?.value?.length && !g.get('suppBillNo')?.value?.length) ? { atLeastOneFilter: true } : null
  };
}