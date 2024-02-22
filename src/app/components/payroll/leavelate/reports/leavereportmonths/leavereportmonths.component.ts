import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-leavereportmonths',
  templateUrl: './leavereportmonths.component.html',
  styleUrls: ['./leavereportmonths.component.css']
})
export class LeavereportmonthsComponent implements OnInit {
  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  leaveByMonth: FormGroup = new FormGroup({
    name: new FormControl('PYRL_LeaveReport_Months.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyFrom: new FormControl('', Validators.required),
      PCoyTo: new FormControl('', Validators.required),
      PDeptFrom: new FormControl(''),
      PDeptTo: new FormControl(''),
      PEmpCodeFrom: new FormControl(''),
      PEmpCodeTo: new FormControl(''),
      PPayMonthTo: new FormControl('', Validators.required),      
      PWorksiteFrom: new FormControl(''),
      PWorksiteTo: new FormControl(''),
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
    console.log("fromvalue",this.leaveByMonth.value);    
    if (this.leaveByMonth.valid) {

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
      name: 'PYRL_LeaveReport_Months.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.leaveByMonth.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.leaveByMonth.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PDeptFrom: `'${this.leaveByMonth.controls['reportParameters']?.get('PDeptFrom')?.value[0][0]}'`,
        PDeptTo: `'${this.leaveByMonth.controls['reportParameters']?.get('PDeptTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.leaveByMonth.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.leaveByMonth.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        PPayMonthTo: `'${this.leaveByMonth.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,
        PWorksiteFrom: `'${this.leaveByMonth.controls['reportParameters']?.get('PWorksiteFrom')?.value[0][0]}'`,
        PWorksiteTo: `'${this.leaveByMonth.controls['reportParameters']?.get('PWorksiteTo')?.value[0][0]}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.leaveByMonth.patchValue({
        reportParameters: {
        PCoyFrom: res.data.fromcoy,
        PCoyTo: res.data.tocoy,
        PDeptFrom: res.data.fromdept,
        PDeptTo: res.data.todept,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpCodeTo: res.data.toEmpcode,
        PPayMonthTo: res.data.frompaymonth,
        PWorksiteFrom: res.data.fromWorksite,
        PWorksiteTo: res.data.toWorksite
        }
     })
    }
  });
  }

}
