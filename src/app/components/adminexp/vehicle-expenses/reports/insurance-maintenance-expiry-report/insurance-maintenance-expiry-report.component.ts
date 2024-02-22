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
  selector: 'app-insurance-maintenance-expiry-report',
  templateUrl: './insurance-maintenance-expiry-report.component.html',
  styleUrls: ['./insurance-maintenance-expiry-report.component.css']
})
export class InsuranceMaintenanceExpiryReportComponent implements OnInit {
  loaderToggle: boolean = false;
  formname!: any;

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._service.pageData.subscribe({
      next: (val) => {
        this.InsMaintExpenseReport.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
    //console.log(this.InsMaintExpenseReport.get('reportParameters.range')?.controls['FromDate'] ?.invalid);
    
  }

  InsMaintExpenseReport = new FormGroup({
    name: new FormControl('MnthlyInsExp.rpt'),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(2),

    reportParameters: new FormGroup({
      formname: new FormControl(''),
      head: new FormControl(''),
      range: new FormGroup({
        FromDate: new FormControl<Date | null>(null, Validators.required),
        ToDate: new FormControl<Date | null>(null, Validators.required),
      }),
      TxtFrmDate: new FormControl<String>(''),
      TxtToDate: new FormControl<String>(''),
      ReportOn: new FormControl('InsuranceExp'),
      OrderBy:new FormControl('VehicleNo')
    }),
  });

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log(this.InsMaintExpenseReport);
    
    if (this.InsMaintExpenseReport.valid) {
      this.loaderToggle = true;

      let InsMaintDet = {
        name: this.InsMaintExpenseReport.controls['reportParameters']?.get('ReportOn')?.value == 'InsuranceExp'? 'MnthlyInsExp.rpt' : 'MnthlyMaintExp.rpt',
        isPrint: false,
        seqId: 1,
        conditionId: this.InsMaintExpenseReport.controls['reportParameters']?.get('OrderBy')?.value == 'VehicleNo'? 2 : 1,
        reportParameters: {
          formname: this.formname,
          TxtFromDate: moment(this.InsMaintExpenseReport.controls['reportParameters'].controls['range'].controls['FromDate'].value,'YYYY-MM-DD').format('DD-MMM-YYYY'),
          TxtToDate: moment(this.InsMaintExpenseReport.controls['reportParameters'].controls['range'].controls['ToDate'].value,'YYYY-MM-DD').format('DD-MMM-YYYY'),
          Fromdate: `'${moment(this.InsMaintExpenseReport.controls['reportParameters'].controls['range'].controls['FromDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`,
          ToDate: `'${moment(this.InsMaintExpenseReport.controls['reportParameters'].controls['range'].controls['ToDate'].value,'YYYY-MM-DD').format('DD/MM/YYYY')}'`
        },
      };
      console.log("Orderby",this.InsMaintExpenseReport.controls['reportParameters']?.get('OrderBy')?.value);
      console.log("MyPAYLOAD",InsMaintDet);
      this.commonReportService
        .getTtxParameterizedReportWithCondition(InsMaintDet)
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
      this.InsMaintExpenseReport.markAllAsTouched();
      this.toastr.error('Please fill the input properly')
    }
    console.log(this.InsMaintExpenseReport.controls['reportParameters'].get('range.FromDate')?.dirty);
  }

}
