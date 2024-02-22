import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import * as moment from 'moment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as constant from '../../../../../../constants/constant'

@Component({
  selector: 'app-grosssalaryinexcel',
  templateUrl: './grosssalaryinexcel.component.html',
  styleUrls: ['./grosssalaryinexcel.component.css']
})
export class GrosssalaryinexcelComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  grosssalaryinexcel: FormGroup = new FormGroup({
    name: new FormControl(''),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PPayMonthFrom: new FormControl('', Validators.required),
    }),
  });


  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
    private http: HttpClient,     
  ) {}

  ngOnInit(): void {
    this.GetDefaultValue();
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.grosssalaryinexcel.patchValue({
        reportParameters: {
        PPayMonthTo: res.data.frompaymonth
        }
     })
    }
  });
  }

  exportReport() {
    if (this.grosssalaryinexcel?.valid) {
      this.loaderToggle = true;
      let PPayMonthFrom = `${this.grosssalaryinexcel.controls['reportParameters']?.get('PPayMonthFrom')?.value}` ;

      this.payreportsService.CreateGrossSalaryFile(PPayMonthFrom).subscribe( {
        next: (res) => {
            this.loaderToggle = false
            console.log("res", res);
            let excelFile = new Blob([res], { type: 'xls' });
            console.log("res 2", res);            
          let filename = 'GrossSalary-Month' +  PPayMonthFrom + ".xls"
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
    else {
      this.grosssalaryinexcel.markAllAsTouched()
    }
  }

}
