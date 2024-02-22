import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-assessmenttaxreport',
  templateUrl: './assessmenttaxreport.component.html',
  styleUrls: ['./assessmenttaxreport.component.css']
})
export class AssessmenttaxreportComponent implements OnInit {
  loaderToggle: boolean = false
  qf!: FormGroup
  formName!: string;
  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      coy: [''],
      bldgCode: [''],
      blgdName: [''],
      MISBldg: [''],
      City: [''],
      range: this.fb.group({
        TxtFrom: [null],
        TxtTo: [null]
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
      let pfromdt = this.qf.get('range.TxtFrom')?.value;
      let ptodt = this.qf.get('range.TxtTo')?.value;
      let payload: any = {
        name: "AssessmentTax.rpt",
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          bldgCode: this.qf.get('bldgCode')?.value.length &&
            this.qf.get('bldgCode')?.value[0] != ' '
            ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
            : ``,
            blgdName: [''],
          coy: this.qf.get('coy')?.value.length &&
            this.qf.get('coy')?.value[0] != ' '
            ? `'${this.qf.get('coy')?.value.join(`','`)}'`
            : ``,
          MISBldg: this.qf.get('MISBldg')?.value.length &&
            this.qf.get('MISBldg')?.value[0] != ' '
            ? `'${this.qf.get('MISBldg')?.value.join(`','`)}'`
            : ``,
          City: this.qf.get('City')?.value.length &&
            this.qf.get('City')?.value[0]!= ' '
            ? `'${this.qf.get('City')?.value.join(`','`)}'`
            : ``,
          formname: this.formName,
          chkdt: "'Y'",
          Total:' ',
        }
      }
      if (pfromdt && ptodt) {
        payload.reportParameters.TxtFrom = moment(pfromdt).format('DD/MM/yyyy');
        payload.reportParameters.TxtTo = moment(ptodt).format('DD/MM/yyyy');
        payload.reportParameters.HEADERTEXT1  = `'TxtFrom ${moment(pfromdt).format('DD/MM/yyyy')} TxtTo ${moment(ptodt).format('DD/MM/yyyy')}'`;
        payload.seqId = 1
        payload.conditionId = 1
      }
      console.log(payload, "payload");
      this.commonReport.getTtxParameterizedPrintReport(payload).pipe(take(1), finalize(() => {
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
    let MB = g.get('MISBldg')?.value;
    let CT = g.get('City')?.value;
    let fdt = g.get('range.TxtFrom')?.value;
    let tdt = g.get('range.TxtTo')?.value;

    if (fdt && !tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else if (!fdt && tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else {
      g.get('range')?.setErrors(null)
    }

    return (!coy.length && !bc.length && !MB?.length && !CT?.length  && !fdt && !tdt) ?
      { atLeastOneFilter: true } : null
  };
}
