import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-statement-of-cheque-in-favour',
  templateUrl: './statement-of-cheque-in-favour.component.html',
  styleUrls: ['./statement-of-cheque-in-favour.component.css']
})
export class StatementOfChequeInFavourComponent implements OnInit {
  loaderToggle: boolean = false
  qf!: FormGroup
  formName!: string;
  bldgSQ = `(bldg_closedate IS NULL OR bldg_closedate = '${commonConstant.closeDateFt}')`
  conttorSQ = `par_partytype = 'E'`
  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: [''],
      contract: [''],
      workCode: [''],
      partyCode: ['']
    },
      {
        validators: filterAtLeastOne()
      }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true
      let payload: Object = {
        name: "Engg_RP_DebitingInformation.rpt",
        isPrint: false,
        reportParameters: {
          StrPrmBldgCode: this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
            : `'ALL'`,
          StrPrmContract: this.qf.get('contract')?.value instanceof Object &&
            this.qf.get('contract')?.value[0] != 'ALL'
            ? `'${this.qf.get('contract')?.value?.[0]?.[0]?.trim()}'`
            : `'ALL'`,
          StrPrmPartyCode: this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('partyCode')?.value.join(`','`)}'`
            : `'ALL'`,
          StrPrmWorkCode: this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
            : `'ALL'`,
        }
      }
      console.log(payload, "payload");
      this.commonReport.getParameterizedReport(payload).pipe(take(1), finalize(() => {
        this.loaderToggle = false
      }))
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res, "PDF", filename)
            }
          }
        })
    }
    else {
      this.qf.markAllAsTouched()
    }
  }
}

export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    let bc = g.get('bldgCode')?.value;
    let recid = g.get('contract')?.value;
    let wc = g.get('workCode')?.value;
    let contts = g.get('partyCode')?.value;
    return (!bc.length && !recid?.length && !wc?.length && !contts?.length) ?
      { atLeastOneFilter: true } : null
  };
}