import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-soldunsoldreport',
  templateUrl: './soldunsoldreport.component.html',
  styleUrls: ['./soldunsoldreport.component.css']
})
export class SoldunsoldreportComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  soldunsoldreport: FormGroup = new FormGroup({
    name: new FormControl('Rpt_Sold_Unsold_Mailing_list_JAVA.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      pBldgCode: new FormControl(''),
      pWings: new FormControl(''),      
    }),
  });

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
  ) {}


   ngOnInit(): void {
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean) {
    console.log("fromvalue",this.soldunsoldreport.value);    
    if (this.soldunsoldreport.valid) {

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
      name: 'Rpt_Sold_Unsold_Mailing_list_JAVA.rpt',
      isPrint: false,
      reportParameters: {
        pBldgCode: `'${this.soldunsoldreport.controls['reportParameters']?.get('pBldgCode')?.value?.join("','")}'` ,
        pWings: `'${this.soldunsoldreport.controls['reportParameters']?.get('pWings')?.value?.join("','")}'` 
      }
    } ;
  }

 }
