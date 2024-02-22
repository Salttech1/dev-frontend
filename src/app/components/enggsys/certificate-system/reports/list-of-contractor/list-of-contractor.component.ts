import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-list-of-contractor',
  templateUrl: './list-of-contractor.component.html',
  styleUrls: ['./list-of-contractor.component.css'],
})
export class ListOfContractorComponent implements OnInit {
  loaderToggle: boolean = false;
  qf!: FormGroup;
  formName!: string;
 
  constructor(
    private fb: FormBuilder,
    public _service: ServiceService,
    public commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {
    this.qf = this.fb.group({
      workCode: [''],
    });
   
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });

  }

  getReport(print: Boolean) {
    if (this.qf.valid) {
      this.loaderToggle = true;

      let payload: any = {
        name: 'ListOfContractors.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: 1,
        reportParameters: {
          workCode:
            this.qf.get('workCode')?.value.length &&
            this.qf.get('workCode')?.value[0] != 'ALL'
              ? `'${this.qf.get('workCode')?.value.join(`','`)}'`
              : `'ALL'`,
          formname: this.formName,
          chkdt: "'Y'",
        },
      };

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
