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
  selector: 'app-employeesalarydetails',
  templateUrl: './employeesalarydetails.component.html',
  styleUrls: ['./employeesalarydetails.component.css']
})
export class EmployeesalarydetailsComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  employeesalarydetails: FormGroup = new FormGroup({
    name: new FormControl('PYRL_EmployeeSalaryDetails.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),      
      PDeptFrom: new FormControl(''),
      PDeptTo: new FormControl(''),
      PEmpCodeFrom: new FormControl(''),
      PEmpCodeTo: new FormControl(''),
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
    console.log("fromvalue",this.employeesalarydetails.value);    
    if (this.employeesalarydetails.valid) {

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
      name: 'PYRL_EmployeeSalaryDetails.rpt',
      isPrint: false,
      reportParameters: {
        PCompany: `'${this.employeesalarydetails.controls['reportParameters']?.get('PCompany')?.value?.join("','")}'`,        
        PDeptFrom: `'${this.employeesalarydetails.controls['reportParameters']?.get('PDeptFrom')?.value[0][0]}'`,
        PDeptTo: `'${this.employeesalarydetails.controls['reportParameters']?.get('PDeptTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.employeesalarydetails.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.employeesalarydetails.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        pActDate : `${moment(this.employeesalarydetails.controls['reportParameters']?.get('pActDate')?.value, 'DD/MM/YYYY').format('YYYY-MM-DD')}`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      let coy = res.data.fromcoy
      let coyarray = [coy];
      this.employeesalarydetails.patchValue({
        reportParameters: {
        PCompany: coyarray,
        PDeptFrom: res.data.fromdept,
        PDeptTo: res.data.todept,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpCodeTo: res.data.toEmpcode,
        pActDate : new Date()
        }
     })
    }
  });
  }

exportReport() {
  if (this.employeesalarydetails?.valid) {
    this.loaderToggle = true;

    let pcoyCode = `'${this.employeesalarydetails.controls['reportParameters']?.get('PCompany')?.value?.join("','")}'`;
    let pempFrom = `${this.employeesalarydetails.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0].trim()}`;
    let pempTo = `${this.employeesalarydetails.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0].trim()}`;
    let pdeptFrom = `${this.employeesalarydetails.controls['reportParameters']?.get('PDeptFrom')?.value[0][0].trim()}`;
    let pdeptTo = `${this.employeesalarydetails.controls['reportParameters']?.get('PDeptTo')?.value[0][0].trim()}`;
    let ppayDate  = `${moment(this.employeesalarydetails.controls['reportParameters']?.get('pActDate')?.value, 'DD/MM/YYYY').format('DD/MM/YYYY')}`;
debugger
    this.payreportsService.CreateEmployeeSalaryDetails(pcoyCode,pempFrom,pempTo,pdeptFrom,pdeptTo,ppayDate).subscribe( {
      next: (res) => {
        this.loaderToggle = false
        console.log("res", res);
        let excelFile = new Blob([res], { type: 'xls' });
        console.log("res 2", res);            
      let filename = 'EmployeeSalaryDetails' +  ".xls"
      console.log("filename ", filename);
      fileSaver.saveAs(excelFile, filename);
    },
    error: (error) => {
          if (error.status == 400) {
            this.loaderToggle = false
            this.toastr.error('Something went wrong 400');
          } else {
            this.loaderToggle = false
            this.toastr.error('Something went wrong not 400');
          }
        },
    });
  }
}

}
