import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ServiceService } from 'src/app/services/service.service';
import * as commonConstant from '../../../../../../constants/commonconstant';
import { CommonReportsService } from 'src/app/services/reports.service';
import { finalize, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-of-rec-id',
  templateUrl: './details-of-rec-id.component.html',
  styleUrls: ['./details-of-rec-id.component.css'],
})
export class DetailsOfRecIdComponent implements OnInit {
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
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group({
      bldgCode: [''],
      misProject: [''],
      workCode: [''],
      contractor: [''],
    });
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
      let payload: Object = {
        name: 'DetofContractId.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          // closeDate: commonConstant.closeDate,
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
          misProject:
            this.qf.get('misProject')?.value.length &&
            this.qf.get('misProject')?.value[0] != 'ALL'
              ? `'${this.qf.get('misProject')?.value.join(`','`)}'`
              : `'ALL'`,
          contractor:
            this.qf.get('contractor')?.value.length &&
            this.qf.get('contractor')?.value[0] != 'ALL'
              ? `'${this.qf.get('contractor')?.value.join(`','`)}'`
              : `'ALL'`,
          formname: this.formName,
        },
      };
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

    //   this.commonReport
    //     .getTtxParameterizedReportWithCondition(payload)
    //     .pipe(
    //       take(1),
    //       finalize(() => {
    //         this.loaderToggle = false;
    //       })
    //     )
    //     .subscribe({
    //       next: (res: any) => {
    //         if (res) {
    //           let filename = this.commonReport.getReportName();
    //           this._service.exportReport(print, res, 'PDF', filename);
    //         }
    //       },
    //     });
    // } else {
    //   this.qf.markAllAsTouched();
    // }
  }
}
