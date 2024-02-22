import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-form3abefore2004',
  templateUrl: './form3abefore2004.component.html',
  styleUrls: ['./form3abefore2004.component.css']
})
export class Form3abefore2004Component implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  form3abefore2004: FormGroup = new FormGroup({
    name: new FormControl('PYRL_FORM - 3A_before2004.rpt'),
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
    console.log("fromvalue",this.form3abefore2004.value);    
    if (this.form3abefore2004.valid) {

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
      name: 'PYRL_FORM - 3A_before2004.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.form3abefore2004.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.form3abefore2004.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.form3abefore2004.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.form3abefore2004.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        PPayMonthFrom: `'${this.form3abefore2004.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        PPayMonthTo: `'${this.form3abefore2004.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,
        PSalType: `'${this.form3abefore2004.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'`        
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.form3abefore2004.patchValue({
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
