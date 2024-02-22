import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-tdsauditsummary',
  templateUrl: './tdsauditsummary.component.html',
  styleUrls: ['./tdsauditsummary.component.css']
})
export class TdsauditsummaryComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  tdsauditsummary: FormGroup = new FormGroup({
    name: new FormControl('PYRL_TDSAuditSummary.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyFrom: new FormControl('', Validators.required),
      PCoyTo: new FormControl('', Validators.required),
      PEmpCodeFrom: new FormControl(''),
      PEmpCodeTo: new FormControl(''),
      PPayMonthFrom: new FormControl('', Validators.required),            
      PPayMonthTo: new FormControl('', Validators.required),      
      PSalType: new FormControl(''),
    }),
  });


  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.tdsauditsummary.value);    
    if (this.tdsauditsummary.valid) {

      this.loaderToggle = true;
      this.setReportValue();
      console.log("payload",this.payLoad);    //FOR DEBUG

      this.commonReportService
        .getParameterizedReport(this.payLoad)
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

  setReportValue() {
    this.payLoad = {
      name: 'PYRL_TDSAuditSummary.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.tdsauditsummary.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.tdsauditsummary.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.tdsauditsummary.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.tdsauditsummary.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        PPayMonthFrom: `'${this.tdsauditsummary.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        PPayMonthTo: `'${this.tdsauditsummary.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,
        PSalType: `'${this.tdsauditsummary.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'`        
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.tdsauditsummary.patchValue({
        reportParameters: {
        PCoyFrom: res.data.fromcoy,
        PCoyTo: res.data.tocoy,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpCodeTo: res.data.toEmpcode,
        PPayMonthFrom: res.data.topaymonth,
        PPayMonthTo: res.data.frompaymonth,
        PSalType: ['S']
        }
     })
    }
  });
  }


}
