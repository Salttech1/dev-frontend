import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-unpassed-cert-list',
  templateUrl: './unpassed-cert-list.component.html',
  styleUrls: ['./unpassed-cert-list.component.css'],
})
export class UnpassedCertListComponent implements OnInit {
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
        range: this.fb.group({
          periodFrom: [null],
          periodTo: [null],
        }),
      }
      // {
      //   validators: selectDate(),
      // }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;
      let fromDt = this.qf.get('range.periodFrom')?.value;
      let toDt = this.qf.get('range.periodTo')?.value;

      let payload: any = {
        name: 'UnpassedCertfList.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          bldgCode:
            this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != 'ALL'
              ? `${this.qf.get('bldgCode')?.value[0][0]}`
              : `ALL`,
          formname: this.formName,
          chkdt: "'Y'",
        },
      };

      if (!fromDt && !toDt) {
        fromDt = new Date('01/01/1956');
        toDt = new Date();
      }
      payload.reportParameters.startDate = moment(fromDt).format('DD/MM/yyyy');
      payload.reportParameters.uptoDate = moment(toDt).format('DD/MM/yyyy');
      payload.reportParameters.fromdate =
        "'" + moment(fromDt).format('DD/MM/yyyy') + "'";
      payload.reportParameters.todate =
        "'" + moment(toDt).format('DD/MM/yyyy') + "'";
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
    } else {
      this.qf.markAllAsTouched();
    }
  }
}

// export function selectDate(): ValidatorFn {
//   return (c: AbstractControl): ValidationErrors | null => {
//     let fromdt = c.get('range.periodFrom')?.value;
//     let toDt = c.get('range.periodTo')?.value;

//     if (fromdt && toDt ) {
//       c.get('range')?.setErrors({ selectDate: true });
//     } else if (fromdt && !toDt) {
//       c.get('range')?.setErrors({ properDate: true });
//     } else if (!fromdt && toDt) {
//       c.get('range')?.setErrors({ properDate: true });
//     }
//     // else {
//     //   c.get('range')?.setErrors(null);
//     // }
//     return null;
//   };
// }
