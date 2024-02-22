import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-contractwise-certificatewise-summary',
  templateUrl: './contractwise-certificatewise-summary.component.html',
  styleUrls: ['./contractwise-certificatewise-summary.component.css'],
})
export class ContractwiseCertificatewiseSummaryComponent implements OnInit {
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
        remarks: '',
        chkCertificateRemark: new FormControl<boolean>(false),
        chkSACDetails: new FormControl<boolean>(false),
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
      let fromDt = this.qf.get('range.periodFrom')?.value;
      let toDt = this.qf.get('range.periodTo')?.value;
      let payload: any = {
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          coy:
            this.qf.get('coy')?.value.length &&
            this.qf.get('coy')?.value[0] != 'ALL'
              ? `'${this.qf.get('coy')?.value.join(`','`)}'`
              : `'ALL'`,
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          workCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
          partyCode:
            this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('partyCode')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          exclPartyCode:
            this.qf.get('exclContrCode')?.value.length &&
            this.qf.get('exclContrCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('exclContrCode')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          expenseType:
            this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('partyCode')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          exclExpenseType:
            this.qf.get('exclExpenseType')?.value.length &&
            this.qf.get('exclExpenseType')?.value[0] != 'ALL'
              ? `'${this.qf.get('exclExpenseType')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          exclCertType:
            this.qf.get('exclCertType')?.value.length &&
            this.qf.get('exclCertType')?.value[0] != 'ALL'
              ? `'${this.qf.get('exclCertType')?.value?.join(`','`).trim()}'`
              : `'ALL'`,
          recId:
            this.qf.get('recId')?.value.length &&
            this.qf.get('recId')?.value[0] != 'ALL'
              ? "${this.qf.get('recId')?.value?"
              : `'ALL'`,       
          chkdt: "'Y'",
        },
      };
      if (!fromDt && !toDt) {
        fromDt = new Date('01/01/1956');
        toDt = new Date();
      }

      if (this.qf.get('chkSACDetails')?.value) {
        payload.reportParameters.durFrom = moment(fromDt).format('YYYY-MM-DD');
        payload.reportParameters.durUpto = moment(toDt).format('YYYY-MM-DD');
        payload.name = 'Engg_RP_Cont-Cert-SACwisePayDetailsSupreport_Java.rpt';
        payload.reportParameters.period =
          'From ' +
          moment(fromDt).format('DD.MM.YYYY') +
          ' To ' +
          moment(toDt).format('DD.MM.YYYY') +
          '';
        payload.reportParameters.formname = this.formName;
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
        if (this.qf.get('chkCertificateRemark')?.value) {
          payload.name = 'Lp_Contractwise_Certwise_SumList_Rem.rpt';
          payload.reportParameters.remarks= "'" + this.qf.get('remarks')?.value + "'";
        } else {
          payload.name = 'Lp_Contractwise_Certwise_SumList.rpt';
          payload.reportParameters.remarks= "''";
        }
        payload.reportParameters.durFrom =
          "'" + moment(fromDt).format('DD-MMM-YYYY') + "'";
        payload.reportParameters.durUpto =
          "'" + moment(toDt).format('DD-MMM-YYYY') + "'";
        // if (this.qf.get('chkCertificateRemark')?.value) {
        //   payload.name = 'Lp_Contractwise_Certwise_SumList_Rem.rpt';
        // } else {
        //   payload.name = 'Lp_Contractwise_Certwise_SumList.rpt';
        // }
        payload.reportParameters.period =
          "'From " +
          moment(fromDt).format('DD.MM.YYYY') +
          ' To ' +
          moment(toDt).format('DD.MM.YYYY') +
          "'";
        payload.reportParameters.formname = "'" + this.formName + "'";
        console.log(payload, 'payload');

        this.commonReport
          .getTtxParameterizedReportWithCondition(payload)
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
      }
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
