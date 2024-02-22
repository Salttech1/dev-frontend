import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs';
import { CertificateService } from 'src/app/services/enggsys/certificate.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-status-of-contractor',
  templateUrl: './status-of-contractor.component.html',
  styleUrls: ['./status-of-contractor.component.css'],
})
export class StatusOfContractorComponent implements OnInit {
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
    public commonReport: CommonReportsService,
    public _enggService: CertificateService,
    private toastr: ToasterapiService
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
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      let pfromdt = this.qf.get('range.periodFrom')?.value;
      let ptodt = this.qf.get('range.periodTo')?.value;
      let periodCond;
      {
        // let sessionPayload: any = {
        //   bldgCode:
        //     this.qf.get('bldgCode')?.value.length &&
        //     this.qf.get('bldgCode')?.value[0] != 'ALL'
        //       ? this.qf.get('bldgCode')?.value.join(`','`)
        //       : ``,
        //   workCode:
        //     this.qf.get('workCode')?.value.length &&
        //     this.qf.get('workCode')?.value[0] != 'ALL'
        //       ? this.qf.get('workCode')?.value.join(`','`)
        //       : ``,
        //   contractor:
        //     this.qf.get('contractor')?.value.length &&
        //     this.qf.get('contractor')?.value[0] != 'ALL'
        //       ? this.qf.get('contractor')?.value.join(`','`)
        //       : ``,
      }

      this.loaderToggle = true;

      let payload: any = {
        name: 'StatusOfContractor.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          formname: this.formName,
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `${this.qf.get('bldgCode')?.value.join(`','`)}`
              : `ALL`,
          workCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `${this.qf.get('workCode')?.value.join(`','`)}`
              : `ALL`,
          contractor:
            this.qf.get('contractor')?.value.length &&
            this.qf.get('contractor')?.value[0] != 'ALL'
              ? `${this.qf.get('contractor')?.value.join(`','`)}`
              : `ALL`,
          chkdt: '',
        },
      };
      if (pfromdt && ptodt) {
        payload.reportParameters.DurationClause =
          ` to_date('` +
          moment(pfromdt).format('DD/MM/yyyy') +
          "' ,'dd.MM.yyyy') and to_date('" +
          moment(ptodt).format('DD/MM/yyyy') +
          `', 'dd.MM.yyyy') `;
        payload.seqId = 1;
        payload.reportParameters.AsOnDate = `'Y'`;
        payload.reportParameters.Duration =
          `'From ` +
          moment(pfromdt).format('DD/MM/yyyy') +
          ' To ' +
          moment(ptodt).format('DD/MM/yyyy') +
          `' `;
        payload.seqId = 1;
      }
      console.log('PAYLOAD', payload);

      this.commonReport
        .getTtxParameterizedReport(payload)
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
      this.toastr.showError('Please fill the form properly');
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
