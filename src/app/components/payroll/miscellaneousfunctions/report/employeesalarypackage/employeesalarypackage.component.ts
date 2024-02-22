import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';

@Component({
  selector: 'app-employeesalarypackage',
  templateUrl: './employeesalarypackage.component.html',
  styleUrls: ['./employeesalarypackage.component.css']
})
export class EmployeesalarypackageComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  employeesalarypackage: FormGroup = new FormGroup({
    name: new FormControl('PYRL_EmployeeSalaryPackage.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),      
      PDeptFrom: new FormControl(''),
      PDeptTo: new FormControl(''),
      PEmpCodeFrom: new FormControl(''),
      PEmpCodeTo: new FormControl(''),
      PPayMonthFrom: new FormControl('', Validators.required),                  
      pActDate: new FormControl('',Validators.required),
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
    console.log("fromvalue",this.employeesalarypackage.value);    
    if (this.employeesalarypackage.valid) {

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
      name: 'PYRL_EmployeeSalaryPackage.rpt',
      isPrint: false,
      reportParameters: {
        PCompany: `'${this.employeesalarypackage.controls['reportParameters']?.get('PCompany')?.value?.join("','")}'`,        
        PDeptFrom: `'${this.employeesalarypackage.controls['reportParameters']?.get('PDeptFrom')?.value[0][0]}'`,
        PDeptTo: `'${this.employeesalarypackage.controls['reportParameters']?.get('PDeptTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.employeesalarypackage.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.employeesalarypackage.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        PPayMonthFrom: `'${this.employeesalarypackage.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        pActDate : `${moment(this.employeesalarypackage.controls['reportParameters']?.get('pActDate')?.value, 'DD/MM/YYYY').format('YYYY-MM-DD')}`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.employeesalarypackage.patchValue({
        reportParameters: {
        PCompany: res.data.company,
        PDeptFrom: res.data.fromdept,
        PDeptTo: res.data.todept,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpCodeTo: res.data.toEmpcode,
        PPayMonthFrom: res.data.topaymonth,
        pActDate : new Date()
        }
     })
    }
  });
  }


}
