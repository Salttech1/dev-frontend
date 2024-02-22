import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-bldgwiseannualexpensesreport',
  templateUrl: './bldgwiseannualexpensesreport.component.html',
  styleUrls: ['./bldgwiseannualexpensesreport.component.css']
})
export class BldgwiseannualexpensesreportComponent implements OnInit {
  loaderToggle: boolean = false;
  accYear!: string;
  formname!: any;
  conditionId = 1

  Bldgwiseannualexpensesdetail: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    name: new FormControl<string>('', Validators.required),
    TxtYear: new FormControl('',[Validators.required, Validators.minLength(9), Validators.pattern("^[0-9]{4}[\-]{1}[0-9]{4}$"), yearRange()]),
    reportParameters: new FormGroup({
      formname: new FormControl(''),
      TxtYear:new FormControl(''),
      TxtYear1:new FormControl(''),
      
      
    }),
  });
  
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _service: ServiceService,
    private commonReportService: CommonReportsService,
  ) { }

  ngOnInit(): void {
    this.setAccountingYear();
    this._service.pageData.subscribe({
      next: (val) => {
        this.formname = `${val.formName}`;
        this.Bldgwiseannualexpensesdetail.patchValue({
          reportParameters: {
            formname: `${val.formName}`,
          },
        });
      },
    });
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  setAccountingYear() {
    if (new Date().getMonth() + 1 >= 4) {
      this.Bldgwiseannualexpensesdetail.patchValue({
        TxtYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
      });
      this.accYear =  new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString() ;
    } else {
      this.Bldgwiseannualexpensesdetail.patchValue({
        TxtYear: (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString(),
      });
      this.accYear =  (new Date().getFullYear() - 1).toString() + '-' + new Date().getFullYear().toString();
    }
  }

  getReport(print: boolean) {
    console.log('form',this.Bldgwiseannualexpensesdetail)
    if (this.Bldgwiseannualexpensesdetail.valid){
    this.loaderToggle = true;
    this.setReportValues();

    let payLoad: Object = {
      name: this.Bldgwiseannualexpensesdetail.get('name')?.value == 'Materialwise' ? "BldgMatwise.rpt":( this.Bldgwiseannualexpensesdetail.get('name')?.value == 'CertWise' ? "BldgCertwise.rpt":  (this.Bldgwiseannualexpensesdetail.get('name')?.value == 'IncrementalWise' ? "BldgwiseIncremental.rpt":'invalid')),
      seqId: 1,
      conditionId: this.conditionId,
      isPrint: false,
      exportType: this.Bldgwiseannualexpensesdetail.get('exportType')?.value,
      reportParameters: {
        chkdt:'Y',
        formname : 'FrmAEVE_VE_RP',
        TxtYear :"'"+ `${this.Bldgwiseannualexpensesdetail.get('TxtYear')?.value?.split("-")[0]}`+"'" ,
        TxtYear1 : "'"+ `${this.Bldgwiseannualexpensesdetail.get('TxtYear')?.value?.split("-")[1]}`+"'",
      },
    }

    this.commonReportService
    .getTtxParameterizedReportWithCondition(payLoad)
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
      this.toastr.error('Please fill the input properly')
    
    }
  }

  setReportValues() {
      this.Bldgwiseannualexpensesdetail.patchValue({
        reportParameters: {
 
          TxtYear : `${this.Bldgwiseannualexpensesdetail.get('TxtYear')?.value?.split("-")[0]}` ,
          TxtYear1 : `${this.Bldgwiseannualexpensesdetail.get('TxtYear')?.value?.split("-")[1]}`,
        },
      });
      console.log("------->",this.Bldgwiseannualexpensesdetail);
  }

}

export function yearRange(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let TxtYear = _control.value
    let firstFourCharacter = TxtYear.slice(0, 4)
    let secondFourCharacter = TxtYear.slice(5, 9)
    if (secondFourCharacter > firstFourCharacter && secondFourCharacter - firstFourCharacter == 1) {
      return null
    }
    return { 'TxtYear': true }

  };


}
