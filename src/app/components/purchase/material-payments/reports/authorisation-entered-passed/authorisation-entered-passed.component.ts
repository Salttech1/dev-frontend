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
  selector: 'app-authorisation-entered-passed',
  templateUrl: './authorisation-entered-passed.component.html',
  styleUrls: ['./authorisation-entered-passed.component.css'],
})
export class AuthorisationEnteredPassedComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`
  queryForm: FormGroup = new FormGroup({
    partyCode: new FormControl<string[]>([]),
    bldgCode: new FormControl<string[]>([]),
    matGroup: new FormControl<string[]>([]),
    report: new FormControl<boolean>(false),
    range: new FormGroup({
      periodFromDate: new FormControl<Date | null>(null),
      periodToDate: new FormControl<Date | null>(null),
    }),
    asOnDate: new FormControl<Date | null>(new Date()),
    exportType: new FormControl('PDF')
  },
    { validators: [selectDate()] }
  );

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

  ngAfterContentChecked() {
    console.log(this.queryForm);

  }

  getReport(print: Boolean) {
    //  console.log('queryForm', this.queryForm);
    if (this.queryForm?.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        this.loaderToggle = true;
        let payload: Object = {
          name: this.queryForm.get('report')?.value ? "AuthorisationEnteredPassed_transport.rpt" : "AuthorisationEnteredPassed.rpt",
          isPrint: false,
          seqId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          conditionId: (this.queryForm.get('range.periodFromDate')?.value && this.queryForm.get('range.periodToDate')?.value) ? 1 : 2,
          reportParameters: {
            bldgCode: this.queryForm.get('bldgCode')?.value?.length &&
              this.queryForm.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
            matGroup: this.queryForm.get('matGroup')?.value?.length &&
              this.queryForm.get('matGroup')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('matGroup')?.value.join(`','`)}'`
              : `'ALL'`,
            partyCode: this.queryForm.get('partyCode')?.value?.length &&
              this.queryForm.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.queryForm.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
            periodFromDate: `${moment(this.queryForm.get('range.periodFromDate')?.value).format('DD/MM/YYYY')}`,
            periodToDate: `${moment(this.queryForm.get('range.periodToDate')?.value).format('DD/MM/YYYY')}`,
            PeriodFrom: `'${moment(this.queryForm.get('range.periodFromDate')?.value).format('DD/MM/YYYY')}'`,
            PeriodTo: `'${moment(this.queryForm.get('range.periodToDate')?.value).format('DD/MM/YYYY')}'`,
            asOnDate: `${moment(this.queryForm.get('asOnDate')?.value).format('DD/MM/YYYY')}`,
            AuthType: "'E'",
            AsOnDate: `'${moment(this.queryForm.get('asOnDate')?.value).format('DD/MM/YYYY')}'`,
            coyCloseDate: "01/01/2050",
            chkPeriod: (this.queryForm.get('range.periodFromDate')?.value && this.queryForm.get('range.periodToDate')?.value) ? "'Y'" : "'N'",
            chkAson: (this.queryForm.get('asOnDate')?.value) ? "'Y'" : "'N'",
            formname: this.formName,
            transport:this.queryForm.get('report')?.value ? "'Transport'" : ''
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
    } else {
      this.toastr.showError('Please fill the form properly');
      this.queryForm.markAllAsTouched();
    }

  }
  resetForm(){
    this.queryForm.reset({
    report: false,
     exportType: 'PDF',
     asOnDate: new Date()
    })
    setTimeout(function() {
      document.getElementById("building123")?.focus();
   }, 100);
  }
}
export function selectDate(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    if (_control.get('range.periodFromDate')?.value && _control.get('range.periodToDate')?.value && _control.get('asOnDate')?.value) {
      _control.get('asOnDate')?.setErrors({ selectDate: true })
      _control.get('range')?.setErrors({ selectDate: true })
    }
    else if (!_control.get('range.periodFromDate')?.value && !_control.get('range.periodToDate')?.value && !_control.get('asOnDate')?.value) {
      _control.get('asOnDate')?.setErrors({ selectDate: true })
      _control.get('range')?.setErrors({ selectDate: true })
    }
    else {
      _control.get('asOnDate')?.setErrors(null)
      _control.get('range')?.setErrors(null)
    }
    return null
  };
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    return (!g.get('bldgCode')?.value?.length && !g.get('matGroup')?.value?.length && !g.get('partyCode')?.value?.length) ? { atLeastOneFilter: true } : null
  };

}