import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-flat-sold-unsold-summary-report',
  templateUrl: './flat-sold-unsold-summary-report.component.html',
  styleUrls: ['./flat-sold-unsold-summary-report.component.css'],
})
 export class FlatSoldUnsoldSummaryReportComponent implements OnInit {
  
  maxDate = new Date();

  BldgWingSelectionform = new FormGroup({
    name: new FormControl('FlatsSldUnsldSumm.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(6),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtBldgCode: new FormControl<string[]>([], [Validators.required]),
      Txtwing: new FormControl<string[]>([]),
      asOnDate: new FormControl('', Validators.required),
    }),
  });

  loaderToggle: boolean = false;
  bldgCode = '';

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.BldgWingSelectionform.get('reportParameters')
      ?.get('TxtBldgCode')
      ?.valueChanges.subscribe({
        next: (res: any) => {
          if (res) {
            let bldg = res;
            this.bldgCode = `FLAT_bldgcode IN ('${bldg.join(
              "','"
            )}') AND flat_wing <> ' '`;
          }
        },
      });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    if (this.BldgWingSelectionform.valid) {
      let condition;
      let wing = `${
        this.BldgWingSelectionform.controls['reportParameters'].get('Txtwing')
          ?.value
      }`;

      let asOnDate =
        this.BldgWingSelectionform.value.reportParameters?.asOnDate;

      let payload: any = {
        name: 'FlatsSldUnsldSumm.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: condition,
        reportParameters: {
          TxtBldgCode: `'${this.BldgWingSelectionform.controls[
            'reportParameters'
          ]
            .get('TxtBldgCode')
            ?.value?.join(`','`)}'`,

          Txtwing: `'${this.BldgWingSelectionform.controls['reportParameters']
            .get('Txtwing')
            ?.value?.join(`','`)}'`,

          formname:
            this.BldgWingSelectionform.controls['reportParameters'].get(
              'formname'
            )?.value,
        },
      };

      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedReportWithCondition(payload)
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
}
