import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { PurchService } from 'src/app/services/purch/purch.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-authorisation-report-auth-cheque',
  templateUrl: './authorisation-report-auth-cheque.component.html',
  styleUrls: ['./authorisation-report-auth-cheque.component.css']
})
export class AuthorisationReportAuthChequeComponent implements OnInit {
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    coyCode: new FormControl<string[]>([]),
    prop: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    auth: new FormControl<string[] | null>([]),
    cheque: new FormControl<string[] | null>([]),
    range: new FormGroup({
      authFromDate: new FormControl<Date | null>(null),
      authToDate: new FormControl<Date | null>(null),
    }),
    exportType: new FormControl('PDF')
  },
    { validators: [this.authChequeValidation(), this.requiredValidation()] }
  );

  loaderToggle: boolean = false;
  formName!: string;
  authSubId: string = ''
  chqSubId: string = ``
  authFieldDisabled: boolean = true
  chqFieldDisabled: boolean = true
  partyCondition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  coy: string = ''
  prop: string = ''
  bldgCode: string = ''
  matGroup: string = ''
  partyCode: string = ''
  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _purch: PurchService,
    public _service: ServiceService,

  ) { }

  ngOnInit(): void {
    // get formname from pagedata Observable
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    this.forJoinTrigger()
  }

  forJoinTrigger() {
    this.queryForm.get('bldgCode')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
    })
    this.queryForm.get('partyCode')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
    })
    this.queryForm.get('matGroup')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
    })
    this.queryForm.get('range')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
    })
    this.queryForm.get('coyCode')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
      this.queryForm.get('cheque')?.patchValue([])
    })
    this.queryForm.get('prop')?.valueChanges.subscribe((res) => {
      this.queryForm.get('auth')?.patchValue([])
      this.queryForm.get('cheque')?.patchValue([])
    })
  }

  setMultiSelectField() {
    this.coy = this.queryForm.get('coyCode')?.value instanceof Object && this.queryForm.get('coyCode')?.value?.length &&
      this.queryForm.get('coyCode')?.value[0] != 'ALL'
      ? `'${this.queryForm.get('coyCode')?.value.join(`','`)}'`
      : `'ALL'`
    this.prop = this.queryForm.get('prop')?.value instanceof Object && this.queryForm.get('prop')?.value?.length &&
      this.queryForm.get('prop')?.value[0] != 'ALL'
      ? `'${this.queryForm.get('prop')?.value.join(`','`)}'`
      : `'ALL'`
    this.bldgCode = this.queryForm.get('bldgCode')?.value instanceof Object && this.queryForm.get('bldgCode')?.value?.length &&
      this.queryForm.get('bldgCode')?.value[0] != 'ALL'
      ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
      : `'ALL'`,
      this.matGroup = this.queryForm.get('matGroup')?.value instanceof Object && this.queryForm.get('matGroup')?.value?.length &&
        this.queryForm.get('matGroup')?.value[0] != 'ALL'
        ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
        : `'ALL'`,
      this.partyCode = this.queryForm.get('partyCode')?.value instanceof Object && this.queryForm.get('partyCode')?.value?.length &&
        this.queryForm.get('partyCode')?.value[0] != 'ALL'
        ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
        : `'ALL'`
  }

  getReport(print: Boolean) {
    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.setMultiSelectField()
        this.loaderToggle = true
        let payload: Object = {
          name: "AuthNoCheqNo.rpt",
          isPrint: false,
          seqId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          conditionId: (this.queryForm.get('range.authFromDate')?.value && this.queryForm.get('range.authToDate')?.value) ? 1 : 2,
          reportParameters: {
            bldgCode: this.bldgCode,
            partyCode: this.partyCode,
            matGroup: this.matGroup,
            coy: this.coy,
            prop: this.prop,
            authNo: this.queryForm.get('auth')?.value?.length &&
              this.queryForm.get('auth')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('auth')?.value.join(`','`)}'`
              : `'ALL'`,
            chequeNo: this.queryForm.get('cheque')?.value?.length &&
              this.queryForm.get('cheque')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('cheque')?.value.join(`','`)}'`
              : `'ALL'`,
            fromDate: `${moment(this.queryForm.get('range.authFromDate')?.value).format('DD/MM/YYYY')}`,
            toDate: `${moment(this.queryForm.get('range.authToDate')?.value).format('DD/MM/YYYY')}`,
            formname: this.formName,
          },
        };
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
    }
    else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched()
    }
  }
  resetForm(){
    this.queryForm.reset({
      exportType: 'PDF'
    })
    setTimeout(function() {
      document.getElementById("party123")?.focus();
   }, 100);
  }
  authChequeValidation(): ValidatorFn {
    return (g: AbstractControl): ValidationErrors | null => {

      let dateQuery = `and (auth_authdate between to_date('${moment(g.get('range.authFromDate')?.value).format('DD/MM/YYYY')}','dd/MM/yyyy') and to_date('${moment(g.get('range.authToDate')?.value).format('DD/MM/YYYY')}','dd/MM/yyyy'))`
      //for Auth
      if (g.get('partyCode')?.value.length || g.get('matGroup')?.value.length || g.get('bldgCode')?.value.length || g.get('coyCode')?.value.length || g.get('prop')?.value.length || (g.get('range.authFromDate')?.value && g.get('range.authToDate')?.value)) {
        g.get('auth')?.setErrors(null),
          this.authFieldDisabled = false
        this.setMultiSelectField()
        this.authSubId = (g.get('range.authFromDate')?.value && g.get('range.authToDate')?.value) ? `('ALL' IN (${this.partyCode}) OR auth_partycode in (${this.partyCode}))
and ('ALL' IN (${this.bldgCode}) OR auth_bldgcode in (${this.bldgCode}))
and ('ALL' IN (${this.matGroup}) OR auth_matgroup in (${this.matGroup}))
and ('ALL' IN (${this.coy}) OR auth_coy in (${this.coy}))
and ('ALL' IN (${this.prop}) OR auth_prop in (${this.prop}))${dateQuery}` : `('ALL' IN (${this.partyCode}) OR auth_partycode in (${this.partyCode}))
and ('ALL' IN (${this.bldgCode}) OR auth_bldgcode in (${this.bldgCode}))
and ('ALL' IN (${this.matGroup}) OR auth_matgroup in (${this.matGroup}))
and ('ALL' IN (${this.coy}) OR auth_coy in (${this.coy}))
and ('ALL' IN (${this.prop}) OR auth_prop in (${this.prop}))`
      }
      else {
        g.get('auth')?.setErrors({ selectField: true }), this.authFieldDisabled = true
      }


      // for cheque
      (g.get('coyCode')?.value.length || g.get('prop')?.value.length) ?
        (
          g.get('cheque')?.setErrors(null),
          this.chqFieldDisabled = false,
          this.setMultiSelectField(),
          this.chqSubId = `('ALL' IN (${this.coy}) OR vchq_coy in (${this.coy}))
        and ('ALL' IN (${this.prop}) OR vchq_proprietor in (${this.prop}))`
        ) : (g.get('cheque')?.setErrors({ selectField: true }), this.chqFieldDisabled = true)

      return null
    };

  }
  requiredValidation(): ValidatorFn {
    return (g: AbstractControl): ValidationErrors | null => {
      (g.get('auth')?.value?.length || g.get('cheque')?.value?.length) && (g.get('auth')?.setErrors(null), g.get('cheque')?.setErrors(null))
      return (g.get('auth')?.value?.length || g.get('cheque')?.value?.length) ? null : { atLeastOneFilter: true }
    }
  }
}
