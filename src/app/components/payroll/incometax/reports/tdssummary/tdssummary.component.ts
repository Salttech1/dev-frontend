import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-tdssummary',
  templateUrl: './tdssummary.component.html',
  styleUrls: ['./tdssummary.component.css']
})
export class TdssummaryComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  tdssummary: FormGroup = new FormGroup({
    name: new FormControl('PYRL_TDSSUMMARY.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyFrom: new FormControl('', Validators.required),
      PCoyTo: new FormControl('', Validators.required),
      PEmpCodeFrom: new FormControl(''),
      PEmpcodeTo: new FormControl(''),
      PPayMonthTo: new FormControl('', Validators.required),      
      PSalType: new FormControl('', Validators.required),
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
    console.log("fromvalue",this.tdssummary.value);    
    if (this.tdssummary.valid) {

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
      name: 'PYRL_TDSSUMMARY.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.tdssummary.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.tdssummary.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.tdssummary.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpcodeTo: `'${this.tdssummary.controls['reportParameters']?.get('PEmpcodeTo')?.value[0][0]}'`,
        PPayMonthTo: `'${this.tdssummary.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,
        PSalType: `'${this.tdssummary.controls['reportParameters']?.get('PSalType')?.value[0][0]}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.tdssummary.patchValue({
        reportParameters: {
        PCoyFrom: res.data.fromcoy,
        PCoyTo: res.data.tocoy,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpcodeTo: res.data.toEmpcode,
        PPayMonthTo: res.data.topaymonth,
        PSalType: 'S'
        }
     })
    }
  });
  }


}
