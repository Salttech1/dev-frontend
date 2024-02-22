import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css'],
})
export class PolicySummaryComponent implements OnInit {
  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  policySummaryReport = new FormGroup({
    name: new FormControl('Adm_RP_insurance_policysummary.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      txtPolicyStatus: new FormControl<string[]>([], [Validators.required]),
      txtMaturityDate: new FormControl(null, [Validators.required]),
    }),
  });

  getReport(print: boolean) {
    if (this.policySummaryReport.valid) {
      let status = `${this.policySummaryReport.controls['reportParameters']
        .get('txtPolicyStatus')
        ?.value?.join(`','`)
        .trim()}`;

      let MaturityDate = `'${
        this.policySummaryReport.controls['reportParameters'].get(
          'txtMaturityDate'
        )?.value
      }'`;

      let payload: any = {
        name: 'Adm_RP_insurance_policysummary.rpt',
        isPrint: false,
        reportParameters: {
          PolicyStatus: status,
          MatDateUpTo: moment(MaturityDate).format('YYYY-MM-DD'),

          formname:
            this.policySummaryReport.controls['reportParameters'].get(
              'formname'
            )?.value,
        },
      };

      this.loaderToggle = true;
      this.commonReportService
        .getParameterizedReport(payload)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let pdfFile = new Blob([res], { type: 'application/pdf' });
            let fileName = this.commonReportService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdfFile);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdfFile, fileName);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.toastr.error('Please fill the input properly');
    }
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }
}
