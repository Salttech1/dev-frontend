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
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-monthly-expenditure',
  templateUrl: './monthly-expenditure.component.html',
  styleUrls: ['./monthly-expenditure.component.css'],
})
export class MonthlyExpenditureComponent implements OnInit {
  monthDateField!: string;
  loaderToggle: boolean = false;
  qf!: FormGroup;
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format(
    'DD.MM.yyyy'
  )}','dd.mm.yyyy') or bmap_closedate is null)`;

  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
    private toastr: ToasterapiService
  ) {}

  ngOnInit(): void {
    this.monthDate();
    this.qf = this.fb.group(
      {
        bldgCode: [''],
        period: [''],
        city: [''],
      },
      {
        validators: validateAtLeastOne(),
      }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  monthDate() {
    this.monthDateField = `${moment(new Date()).format('YYYY')}${moment(
      new Date()
    ).format('MM')}`;
    return this.monthDateField;
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      let passedOnMonth = this.qf.get('period')?.value.substring(4, 6);
      let passedOnYear = this.qf.get('period')?.value.substring(0, 4);
      let endDate = new Date(passedOnYear, passedOnMonth, 0);
      this.loaderToggle = true;

      let payload: any = {
        name: 'MonthlyExpenditure.rpt',
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
          bldgRegion:
            this.qf.get('city')?.value.length &&
            this.qf.get('city')?.value[0] != 'ALL'
              ? `${this.qf.get('city')?.value[0][0]}`
              : `ALL`,
          PassedOnMonth: this.qf.get('period')?.value.length
            ? passedOnMonth
            : ``,
          PassedOnYear: this.qf.get('period')?.value.length ? passedOnYear : ``,
          chkdt: `'Y'`,
          startdate: "'01/" + passedOnMonth + '/' + passedOnYear + "'",
          Enddate: "'" + moment(endDate).format('DD/MM/yyyy') + "'",
        },
      };
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

export function validateAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    let bc = g.get('bldgCode')?.value;
    let period = g.get('period')?.value;
    let city = g.get('city')?.value;

    return (!bc.length && !city.length) || !period.length
      ? { atLeastOneFilter: true }
      : null;
  };
}
