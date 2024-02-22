import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { fileConstants } from 'src/constants/fileconstants';
import { ServiceService } from 'src/app/services/service.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-challan-report',
  templateUrl: './challan-report.component.html',
  styleUrls: ['./challan-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})


export class ChallanReportComponent implements OnInit {

  supplierQueryCondition : string =  "";
  supplierData: any;
  supplierColumnData!: any[];
  buildingQueryCondition : string = "";
  buildingData: any;
  buildingColumnData!: any[];
  bringBackColumn!: number;
  loaderToggle: boolean = false;
  datePipe = new DatePipe('en-US');
  formName : any ;
 
  constructor(
    private commonReportService: CommonReportsService,    private router: Router,
    public _service: ServiceService) { }

  ngOnInit(): void {
    this.challanReportSectionForm.controls['reportParameters'].get('SupplierName')?.disable();
    this.challanReportSectionForm.controls['reportParameters'].get('buildingName')?.disable();
    setTimeout(function() {
      document.getElementById("supplier4")?.focus();
   }, 100);
    this._service.pageData.subscribe({
      next: (val) => {
        this.formName = `'${val.formName}'` 
        this.challanReportSectionForm.patchValue({
          reportParameters: {
            formname: this.formName,
          },
        });
      },
    });

  }


  challanReportSectionForm: FormGroup = new FormGroup({
    seqId: new FormControl(1),
    isPrint: new FormControl(false),
    name: new FormControl(fileConstants.PurchaseBillChallanReport),
    conditionId: new FormControl(5),
    exportType:new FormControl('PDF'),
    dateRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    reportParameters : new FormGroup({
     
      TxtSuppCode:  new FormControl(''),
      suppCode:  new FormControl<string[] | string>(''),
      SupplierName: new FormControl(''),
      bldgCode: new FormControl<string[] | string>(''),
      buildingName: new FormControl(''),
      reportFromDate: new FormControl(),
      reportToDate: new FormControl(),
      FromDate: new FormControl(''),
      ToDate: new FormControl(''),
      TxtFromDate: new FormControl(''),
      TxtToDate: new FormControl(''),
      formname: new FormControl(''),
      TxtBldgCode: new FormControl(''),
    })

  })


  validateData(){
    console.log(this.challanReportSectionForm.controls['reportParameters'].get('reportFromDate')?.value)
    if(this.challanReportSectionForm.controls['reportParameters'].get('suppCode')?.value == '' || this.challanReportSectionForm.controls['reportParameters'].get('suppCode')?.value == null){
      setTimeout(function() {
        document.getElementById("supplier4")?.focus();
     }, 100);
      return false;
    }
    else{
      return true;
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  setReportCondition(){
    if(this.challanReportSectionForm.controls['dateRange'].get('from')?.value && this.challanReportSectionForm.controls['dateRange'].get('to')?.value){
      this.challanReportSectionForm.patchValue({
        conditionId: 2,
      })
    }
    else{
      this.challanReportSectionForm.patchValue({
        conditionId: 1,
      })
    }

    
}
  setReportParamters(){
    this.setReportCondition();
    console.log(this.challanReportSectionForm.get('conditionId')?.value )
    this.challanReportSectionForm.patchValue({
      reportParameters: {
        TxtSuppCode: this.challanReportSectionForm.get('reportParameters')?.get('suppCode')?.value ?  this.challanReportSectionForm.get('reportParameters')?.get('suppCode')?.value[0][0]?.trim() : "ALL",
        TxtFromDate: this.datePipe.transform(this.challanReportSectionForm.controls['dateRange'].get('from')?.value, "dd/MM/yyyy"),
        TxtToDate: this.datePipe.transform(this.challanReportSectionForm.controls['dateRange'].get('to')?.value, "dd/MM/yyyy"),
        FromDate: this.challanReportSectionForm.controls['dateRange'].get('from')?.value ? `'${this.datePipe.transform(this.challanReportSectionForm.controls['dateRange'].get('from')?.value, "dd.MM.yyyy")}'` : `''`,
        ToDate: this.challanReportSectionForm.controls['dateRange'].get('to')?.value ? `'${this.datePipe.transform(this.challanReportSectionForm.controls['dateRange'].get('to')?.value, "dd.MM.yyyy")}'` : `''`,
        TxtBldgCode: this.challanReportSectionForm.get('reportParameters')?.get('bldgCode')?.value ?  this.challanReportSectionForm.get('reportParameters')?.get('bldgCode')?.value[0][0]?.trim() : "ALL"
      }
    })
   
  }

  getReport(print: boolean){
      if (this._service.printExcelChk(print, this.challanReportSectionForm.get('exportType')?.value!)) {
      this.loaderToggle = true;
      this.setReportParamters();
      this.commonReportService
        .getTtxParameterizedReportWithCondition(this.challanReportSectionForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let filename = this.commonReportService.getReportName();
            this._service.exportReport(print, res, this.challanReportSectionForm.get('exportType')?.value!, filename)
          },
          error: (err: any) => {
            this.loaderToggle = false;
            setTimeout(function() {
              document.getElementById("supplier4")?.focus();
           }, 100);
          },
        });

    
  }}

  resetForm(){
    this.challanReportSectionForm.reset({
      name: fileConstants.PurchaseBillChallanReport,
      seqId: 1,
      conditionId: 5,
      isPrint: false,
      exportType: 'PDF',
      reportParameters:{
        formname: this.formName
      }
    })
    setTimeout(function() {
      document.getElementById("supplier4")?.focus();
   }, 100);
  }
  

}
