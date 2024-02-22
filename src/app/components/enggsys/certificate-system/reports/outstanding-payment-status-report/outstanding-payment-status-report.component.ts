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
  selector: 'app-outstanding-payment-status-report',
  templateUrl: './outstanding-payment-status-report.component.html',
  styleUrls: ['./outstanding-payment-status-report.component.css'],
})
export class OutstandingPaymentStatusReportComponent implements OnInit {
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
        contract: [''],
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
      let fromDt = this.qf.get('range')?.value.periodFrom;
      let toDt = this.qf.get('range')?.value.periodTo;
      let payload: any = {
        name: 'Engg_OutstandingPaymentsReport.rpt',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: "'" + this.formName + "'",
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          partycode:
            this.qf.get('partyCode')?.value.length &&
            this.qf.get('partyCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('partyCode')?.value.join(`','`)}'`
              : `'ALL'`,
          workcode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
          coy:
            this.qf.get('coy')?.value.length &&
            this.qf.get('coy')?.value[0] != 'ALL'
              ? `'${this.qf.get('coy')?.value.join(`','`)}'`
              : `'ALL'`,
          recid:
            this.qf.get('contract')?.value instanceof Object &&
            this.qf.get('contract')?.value[0]?.[0] != 'ALL'
              ? `'${this.qf.get('contract')?.value.join(`','`)}'`
              : `'ALL'`,

          ExtraCond: ' AND (cert_payamount > 0)',
        },
      };

      if (!fromDt && !toDt) {
        fromDt = new Date('01/01/1956');
        toDt = new Date();
      }

      payload.reportParameters.fromdate = moment(fromDt).format('YYYY-MM-DD');
      payload.reportParameters.todate = moment(toDt).format('YYYY-MM-DD');
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
          error: (err) => {
            // If no data found for the building then display no rows report
            if ((err.status = 404)) {
              let payloadNoRows: any = {
                name: 'Engg_OutstandingPaymentsReport - No Rows.rpt',
                isPrint: false,
                seqId: 1,
                reportParameters: {
                  formname: "'" + this.formName + "'",
                  bldgCode:
                    this.qf.get('bldgCode')?.value.length &&
                    this.qf.get('bldgCode')?.value[0] != 'ALL'
                      ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
                      : `'ALL'`,
                },
              };
              console.log(payloadNoRows, 'payloadNoRows');
              this.commonReport
                .getParameterizedReport(payloadNoRows)
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
      !fdt &&
      !tdt
      ? { atLeastOneFilter: true }
      : null;
  };
}
