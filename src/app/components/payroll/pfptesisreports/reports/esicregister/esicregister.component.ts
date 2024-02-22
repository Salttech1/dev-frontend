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
  selector: 'app-esicregister',
  templateUrl: './esicregister.component.html',
  styleUrls: ['./esicregister.component.css']
})
export class EsicregisterComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  esicregister: FormGroup = new FormGroup({
    name: new FormControl('PYRL_EsicRegister.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PYear: new FormControl(''),
      rbYear: new FormControl('F'),            
      PPayMonthFrom: new FormControl('', Validators.required),      
      PPayMonthTo: new FormControl('', Validators.required),            
      PSalType: new FormControl(''),      
      PCoyFrom: new FormControl('', Validators.required),
      PCoyTo: new FormControl('', Validators.required),
      PDeptCode: new FormControl(''),
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
    setTimeout(() => {
    this.setMonth();
  }, 100);
  }

  setMonth() {
    let pYearTo = Number(this.esicregister.controls['reportParameters']?.get('PYear')?.value) + 1 ;
    this.esicregister.patchValue({
      reportParameters: {

      PPayMonthFrom: this.esicregister.controls['reportParameters']?.get('rbYear')?.value == 'F' ? `${this.esicregister.controls['reportParameters']?.get('PYear')?.value}` + '04' : `${this.esicregister.controls['reportParameters']?.get('PYear')?.value}` + '10',
      PPayMonthTo: this.esicregister.controls['reportParameters']?.get('rbYear')?.value == 'F' ? `${this.esicregister.controls['reportParameters']?.get('PYear')?.value}` + '09' : pYearTo + '03'
      }
   })

  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.esicregister.value);  
    this.setMonth()  ;
    if (this.esicregister.valid) {

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
      name: 'PYRL_EsicRegister.rpt',
      isPrint: false,
      reportParameters: {
        PPayMonthFrom: `'${this.esicregister.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        PPayMonthTo: `'${this.esicregister.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,                
        PSalType: `'${this.esicregister.controls['reportParameters']?.get('PSalType')?.value[0][0]}'`,                
        PCoyFrom: `'${this.esicregister.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.esicregister.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PDeptCode: `'${this.esicregister.controls['reportParameters']?.get('PDeptCode')?.value[0][0]}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.esicregister.patchValue({
        reportParameters: {
        PYear: moment(new Date(), 'DD/MM/YYYY').format('YYYY'),  
        PCoyFrom: res.data.fromcoy,
        PCoyTo: res.data.tocoy,
        PSalType:  'S',
        PDeptCode: 'ALL'
        }
     })
    }
  });
  }

}
