import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-contractwise-billwise-payment-details',
  templateUrl: './contractwise-billwise-payment-details.component.html',
  styleUrls: ['./contractwise-billwise-payment-details.component.css']
})
export class ContractwiseBillwisePaymentDetailsComponent implements OnInit {
  loaderToggle: boolean = false
  qf!: FormGroup
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format('DD.MM.yyyy')}','dd.mm.yyyy') or bmap_closedate is null)`
  conttorSQ = `par_partytype = 'E'`
  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      coy: [''],
      bldgCode: [''],
      workCode: [''],
      partyCode: [''],
      contrCode: [''],
      exclContrCode: [''],
      exclExpenseType: [''],
      exclCertType: [''],
      expenseType: [''],
      range: this.fb.group({
        periodFrom: [null],
        periodTo: [null]
      }),
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
      let pfromdt = this.qf.get('range.periodFrom')?.value;
      let ptodt = this.qf.get('range.periodTo')?.value;
      let payload: any = {
        name: "Engg_RP_ContBillwisePayDtls.rpt",
        isPrint: false,
        seqId: 2,
        reportParameters: {
          bldgCode: this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
            : `'ALL'`,
          coy: this.qf.get('coy')?.value.length &&
            this.qf.get('coy')?.value[0] != 'ALL'
            ? `'${this.qf.get('coy')?.value.join(`','`)}'`
            : `'ALL'`,
          workCode: this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
            : `'ALL'`,
          contrCode: this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('partyCode')?.value.join(`','`)}'`
            : `'ALL'`,
          expenseType: this.qf.get('expenseType')?.value instanceof Object &&
            this.qf.get('expenseType')?.value[0]?.[0] != 'ALL'
            ? `'${this.qf.get('expenseType')?.value?.[0]?.[0]?.trim()}'`
            : `'ALL'`,
          recId: this.qf.get('contrCode')?.value instanceof Object &&
            this.qf.get('contrCode')?.value[0]?.[0] != 'ALL'
            ? `'${this.qf.get('contrCode')?.value?.[0]?.trim()}'`
            : `'ALL'`,
          exclExpenseType: this.qf.get('exclExpenseType')?.value instanceof Object &&
            this.qf.get('exclExpenseType')?.value[0]?.[0] != 'ALL'
            ? `'${this.qf.get('exclExpenseType')?.value?.[0]?.[0]?.trim()}'`
            : `'ALL'`,
          exclCertType: this.qf.get('exclCertType')?.value.length &&
            this.qf.get('exclCertType')?.value[0] != 'ALL'
            ? `'${this.qf.get('exclCertType')?.value.join(`','`)}'`
            : `'ALL'`,
          exclContrCode: this.qf.get('exclContrCode')?.value.length &&
            this.qf.get('exclContrCode')?.value[0] != 'ALL'
            ? `'${this.qf.get('exclContrCode')?.value.join(`','`)}'`
            : `'ALL'`,
          formname: this.formName,
        }
      }
      if (pfromdt && ptodt) {
        payload.reportParameters.periodFrom = moment(pfromdt).format('DD/MM/yyyy');
        payload.reportParameters.periodTo = moment(ptodt).format('DD/MM/yyyy');
        payload.reportParameters.HEADERTEXT1  = `'From ${moment(pfromdt).format('DD/MM/yyyy')} To ${moment(ptodt).format('DD/MM/yyyy')}'`;
        payload.seqId = 1
      }
      console.log(payload, "payload");
      this.commonReport.getParameterizedReportWithCondition(payload).pipe(take(1), finalize(() => {
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
    let coy = g.get('coy')?.value;
    let bc = g.get('bldgCode')?.value;
    let recid = g.get('contrCode')?.value;
    let wc = g.get('workCode')?.value;
    let pc = g.get('partyCode')?.value;
    let exclcc = g.get('exclContrCode')?.value;
    let exclexty = g.get('exclExpenseType')?.value;
    let exclcerty = g.get('exclCertType')?.value;
    let expty = g.get('expenseType')?.value;
    let fdt = g.get('range.periodFrom')?.value;
    let tdt = g.get('range.periodTo')?.value;

    if (fdt && !tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else if (!fdt && tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else {
      g.get('range')?.setErrors(null)
    }

    return (!coy.length && !bc.length && !recid?.length && !wc?.length && !pc?.length && !exclcc
      && !exclexty.length && !exclcerty.length && !expty.length && !fdt && !tdt) ?
      { atLeastOneFilter: true } : null
  };
}