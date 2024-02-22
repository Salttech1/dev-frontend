import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-passed-certificate-list',
  templateUrl: './passed-certificate-list.component.html',
  styleUrls: ['./passed-certificate-list.component.css'],
})
export class PassedCertificateListComponent implements OnInit {
  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    public _service: ServiceService,
    public commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'`;
      },
    });
  }

  getReport(print: Boolean) {
    this.loaderToggle = true;

    let payload: any = {
      name: 'Lp_PassCertficateList.rpt',
      isPrint: false,
      seqId: 1,
      conditionId: 1,
      reportParameters: {
        formname: this.formName,
        chkdt: "'Y'",
      },
    };

    console.log(payload, 'payload');
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
  }
}
