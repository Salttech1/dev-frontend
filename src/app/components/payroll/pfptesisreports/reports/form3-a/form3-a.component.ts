import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Component({
  selector: 'app-form3-a',
  templateUrl: './form3-a.component.html',
  styleUrls: ['./form3-a.component.css']
})
export class Form3AComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  pfform3a: FormGroup = new FormGroup({
    name: new FormControl('PYRL_FORM - 3A.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyFrom: new FormControl('', Validators.required),
      PCoyTo: new FormControl('', Validators.required),
      PEmpCodeFrom: new FormControl(''),
      PEmpCodeTo: new FormControl(''),
      PPayMonthFrom: new FormControl('', Validators.required),            
      PPayMonthTo: new FormControl('', Validators.required),      
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
    console.log("fromvalue",this.pfform3a.value);    
    if (this.pfform3a.valid) {

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
      name: 'PYRL_FORM - 3A.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.pfform3a.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        PCoyTo: `'${this.pfform3a.controls['reportParameters']?.get('PCoyTo')?.value[0][0]}'`,
        PEmpCodeFrom: `'${this.pfform3a.controls['reportParameters']?.get('PEmpCodeFrom')?.value[0][0]}'`,
        PEmpCodeTo: `'${this.pfform3a.controls['reportParameters']?.get('PEmpCodeTo')?.value[0][0]}'`,
        PPayMonthFrom: `'${this.pfform3a.controls['reportParameters']?.get('PPayMonthFrom')?.value}'`,
        PPayMonthTo: `'${this.pfform3a.controls['reportParameters']?.get('PPayMonthTo')?.value}'`,
        PSalType: `'${this.pfform3a.controls['reportParameters']?.get('PSalType')?.value[0][0]}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      const dateFilter = this.transformDate(res.data.topaymonth);
      console.log("month sorted",dateFilter);
      this.pfform3a.patchValue({
        reportParameters: {
        PCoyFrom: res.data.fromcoy,
        PCoyTo: res.data.tocoy,
        PEmpCodeFrom: res.data.fromEmpcode,
        PEmpCodeTo: res.data.toEmpcode,
        PPayMonthFrom: dateFilter.firstString,
        PPayMonthTo:  dateFilter.secondString,
        PSalType: 'S'
        }
     })
    }
  });
  }


  transformDate(input: string): { firstString: string; secondString: string } {
    var Baseyear = +input.substring(0, 4);
    var year = +input.substring(0, 4);
    const month = +input.substring(4);
    let firstMonth: number;
    let secondMonth: number;

    if (month < 3) {
      firstMonth = 3;
      secondMonth = 2;
      year -= 1;
    } else {
      firstMonth = 3;
      secondMonth = 2;
      if (month >= 3) {
        year += 1;
      }
    }

    if (month >= 3) {
      var firstString = `${Baseyear}${String(firstMonth).padStart(2, '0')}`;
      var secondString = `${year}${String(secondMonth).padStart(2, '0')}`;

    } else {
      var firstString = `${year}${String(firstMonth).padStart(2, '0')}`;
      var secondString = `${Baseyear}${String(secondMonth).padStart(2, '0')}`;
    }


    return { firstString, secondString };
  }

}
