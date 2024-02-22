import { Component, OnInit } from '@angular/core'; import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-contractor-ageing-report',
  templateUrl: './contractor-ageing-report.component.html',
  styleUrls: ['./contractor-ageing-report.component.css']
})
export class ContractorAgeingReportComponent implements OnInit {
  loaderToggle: boolean = false
  qf!: FormGroup
  formName!: string;
  conttorSQ = `par_partytype = 'E'`
  bldgSQ = `(bldg_closedate IS NULL OR bldg_closedate = '${commonConstant.closeDateFt}')`
  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      coy: [''],
      bldgCode: [''],
      workCode: [''],
      partyCode: [''],
      remarks: [''],
      range: this.fb.group({
        from: [null],
        upto: [null]
      }),
    },{
      validators:filterAtLeastOne()
    })
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`
      },
    });
  }
  getReport(print: Boolean) {
    if (this.qf.valid) {

    }
  }
}
export function filterAtLeastOne(): ValidatorFn {
  return (g: AbstractControl): ValidationErrors | null => {
    let coy = g.get('coy')?.value;
    let bc = g.get('bldgCode')?.value;
    let wc = g.get('workCode')?.value;
    let pc = g.get('partyCode')?.value;
    let fdt = g.get('range.from')?.value;
    let tdt = g.get('range.upto')?.value;

    if (fdt && !tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else if (!fdt && tdt) {
      g.get('range')?.setErrors({ properDate: true })
    }
    else {
      g.get('range')?.setErrors(null)
    }

    return (!coy.length && !bc.length && !wc?.length && !pc?.length && !fdt && !tdt) ?
      { atLeastOneFilter: true } : null
  };
}