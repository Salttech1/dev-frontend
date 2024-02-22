import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';


@Component({
  selector: 'app-reimbursementpayment',
  templateUrl: './reimbursementpayment.component.html',
  styleUrls: ['./reimbursementpayment.component.css']
})
export class ReimbursementpaymentComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  reimbursementpayment: FormGroup = new FormGroup({
    name: new FormControl('PYRL_ReimbursementPayment.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyTo: new FormControl('', Validators.required),
      PPayMonthTo: new FormControl('', Validators.required),            
      Str_EmpITDeclDetail: new FormControl(''),
      Str_EmpSalaryPackage: new FormControl(''),      
      HeaderText1: new FormControl(''),
      HeaderText2: new FormControl(''),      
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
    console.log("fromvalue",this.reimbursementpayment.value);  
    if (this.reimbursementpayment.valid) {

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
    console.log("here");    
    this.payLoad = {
      name: 'PYRL_ReimbursementPayment.rpt',
      isPrint: false,
      reportParameters: {
        PCoyTo: `'${this.reimbursementpayment.controls['reportParameters']?.get('PCoyTo')?.value?.join("','")}'`,
        PPayMonthTo: `${this.reimbursementpayment.controls['reportParameters']?.get('PPayMonthTo')?.value}`,
        Str_EmpITDeclDetail: `${this.reimbursementpayment.controls['reportParameters']?.get('Str_EmpITDeclDetail')?.value[0][0]}`,
        Str_EmpSalaryPackage: `${this.reimbursementpayment.controls['reportParameters']?.get('Str_EmpITDeclDetail')?.value[0][1]}`,
        HeaderText1: `${this.reimbursementpayment.controls['reportParameters']?.get('HeaderText1')?.value}`, 
        HeaderText2: this.reimbursementpayment.controls['reportParameters']?.get('HeaderText1')?.value == 'C' 
                ? "Company - Employeewise " + `${this.reimbursementpayment.controls['reportParameters']?.get('Str_EmpITDeclDetail')?.value[0][1].trim()}` + " Reimbursement Payment Report for - " 
                : "Company - Departmentwise " + `${this.reimbursementpayment.controls['reportParameters']?.get('Str_EmpITDeclDetail')?.value[0][1].trim()}` + " Reimbursement Payment Report for - ",
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.reimbursementpayment.patchValue({
        reportParameters: {
          PPayMonthTo: res.data.topaymonth          
        }
     })
    }
  });
  }

}
