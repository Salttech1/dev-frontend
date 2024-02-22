import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';


@Component({
  selector: 'app-allotmentreport',
  templateUrl: './allotmentreport.component.html',
  styleUrls: ['./allotmentreport.component.css']
})
export class AllotmentreportComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  allotmentreport: FormGroup = new FormGroup({
    name: new FormControl('PYRL_BonusAllotment.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PPayMonth: new FormControl('', Validators.required),            
      Company: new FormControl('', Validators.required),
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

  ngOnInit(): void {}

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.allotmentreport.value);    

    if (this.allotmentreport.controls['reportParameters']?.get('Company')?.value !== "" 
      && this.allotmentreport.controls['reportParameters']?.get('PPayMonth')?.value !== "") {      

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

  checkBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }


  setReportValue() {
    this.payLoad = {
      name: 'PYRL_BonusAllotment.rpt',
      isPrint: false,
      reportParameters: {
        PPayMonth: `'${this.allotmentreport.controls['reportParameters']?.get('PPayMonth')?.value}'`,
        Company: `'${this.allotmentreport.controls['reportParameters']?.get('Company')?.value[0][0]}'`,
        HeaderText1: this.allotmentreport.controls['reportParameters']?.get('HeaderText1')?.value, 
        HeaderText2: this.allotmentreport.controls['reportParameters']?.get('HeaderText2')?.value  ? "Y" : "N"         
      }
    } ;
  }


}
