import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-auth-payment-detail',
  templateUrl: './auth-payment-detail.component.html',
  styleUrls: ['./auth-payment-detail.component.css'],
})
export class AuthPaymentDetailComponent implements OnInit {
  queryForm: FormGroup = new FormGroup(
    {
      partyCode: new FormControl<string[]>([]),
      bldgCode: new FormControl<string[]>([]),
      matGroup: new FormControl<string[]>([]),
      range: new FormGroup(
        {
          start: new FormControl<Date | null>(null, Validators.required),
          end: new FormControl<Date | null>(null, Validators.required),
        },
        Validators.required
      ),
      exportType: new FormControl('PDF')
    },
    // { validators: all() }
  );

  loaderToggle: boolean = false;
  formName!: string;
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '${commonConstant.coyCloseDate}')`

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
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
    console.log('form', this.queryForm);

    if (this.queryForm.valid) {
      if (this._service.printExcelChk(print, this.queryForm.get('exportType')?.value)) {
        let formVal = this.queryForm.value;

        let payload: any = {
          name: 'AuthPaymentDtl.rpt',
          isPrint: false,
          seqId: 1,
          exportType: this.queryForm.get('exportType')?.value,
          reportParameters: {
            bldgCode:
              formVal.bldgCode && formVal.bldgCode.length
                ? `'${formVal.bldgCode.join(`','`)}'`
                : `'ALL'`,
            matGroup:
              formVal.matGroup && formVal.matGroup.length
                ? `'${formVal.matGroup.join(`','`)}'`
                : `'ALL'`,
            partyCode:
              formVal.partyCode && formVal.partyCode.length
                ? `'${formVal.partyCode.join(`','`)}'`
                : `'ALL'`,
            formname: this.formName,
            authFrmDate: `${moment(formVal.range.start).format('DD/MM/yyyy')}`,
            authToDate: `${moment(formVal.range.end).format('DD/MM/yyyy')}`,
            pFromDate: `For period ${moment(formVal.range.start).format('DD/MM/yyyy')} - ${moment(formVal.range.end).format('DD/MM/yyyy')}`
          },
        };

        console.log('payload', payload);
        // return;
        this.loaderToggle = true;
        this._commonReport
          .getParameterizedReportWithCondition(payload)
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
      exportType: 'PDF'
    })
    setTimeout(function() {
      document.getElementById("building123")?.focus();
   }, 100);
  }
}

export function all() {
  return (g: AbstractControl) => {
    return g.get('partyCode')?.value.length ||
      g.get('bldgCode')?.value.length ||
      g.get('matGroup')?.value.length
      ? null
      : { atLeastOneFilter: true };
  };
}
