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
  selector: 'app-workwise-summary-report',
  templateUrl: './workwise-summary-report.component.html',
  styleUrls: ['./workwise-summary-report.component.css'],
})
export class WorkwiseSummaryReportComponent implements OnInit {
  loaderToggle: boolean = false;
  qf!: FormGroup;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;

  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group(
      {
        bldgCode: [''],
        workCode: [''],
        groupCode: [''],
        range: this.fb.group({
          periodFrom: [null],
          periodTo: [null],
        }),
        chkDisplayPaidAmt: new FormControl<boolean>(false),
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
        name: 'FrmWorkwisePaidAmtSummary.rpt',
        isPrint: false,
        seqId: 1,
        reportParameters: {
          formname: this.formName,
          StrPrmBldgCodes:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmMISProject:
            this.qf.get('groupCode')?.value.length &&
            this.qf.get('groupCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('groupCode')?.value.join(`','`)}'`
              : `'ALL'`,
          StrPrmWorkCodes:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
        },
      };
      if (this.qf.get('chkDisplayPaidAmt')?.value) {
        payload.reportParameters.StrPrmPaidAmt = 'Y';
      } else {
        payload.reportParameters.StrPrmPaidAmt = 'N';
      }
      if (!fromDt && !toDt) {
        fromDt = new Date('01/01/1956');
        toDt = new Date();
      }

      payload.reportParameters.DatPrmDurFrom =
        moment(fromDt).format('YYYY-MM-DD');
      payload.reportParameters.DatPrmDurUpto =
        moment(toDt).format('YYYY-MM-DD');
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
    let bc = g.get('bldgCode')?.value;
    let wc = g.get('workCode')?.value;
    let gc = g.get('groupCode')?.value;
    let fdt = g.get('range.periodFrom')?.value;
    let tdt = g.get('range.periodTo')?.value;

    if (fdt && !tdt) {
      g.get('range')?.setErrors({ properDate: true });
    } else if (!fdt && tdt) {
      g.get('range')?.setErrors({ properDate: true });
    } else {
      g.get('range')?.setErrors(null);
    }

    return !bc.length && !wc?.length && !gc?.length && !fdt && !tdt
      ? { atLeastOneFilter: true }
      : null;
  };
}
