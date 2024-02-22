import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { CommonReportsService } from 'src/app/services/reports.service';
import { finalize, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-wise-workwise-summary',
  templateUrl: './contract-wise-workwise-summary.component.html',
  styleUrls: ['./contract-wise-workwise-summary.component.css']
})

export class ContractWiseWorkwiseSummaryComponent implements OnInit {
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: [''],
      recId: [''],
      workCode: [''],
      contractor: [''],
      range: this.fb.group({
        periodFrom: [null],
        periodTo: [null]
      }),
    }
    // ,{
    //   validators: filterAtLeastOne()
    // }
    );
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
    console.log('ngOnInit....');
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;
      let pfromdt = this.qf.get('range.periodFrom')?.value;
      let ptodt = this.qf.get('range.periodTo')?.value;
      let payload: any = {
        name: 'CntrctrWiseWorkWiseSummRep.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
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
              recId:
            this.qf.get('recId')?.value.length &&
            this.qf.get('recId')?.value[0] != 'ALL'
              ? `'${this.qf.get('recId')?.value.join(`','`)}'`
              : `'ALL'`,
          contractor:
            this.qf.get('contractor')?.value.length &&
            this.qf.get('contractor')?.value[0] != 'ALL'
              ? `'${this.qf.get('contractor')?.value.join(`','`)}'`
              : `'ALL'`,
          formname: this.formName,
        },
      };
      if (pfromdt && ptodt) {
        payload.reportParameters.fromDate = moment(pfromdt).format('DD/MM/yyyy');
        payload.reportParameters.toDate = moment(ptodt).format('DD/MM/yyyy');
         payload.reportParameters.h1  = `'From ${moment(pfromdt).format('DD/MM/yyyy')} To ${moment(ptodt).format('DD/MM/yyyy')}'`;
        // payload.seqId = 1
      }
      console.log(payload, 'payload');
      this.commonReport.getTtxParameterizedReportWithCondition(payload).pipe(take(1), finalize(() => {
        this.loaderToggle = false
      }))
        .subscribe({
          next: (res: any) => {
            if (res) {
              let filename = this.commonReport.getReportName();
              this._service.exportReport(print, res,"PDF", filename)
            }
          }
        })
    }
    else {
      this.qf.markAllAsTouched()
    }

  }

}

// export function filterAtLeastOne(): ValidatorFn {
//   return (g: AbstractControl): ValidationErrors | null => {
//     let coy = g.get('coy')?.value;
//     let bc = g.get('bldgCode')?.value;
//     let recid = g.get('contrCode')?.value;
//     let wc = g.get('workCode')?.value;
//     let pc = g.get('partyCode')?.value;
//     let exclcc = g.get('exclContrCode')?.value;
//     let exclexty = g.get('exclExpenseType')?.value;
//     let exclcerty = g.get('exclCertType')?.value;
//     let expty = g.get('expenseType')?.value;
//     let fdt = g.get('range.periodFrom')?.value;
//     let tdt = g.get('range.periodTo')?.value;

//     if (fdt && !tdt) {
//       g.get('range')?.setErrors({ properDate: true })
//     }
//     else if (!fdt && tdt) {
//       g.get('range')?.setErrors({ properDate: true })
//     }
//     else {
//       g.get('range')?.setErrors(null)
//     }

//     return (!coy.length && !bc.length && !recid?.length && !wc?.length && !pc?.length && !exclcc
//       && !exclexty.length && !exclcerty.length && !expty.length && !fdt && !tdt) ?
//       { atLeastOneFilter: true } : null
//   };
// }
