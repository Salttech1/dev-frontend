import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-contractwise-certificatewsise-details-report',
  templateUrl: './contractwise-certificatewsise-details-report.component.html',
  styleUrls: ['./contractwise-certificatewsise-details-report.component.css'],
})
export class ContractwiseCertificatewsiseDetailsReportComponent
  implements OnInit
{
  loaderToggle: boolean = false;
  qf!: FormGroup;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;
  conttorSQ = `par_partytype = 'E'`;
  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group(
      {
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
          periodTo: [null],
        }),
      },
      {
        validators: filterAtLeastOne(),
      }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = val.formName;
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;
      let pfromdt = this.qf.get('range.periodFrom')?.value;
      let ptodt = this.qf.get('range.periodTo')?.value;
      let payload: any = {
        name: 'Lp_Contractwise_Certwise_DetList_Java.rpt',
        isPrint: false,
        seqId: 2,
        reportParameters: {
          formname: this.formName,
          HeaderText2: "''",
          HeaderText3: this.formName,
        },
      };
      let bldgCodeCond,
        coyCond,
        workCodeCond,
        contrCodeCond,
        expenseTypeCond,
        recIdCond,
        exclExpenseTypeCond;
      let exclCertTypeCond,
        exclContrCodeCond,
        periodCond,
        strWhereCond = '';
      bldgCodeCond =
        this.qf.get('bldgCode')?.value.length &&
        this.qf.get('bldgCode')?.value[0] != 'ALL'
          ? ` c.cert_bldgcode in ('${this.qf
              .get('bldgCode')
              ?.value.join(`','`)}') and `
          : '';
      coyCond =
        this.qf.get('coy')?.value.length &&
        this.qf.get('coy')?.value[0] != 'ALL'
          ? ` c.cert_coy in ('${this.qf.get('coy')?.value.join(`','`)}') and `
          : '';
      workCodeCond =
        this.qf.get('workCode')?.value.length &&
        this.qf.get('workCode')?.value[0] != 'ALL'
          ? ` c.cert_workcode in ('${this.qf
              .get('workCode')
              ?.value.join(`','`)}') and `
          : '';
      contrCodeCond =
        this.qf.get('partyCode')?.value.length &&
        this.qf.get('partyCode')?.value[0] != 'ALL'
          ? ` c.cert_partycode in ('${this.qf
              .get('partyCode')
              ?.value.join(`','`)}') and `
          : '';
      expenseTypeCond =
        this.qf.get('expenseType')?.value instanceof Object &&
        this.qf.get('expenseType')?.value[0]?.[0] != 'ALL'
          ? ` c.cert_debsocyn like ('${this.qf
              .get('expenseType')
              ?.value?.[0]?.[0]?.trim()}') and `
          : '';
      recIdCond =
        this.qf.get('contrCode')?.value instanceof Object &&
        this.qf.get('contrCode')?.value[0]?.[0] != 'ALL'
          ? ` c.cert_contract = '${this.qf
              .get('contrCode')
              ?.value?.[0]?.trim()}' and `
          : '';
      exclExpenseTypeCond =
        this.qf.get('exclExpenseType')?.value instanceof Object &&
        this.qf.get('exclExpenseType')?.value[0]?.[0] != 'ALL'
          ? ` (c.cert_debsocyn is null or c.cert_debsocyn not in ('${this.qf
              .get('exclExpenseType')
              ?.value?.[0]?.[0]?.trim()}') and `
          : '';
      exclCertTypeCond =
        this.qf.get('exclCertType')?.value.length &&
        this.qf.get('exclCertType')?.value[0] != 'ALL'
          ? ` c.cert_certtype not in ('${this.qf
              .get('exclCertType')
              ?.value.join(`','`)}') and `
          : '';
      exclContrCodeCond =
        this.qf.get('exclContrCode')?.value.length &&
        this.qf.get('exclContrCode')?.value[0] != 'ALL'
          ? ` c.cert_partycode not in ('${this.qf
              .get('exclContrCode')
              ?.value.join(`','`)}') and `
          : '';
      if (pfromdt && ptodt) {
        periodCond =
          " (trunc(c.cert_passedon) between to_date('" +
          moment(pfromdt).format('DD/MM/yyyy') +
          "' ,'dd.MM.yyyy') and to_date(' " +
          moment(ptodt).format('DD/MM/yyyy') +
          "', 'dd.MM.yyyy')) and ";
        payload.seqId = 1;
        payload.reportParameters.HEADERTEXT1 =
          'From ' +
          moment(pfromdt).format('DD/MM/yyyy') +
          ' To ' +
          moment(ptodt).format('DD/MM/yyyy');

        payload.seqId = 1;
      }

      strWhereCond =
        coyCond +
        bldgCodeCond +
        workCodeCond +
        contrCodeCond +
        exclContrCodeCond +
        expenseTypeCond +
        exclExpenseTypeCond +
        exclCertTypeCond +
        periodCond +
        recIdCond +
        " c.CERT_CERTSTATUS > '4' AND c.cert_certstatus NOT IN ('6','8') order by c.CERT_COY,c.CERT_BLDGCODE,party_name,c.CERT_CONTRACT,CERT_CERTDATE,SORTORDER ,CERT_CERTTYPE,CERT_RUNSER ";
      payload.reportParameters.StrLocWhere = strWhereCond;

      console.log(payload, 'payload');
      this.commonReport
        .getParameterizedReport(payload)
        .pipe(
          take(1),
          finalize(() => {
            this.loaderToggle = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res, 'PDF', filename);
            }
          },
        });
    } else {
      this.qf.markAllAsTouched();
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
      g.get('range')?.setErrors({ properDate: true });
    } else if (!fdt && tdt) {
      g.get('range')?.setErrors({ properDate: true });
    } else {
      g.get('range')?.setErrors(null);
    }

    return !coy.length &&
      !bc.length &&
      !recid?.length &&
      !wc?.length &&
      !pc?.length &&
      !exclcc &&
      !exclexty.length &&
      !exclcerty.length &&
      !expty.length &&
      !fdt &&
      !tdt
      ? { atLeastOneFilter: true }
      : null;
  };
}
