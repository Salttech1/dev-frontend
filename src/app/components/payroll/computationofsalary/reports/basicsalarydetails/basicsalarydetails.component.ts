import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-basicsalarydetails',
  templateUrl: './basicsalarydetails.component.html',
  styleUrls: ['./basicsalarydetails.component.css']
})
export class BasicsalarydetailsComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  basicsalarydetails: FormGroup = new FormGroup({
    name: new FormControl('PYRL_BasicSalary.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      pCompany: new FormControl('', Validators.required),
      pPayMonthTo: new FormControl('', Validators.required),            
      pWorkSite: new FormControl(''),      
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
    console.log("fromvalue",this.basicsalarydetails.value);  
    // debugger  
    if (this.basicsalarydetails.controls['reportParameters']?.get('pCompany')?.value !== "" 
      && this.basicsalarydetails.controls['reportParameters']?.get('pPayMonthTo')?.value !== "") {

      this.loaderToggle = true;
      this.setReportValue();
      console.log("payload",this.payLoad);    //FOR DEBUG

      this.commonReportService
      .getParameterizedReportWithCondition(this.payLoad)
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

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }

  setReportValue() {
    this.payLoad = {
      seqId: this.basicsalarydetails.controls['reportParameters']?.get('pWorkSite')?.value !== '' ? 1 : 2 , 
      name: 'PYRL_BasicSalary.rpt',
      isPrint: false,
      reportParameters: {
        pCompany: `'${this.basicsalarydetails.controls['reportParameters']?.get('pCompany')?.value?.join("','")}'`,        
        pPayMonthTo: `'${this.basicsalarydetails.controls['reportParameters']?.get('pPayMonthTo')?.value}'`,
        pWorkSite: this.basicsalarydetails.controls['reportParameters']?.get('pWorkSite')?.value.length !== 0 ? ` and ejin_worksite	in ('${this.basicsalarydetails.controls['reportParameters']?.get('pWorkSite')?.value?.join("','")}' )` :'' , 
        HeaderText1: this.basicsalarydetails.controls['reportParameters']?.get('HeaderText1')?.value  ? "'Y'" : "'N'" , 
        HeaderText2: this.basicsalarydetails.controls['reportParameters']?.get('HeaderText2')?.value  ? "'Y'" : "'N'"         
      }
    } ;
    console.log(this.payLoad);
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.basicsalarydetails.patchValue({
        reportParameters: {
        pPayMonthto: res.data.frompaymonth
        }
     })
    }
  });
  }




}
