import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-employeedetails-personal',
  templateUrl: './employeedetails-personal.component.html',
  styleUrls: ['./employeedetails-personal.component.css']
})
export class EmployeedetailsPersonalComponent implements OnInit {
  loaderToggle: boolean = false;

  EmpDetPersonal: FormGroup = new FormGroup({
    name: new FormControl('PYRL_EmpDetails-Personal.rpt'),
    TxtCompany: new FormControl<String[]>([], Validators.required),    
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      PCompany: new FormControl(''),
    }),


  });

  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private toastr: ToastrService,
    private rendered: Renderer2
  ) { }

  ngOnInit(): void {
    this.focusById('TxtCompanyid');
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  getReport(print: boolean){
    if (this.EmpDetPersonal.valid) {
      let reval = this.EmpDetPersonal.get('TxtCompany')?.value;
      this.loaderToggle = true;
      let coycode = reval?.[0][0];
      let payload = {
        name: 'PYRL_EmpDetails-Personal.rpt',
        isPrint: false,
        TxtCompany: reval?.[0][0],
        reportParameters: {
          formname: "",
          PCompany: `'${coycode}'`
        },
      };

      this.commonReportService
        .getParameterizedReport(payload)
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

  focusById(id: string) {
    this.rendered.selectRootElement(`#${id}`)?.focus();
  }

}
