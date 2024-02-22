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
  selector: 'app-contractsummaryreport',
  templateUrl: './contractsummaryreport.component.html',
  styleUrls: ['./contractsummaryreport.component.css']
})
export class ContractsummaryreportComponent implements OnInit {

  loaderToggle: boolean = false;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  contractSummaryReport = new FormGroup({
    name: new FormControl('Engg_RP_ContractSummaryReport.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtBldgCode: new FormControl<string[]>([], [Validators.required]),
      IntPrmSessionID:new FormControl<string[]>([]),
      TxtAsOnDate: new FormControl(null, [Validators.required]),
    }),
  });

  getReport(print: boolean) {
    if (this.contractSummaryReport.valid) {
      let StrPrmBldgCode = `${this.contractSummaryReport.controls['reportParameters']
        .get('TxtBldgCode')
        ?.value?.join(`','`)
        .trim()}`;
        let IntPrmSessionID = `${this.contractSummaryReport.controls['reportParameters']
        .get('IntPrmSessionID')
        ?.value?.join(`','`)
        .trim()}`;

      let DatPrmAsOnDate = `'${
        this.contractSummaryReport.controls['reportParameters'].get(
          'TxtAsOnDate'
        )?.value
      }'`;

      let payload: any = {
        name: 'Engg_RP_ContractSummaryReport.rpt',
        isPrint: false,
        reportParameters: {
          StrPrmBldgCode: "'"+StrPrmBldgCode+"'",
          IntPrmSessionID: "'572334'",
          DatPrmAsOnDate: moment(DatPrmAsOnDate).format('YYYY-MM-DD'),

          formname:
            this.contractSummaryReport.controls['reportParameters'].get(
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
