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
  selector: 'app-infrafuturecollectionreport',
  templateUrl: './infrafuturecollectionreport.component.html',
  styleUrls: ['./infrafuturecollectionreport.component.css']
  })
export class InfrafuturecollectionreportComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  Infrafuturecollectionreport: FormGroup = new FormGroup({
    name: new FormControl('IN_RP_InfraColl_n_FutureColl.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      pBldgCode: new FormControl('', Validators.required),      
      pUpToMonth: new FormControl('', Validators.required),      
      pChargeCode: new FormControl('', Validators.required),
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
    console.log("fromvalue",this.Infrafuturecollectionreport.value);    
    if (this.Infrafuturecollectionreport.valid) {

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
      name: 'IN_RP_InfraColl_n_FutureColl.rpt',
      isPrint: false,
      reportParameters: {
        pBldgCode: `${this.Infrafuturecollectionreport.controls['reportParameters']?.get('pBldgCode')?.value[0][0].trimEnd()}`,
        pUpToMonth: `${this.Infrafuturecollectionreport.controls['reportParameters']?.get('pUpToMonth')?.value}`,
        pChargeCode: `${this.Infrafuturecollectionreport.controls['reportParameters']?.get('pChargeCode')?.value[0][0].trimEnd()}`,
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.Infrafuturecollectionreport.patchValue({
        reportParameters: {
        pUpToMonth: res.data.frompaymonth,
        }
     })
    }
  });
  }
}
