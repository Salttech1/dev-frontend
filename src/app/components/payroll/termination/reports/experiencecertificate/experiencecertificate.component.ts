import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { PayreportsService } from 'src/app/services/payroll/reports/payreports.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as moment from 'moment';

@Component({
  selector: 'app-experiencecertificate',
  templateUrl: './experiencecertificate.component.html',
  styleUrls: ['./experiencecertificate.component.css']
})
export class ExperiencecertificateComponent implements OnInit {

  loaderToggle: boolean = false;
  payLoad: any ;
  fetchRequestAPI: any;
  empl_condition = '';
  employeeTableData: any = [];
  companyCode = '';

  experiencecertificate: FormGroup = new FormGroup({
    name: new FormControl('PYRL_ExpCert.rpt'),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl('', Validators.required),
      PEmpCode: new FormControl('', Validators.required),
      EmpDesig: new FormControl('', Validators.required),
      Certdate: new FormControl('', Validators.required),
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

    this.experiencecertificate.get('reportParameters')
    ?.get('PCompany')
    ?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let coy = res;
          this.companyCode = `eper_empcode in (select ejin_empcode from empjobinfo where ejin_company = '${coy.join()}' and ejin_jobstatus = 'T')`;
        }
      },
    });

   }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }


  getReport(print: boolean) {
    console.log("fromvalue",this.experiencecertificate.value);    
    if (this.experiencecertificate.valid) {

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
      name: 'PYRL_ExpCert.rpt',
      isPrint: false,
      reportParameters: {
        PEmpCode: `'${this.experiencecertificate.controls['reportParameters']?.get('PEmpCode')?.value[0][0]}'`,
        EmpDesig: this.experiencecertificate.controls['reportParameters']?.get('EmpDesig')?.value,
        Certdate: `${moment(this.experiencecertificate.controls['reportParameters']?.get('Certdate')?.value, 'DD/MM/YYYY').format('DD-MM-YYYY')}`
        // Certdate: `utpal`        

      }
    } ;
  }

  getEmplList(PCompany: any) {
    this.empl_condition = `eper_empcode in (select ejin_empcode from empjobinfo where ejin_company = '` + PCompany?.trim() + `')` ;
    this.dynapop
      .getDynaPopListObj('EMPPERS', `${this.empl_condition}`)
      .subscribe({
        next: (res: any) => {
          this.employeeTableData = res.data;
        },
      });
  }

}
