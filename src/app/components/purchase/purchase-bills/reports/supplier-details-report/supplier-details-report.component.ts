import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import  * as constant from '../../../../../../constants/constant';
import { ModalService } from 'src/app/services/modalservice.service';
import * as moment from 'moment';
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
import { ToasterapiService } from 'src/app/services/toasterapi.service';



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
  selector: 'app-supplier-details-report',
  templateUrl: './supplier-details-report.component.html',
  styleUrls: ['./supplier-details-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class SupplierDetailsReportComponent implements OnInit {

  supplierQueryCondition : string = "";
  supplierData: any;
  supplierColumnData!: any[];
  materialQueryCondition : string = "mat_level ='1' and (mat_closedate IS NULL OR mat_closedate = '01/JAN/2050')";
  materialData: any;
  materialColumnData!: any[];
  bringBackColumn!: number;
  loaderToggle: boolean = false;
  datePipe = new DatePipe('en-US')
  supplier_condition = "par_partytype = 'S'";
  constructor( private modalService: ModalService, private rendered: Renderer2, 
    private commonReportService: CommonReportsService,    private router: Router,
    public _service: ServiceService,  private toastr: ToasterapiService) { }

  ngOnInit(): void {
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
  }



  supplierDetailsSectionFor: FormGroup = new FormGroup({
    name: new FormControl(fileConstants.supplierDetailsReport),
    seqId: new FormControl(3),
    isPrint: new FormControl(false),
    exportType:new FormControl('PDF'),
    dateRange: new FormGroup({
      from: new FormControl<Date | null>(null),
      to: new FormControl<Date | null>(null),
    }),
    reportParameters : new FormGroup({

      SupplierName: new FormControl(''),
      suppierCode:new FormControl<string[] | string>('', Validators.required),
      TxtSuppCode: new FormControl(''),
      matCode: new FormControl<string[] | string>(''),
      TxtMaterialCd: new FormControl(''),
      FRDT: new FormControl(''),
      todt: new FormControl(''),
      reportFromDate: new FormControl(),
      reportToDate: new FormControl(),
      TxtFromDate: new FormControl(''),
      TxtToDate: new FormControl(''),
      HeaderText2: new FormControl(''),
      HeaderText3: new FormControl(''),
      printAdress: new FormControl(false),
      HeaderText1 : new FormControl(''),
    })
  })


  setConditionId(){
    if((this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value && this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value)){
      return 1;
    }
    else{
      return 2;
    }
  }


  chekBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
      this.supplierDetailsSectionFor.patchValue({
        reportParameters:{
          printAdress: event.target.checked
        }
      })
    }
    console.log("FormValue: ", this.supplierDetailsSectionFor.value)
  }


  setReportParamters(){
    let formVal = this.supplierDetailsSectionFor.value;
    this.supplierDetailsSectionFor.patchValue({
      seqId: this.setConditionId(),
      reportParameters : {
        TxtMaterialCd: formVal.reportParameters.matCode && formVal.reportParameters.matCode ? `'${formVal.reportParameters.matCode.join(`','`).trim()}'` : `'ALL'`,
        TxtSuppCode: formVal.reportParameters.suppierCode && formVal.reportParameters.suppierCode.length ? `'${formVal.reportParameters.suppierCode.join(`','`).trim()}'` : `'ALL'`,
        TxtFromDate: this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value, "dd/MM/yyyy"),
        TxtToDate: this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value, "dd/MM/yyyy"),  
        FRDT: this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value!=null ?   `'${this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value, "dd/MM/yyyy")}'` : `''` ,
        todt: this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value!=null ? `'${this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value, "dd/MM/yyyy")}'` : `''`,
        HeaderText2:  this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value!=null ?  `'${this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('from')?.value, "dd/MM/yyyy")}'` : `''`,
        HeaderText3: this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value!=null ?  `'${this.datePipe.transform(this.supplierDetailsSectionFor.controls['dateRange'].get('to')?.value, "dd/MM/yyyy")}'` : `''`,
        HeaderText1: this.supplierDetailsSectionFor.controls['reportParameters'].get('printAdress')?.value ? `'Y'` : `''`
      }
    })
  }

  validateInvalidFormat(event: any, id: any, message: string) {
      if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid() || event.target.value == null) {
        event.target.value = '';
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, message, this.rendered.selectRootElement(`#${id}`)?.focus() ,"error")
      }
      else{
        let startDate = moment(this.supplierDetailsSectionFor.get("reportParameters.reportFromDate")?.value).format('YYYY-MM-DD')
        let endDate = moment(this.supplierDetailsSectionFor.get("reportParameters.reportToDate")?.value).format('YYYY-MM-DD')
        if (moment(startDate).isAfter(endDate)) {
          this.toastr.showError("Please Enter Valid Date")
          this.supplierDetailsSectionFor.get("reportParameters.reportToDate")?.reset()
          this.rendered.selectRootElement(`#${id}`)?.focus()
        }
      } 
  }

  getReport(print: boolean){
    
    if(this.supplierDetailsSectionFor.valid){
      if (this._service.printExcelChk(print, this.supplierDetailsSectionFor.get('exportType')?.value)) {
      this.loaderToggle = true;
      this.setReportParamters();
      this.commonReportService
        .getParameterizedReportWithCondition(this.supplierDetailsSectionFor.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.loaderToggle = false;
            let filename = this.commonReportService.getReportName();
            this._service.exportReport(print, res, this.supplierDetailsSectionFor.get('exportType')?.value, filename)
          },
          error: (err: any) => {
            this.loaderToggle = false;
            setTimeout(function() {
              document.getElementById("suppCode123")?.focus();
           }, 100);
          },
        });
      }
    }
    else{
      setTimeout(function() {
        document.getElementById("suppCode123")?.focus();
     }, 100);
    }
      
  } 

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }

  resetForm(){
    this.supplierDetailsSectionFor.reset({
      name: fileConstants.supplierDetailsReport,
      seqId: 3,
      isPrint: false,
      exportType: 'PDF',
      reportParameters:{
        printAdress: false
      }
    })
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
  }


}
