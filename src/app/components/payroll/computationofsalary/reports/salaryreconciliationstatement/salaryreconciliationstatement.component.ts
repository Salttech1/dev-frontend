import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';

@Component({
  selector: 'app-salaryreconciliationstatement',
  templateUrl: './salaryreconciliationstatement.component.html',
  styleUrls: ['./salaryreconciliationstatement.component.css']
})
export class SalaryreconciliationstatementComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;

  salaryreconciliationstatement: FormGroup = new FormGroup({
    name: new FormControl('PYRL_SalaryReconciliationStatement.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCoyFrom: new FormControl('', Validators.required),
      pDeptFrom: new FormControl(''),
      pDeptTo: new FormControl(''),
      pEmpCodeFrom: new FormControl(''),
      pEmpCodeTo: new FormControl(''),
      PPaymonthFrom: new FormControl('', Validators.required),            
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
    console.log("fromvalue",this.salaryreconciliationstatement.value);    
    if (this.salaryreconciliationstatement.valid) {

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
      name: 'PYRL_SalaryReconciliationStatement.rpt',
      isPrint: false,
      reportParameters: {
        PCoyFrom: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('PCoyFrom')?.value[0][0]}'`,
        pDeptFrom: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('pDeptFrom')?.value[0][0]}'`,
        pDeptTo: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('pDeptTo')?.value[0][0]}'`,
        pEmpCodeFrom: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('pEmpCodeFrom')?.value[0][0]}'`,
        pEmpCodeTo: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('pEmpCodeTo')?.value[0][0]}'`,
        PPaymonthFrom: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('PPaymonthFrom')?.value}'`,
        PSalType: `'${this.salaryreconciliationstatement.controls['reportParameters']?.get('PSalType')?.value?.join("','")}'`
      }
    } ;
  }

GetDefaultValue(){
  this.fetchRequestAPI = 'payrollreports/reportparameters';
  this.payreportsService.GetReportParameters().subscribe((res: any) => {
    if(res.status){
      console.log(res.data);
      this.salaryreconciliationstatement.patchValue({
        reportParameters: {
        PCoyFrom: res.data.fromcoy,
        pDeptFrom: res.data.fromdept,
        pDeptTo: res.data.todept,
        pEmpCodeFrom: res.data.fromEmpcode,
        pEmpCodeTo: res.data.toEmpcode,
        PPaymonthFrom: res.data.topaymonth,
        PSalType: ['S']
        }
     })
    }
  });
  }


}
