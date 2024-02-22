import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';

@Component({
  selector: 'app-buildingwise-party-details',
  templateUrl: './buildingwise-party-details.component.html',
  styleUrls: ['./buildingwise-party-details.component.css']
})
export class BuildingwisePartyDetailsComponent implements OnInit {
  bldgSQ = `(bldg_closedate IS NULL OR bldg_closedate = '${commonConstant.closeDateFt}')`
  qf!: FormGroup
  formName!: string;
  loaderToggle: boolean = false

  constructor(private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: ['', Validators.required],
    });
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`
      },
    });
  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle=true
      let payload: Object = {
        name: "FA_EnggBldgwisePartyDetails.rpt",
        isPrint: false,
        reportParameters: {
          asBldgCode:  this.qf.get('bldgCode')?.value.length &&
          this.qf.get('bldgCode')?.value[0] != 'ALL'
          ? `'${this.qf.get('bldgCode')?.value.join(`','`)}'`
          : `'ALL'`,
        }
      }
      this.commonReport.getParameterizedReport(payload).pipe(take(1), finalize(() => {
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
