import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-building-expenses-summary',
  templateUrl: './building-expenses-summary.component.html',
  styleUrls: ['./building-expenses-summary.component.css']
})
export class BuildingExpensesSummaryComponent implements OnInit {

  loaderToggle: boolean = false
  qf!: FormGroup
  formName!: string;
  bldgSQ = `(bmap_closedate >= to_date('${moment().format('DD.MM.yyyy')}','dd.mm.yyyy') or bmap_closedate is null)`
  conttorSQ = `par_partytype = 'E'`
  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: [''],
      groupCode: [''],
      asOnDate: [moment()],
      range: this.fb.group({
        fromDate: [null],
        toDate: [null]
      }),
      region: ['']
    },
      {
        validators: selectDate()
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
      let fromDt = this.qf.get('range.fromDate')?.value;
      let toDt = this.qf.get('range.toDate')?.value;
      let asOnDt = this.qf.get('asOnDate')?.value;

      let payload: any = {
        name: "BldgExpSumm.rpt",
        isPrint:false,
        seqId: 1,
        conditionId: (fromDt && toDt) ? 1 :  2,
        reportParameters: {
          bldgCode: this.qf.get('bldgCode')?.value.length &&
          this.qf.get('bldgCode')?.value[0] != 'ALL'
          ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
          : `'ALL'`,
          region:this.qf.get('region')?.value.length &&
          this.qf.get('region')?.value[0] != 'ALL'
          ? `'${this.qf.get('region')?.value.join(`','`)}'`
          : `'ALL'`,
          groupCode:this.qf.get('groupCode')?.value.length &&
          this.qf.get('groupCode')?.value[0] != 'ALL'
          ? `'${this.qf.get('groupCode')?.value.join(`','`)}'`
          : `'ALL'`,
          formname: this.formName,
          h1: "'B u i l d i n g / P l o t E x p e n s e s  S u m m a r y'",
        }
      }
      
      if(fromDt && toDt){
        payload.reportParameters.fromDate = moment(fromDt).format('DD/MM/yyyy');
        payload.reportParameters.toDate = moment(toDt).format('DD/MM/yyyy');
        payload.reportParameters.h2 =`'Certificate Cost from ${moment(fromDt).format('DD.MM.yyyy')} to ${moment(toDt).format('DD.MM.yyyy')}'` ;
      }
      if(asOnDt){
        payload.reportParameters.asOnDate = moment(asOnDt).format('DD/MM/yyyy')
        payload.reportParameters.h2 =`'Certificate Cost  As on ${moment(asOnDt).format('DD.MM.yyyy')}'` ;
      }
      console.log(payload,"payload");
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

export function selectDate(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    let fromdt = c.get('range.fromDate')?.value;
    let toDt = c.get('range.toDate')?.value;
    let asondt = c.get('asOnDate')?.value;

    if (fromdt && toDt && asondt) {
      c.get('asOnDate')?.setErrors({ selectDate: true })
      c.get('range')?.setErrors({ selectDate: true })
    }
    else if (!fromdt && !toDt && !asondt) {
      c.get('asOnDate')?.setErrors({ selectDate: true })
      c.get('range')?.setErrors({ selectDate: true })
    }
    else if (fromdt && !toDt) {
      c.get('range')?.setErrors({ properDate: true })
    }
    else if (!fromdt && toDt) {
      c.get('range')?.setErrors({ properDate: true })
    }
    else {
      c.get('asOnDate')?.setErrors(null)
      c.get('range')?.setErrors(null)
    }
    return null
  };
}