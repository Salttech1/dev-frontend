import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-incomingoutgoingholdemployeelist',
  templateUrl: './incomingoutgoingholdemployeelist.component.html',
  styleUrls: ['./incomingoutgoingholdemployeelist.component.css']
})
export class IncomingoutgoingholdemployeelistComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  incomingoutgoingholdemployeelist: FormGroup = new FormGroup({
    name: new FormControl('PYRL_ListIncOutGoingEmployees.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),
      PPayMonthFrom: new FormControl('', Validators.required),      
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
    console.log("fromvalue",this.incomingoutgoingholdemployeelist.value);    
    if (this.incomingoutgoingholdemployeelist.valid) {

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
      name: 'PYRL_ListIncOutGoingEmployees.rpt',
      isPrint: false,
      reportParameters: {
        PCompany: `'${this.incomingoutgoingholdemployeelist.controls['reportParameters']?.get('PCompany')?.value?.join("','")}'`,
        PPayMonthFrom: `'${this.incomingoutgoingholdemployeelist.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        PSalType: `'${this.incomingoutgoingholdemployeelist.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.incomingoutgoingholdemployeelist.patchValue({
        reportParameters: {
        PPayMonthFrom: res.data.frompaymonth,
        PSalType: ['S']
        }
     })
    }
  });
  }
}
