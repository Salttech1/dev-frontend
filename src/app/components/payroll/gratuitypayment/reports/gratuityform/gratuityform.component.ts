import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import { DynapopService } from 'src/app/services/dynapop.service';

@Component({
  selector: 'app-gratuityform',
  templateUrl: './gratuityform.component.html',
  styleUrls: ['./gratuityform.component.css']
})
export class GratuityformComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;
  empl_condition = '';
  employeeTableData: any = [];
  companyCode = '';

  gratuityform: FormGroup = new FormGroup({
    name: new FormControl('PYRL_GratuityForm.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),
      PEmpCode: new FormControl('', Validators.required),
    }),
  });

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2,
    private payreportsService: PayreportsService,
    private dynapop: DynapopService,    
  ) {}

  ngOnInit(): void { 
      this.gratuityform.controls['reportParameters']?.get('PCompany')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let coy = res[0][0];
          this.companyCode = `eper_empcode in (select ejin_empcode from empjobinfo where ejin_company = '${coy}' and ejin_jobstatus = 'T')`;
          // this.companyCode = `eper_empcode in (select ejin_empcode from empjobinfo where ejin_company = '${coy}')`;
        }
      },
    });

   }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.gratuityform.value);    
    if (this.gratuityform.valid) {

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
      name: 'PYRL_GratuityForm.rpt',
      isPrint: false,
      reportParameters: {
        PEmpCode: `'${this.gratuityform.controls['reportParameters']?.get('PEmpCode')?.value[0][0]}'`
      }
    } ;
  }

}
