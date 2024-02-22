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
  selector: 'app-createmonthlypffile',
  templateUrl: './createmonthlypffile.component.html',
  styleUrls: ['./createmonthlypffile.component.css']
})
export class CreatemonthlypffileComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  createmonthlypffile: FormGroup = new FormGroup({
    name: new FormControl(''),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),
      PPayMonth: new FormControl('', Validators.required)
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

  exportReport_x() {
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305    
    let CoyCode = `${this.createmonthlypffile.controls['reportParameters']?.get('PCompany')?.value[0][0].trim()}`;
    let PMonth = `${this.createmonthlypffile.controls['reportParameters']?.get('PPayMonth')?.value}` ;
    let filename = 'PF-Month' + PMonth + CoyCode + ".xls"
    let params = new HttpParams().set('comanyCode', CoyCode).set('paymonth', PMonth);   
    this.http.get(`${environment.API_URL}payrollreports/export-pf-report`, { params: params, responseType: 'blob' }).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        let excelFile = new Blob([res], { type: 'xls' });
        fileSaver.saveAs(excelFile, filename);
      },
      error: (err: any) => {
        this.loaderToggle = false
      }
    })
  }

  exportReport() {
    if (this.createmonthlypffile?.valid) {
      this.loaderToggle = true;
      let CoyCode = `${this.createmonthlypffile.controls['reportParameters']?.get('PCompany')?.value[0][0].trim()}`;
      let PMonth = `${this.createmonthlypffile.controls['reportParameters']?.get('PPayMonth')?.value}` ;
      this.payreportsService.CreateMonthlyPFFile(CoyCode,PMonth).subscribe( {
        next: (res) => {
            this.loaderToggle = false
            console.log("res", res);
            let excelFile = new Blob([res], { type: 'xls' });
            console.log("res 2", res);            
                // PF-Month202306_FEHO.xls
          let filename = 'PF-Month' +  PMonth + '_' + CoyCode + ".xls"
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
      this.createmonthlypffile.markAllAsTouched()
    }
  }

  GetDefaultValue(){
    this.fetchRequestAPI = 'payrollreports/reportparameters';
    this.payreportsService.GetReportParameters().subscribe((res: any) => {
      if(res.status){
        console.log(res.data);
        this.createmonthlypffile.patchValue({
          reportParameters: {
            PPayMonth: res.data.frompaymonth
          }
       })
      }
    });
    }


}
