import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { serverPath } from 'src/constants/commonconstant';

@Component({
  selector: 'app-employeedetailsphoto',
  templateUrl: './employeedetailsphoto.component.html',
  styleUrls: ['./employeedetailsphoto.component.css']
})
export class EmployeedetailsphotoComponent implements OnInit {
  loaderToggle: boolean = false;

  EmpDetPhoto: FormGroup = new FormGroup({
    TxtCompany: new FormControl<String>('', Validators.required),
    TxtDept: new FormControl<String>(''),
    TxtSite: new FormControl<String>(''),
    TxtEmpFrom: new FormControl<String>(''),
    TxtEmpTo: new FormControl<String>(''),
    RbSortOn: new FormControl<String>('Dept'),

    name: new FormControl("PYRL_EmpDetailsPhoto.rpt"),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),

    reportParameters : new FormGroup({
      formname: new FormControl(''),
      dept: new FormControl(''),
      worksite: new FormControl(''),
      fromemp: new FormControl(''),
      toemp: new FormControl(''),
      coy: new FormControl(''),
      path: new FormControl(''),
    })
  });
  toastr: any;
 

  constructor(
    private router: Router,
    private commonReportService: CommonReportsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.focusById("TxtCompanyid");
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }
  getReport(print: boolean){
    if (this.EmpDetPhoto.valid) {
      this.loaderToggle = true;
      this.setReportValues();
      // console.log(this.EmpDetPhoto.value);
      this.commonReportService
      .getTtxParameterizedReportWithCondition(this.EmpDetPhoto.value)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.loaderToggle = false;
          let pdfFile = new Blob([res], { type: "application/pdf" });
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
          }
      });
    } else {
      this.toastr.error('Please fill the input properly');
    }

  }

  setReportValues(){
    this.EmpDetPhoto.patchValue({
      reportParameters: {
      dept: this.EmpDetPhoto.get("TxtDept")?.value ? this.EmpDetPhoto.get("TxtDept")?.value?.join("','") : `ALL`,
      worksite: this.EmpDetPhoto.get("TxtSite")?.value ? this.EmpDetPhoto.get("TxtSite")?.value?.join("','") :  `ALL`,
      fromemp: (this.EmpDetPhoto.get("TxtEmpFrom")?.value || this.EmpDetPhoto.get("TxtEmpTo")?.value) ? this.EmpDetPhoto.get("TxtEmpFrom")?.value?.join("','") : `ALL` ,
      toemp: (this.EmpDetPhoto.get("TxtEmpFrom")?.value || this.EmpDetPhoto.get("TxtEmpTo")?.value) ? this.EmpDetPhoto.get("TxtEmpTo")?.value?.join("','") : `ALL` ,
      coy: `${this.EmpDetPhoto.get("TxtCompany")?.value?.join("','")}`,
      path: serverPath + "\\Graphics\\Photo\\",
      }
    })
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }


}
