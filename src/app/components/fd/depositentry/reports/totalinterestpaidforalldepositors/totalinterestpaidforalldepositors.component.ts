import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}
@Component({
  selector: 'app-totalinterestpaidforalldepositors',
  templateUrl: './totalinterestpaidforalldepositors.component.html',
  styleUrls: ['./totalinterestpaidforalldepositors.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})

export class TotalinterestpaidforalldepositorsComponent implements OnInit {

  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition="coy_fdyn='Y'";
  datePipe = new DatePipe('en-US');
  loaderToggle: boolean = false;

  @ViewChild(F1Component) comp!: F1Component;
  constructor(private dynapop: DynapopService, private changeDetectorRef: ChangeDetectorRef,
    private rendered: Renderer2, private reportService: CommonReportsService,
    private toastr: ToasterapiService, private modalService: ModalService, private router: Router) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['coyName'].disable()
  }

 
  getReport(print: boolean){
    if(this.validationFields()){
      this.loaderToggle = true;
    this.reportService.getParameterizedReport(this.totalInterestDepositorSectionForm.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        let pdfFile = new Blob([res], { type: "application/pdf" });
        let fileName = this.reportService.getReportName();
        if (print) {
          const blobUrl = URL.createObjectURL(pdfFile);
          const oWindow = window.open(blobUrl, '_blank');
          oWindow?.print();
        } else {
          fileSaver.saveAs(pdfFile, fileName);
        }
      },
      error: (err: any) => {
        this.loaderToggle = false
      },
      complete: () => {
        this.loaderToggle = false
      }
    }

    )
    }}


  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }



  totalInterestDepositorSectionForm = new FormGroup({
    name: new FormControl(fileConstants.totalInterestPaidForAllDepositors),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      reportFromDate: new FormControl('',Validators.required),
      reportToDate: new FormControl('',Validators.required),
      CompanyName : new FormControl('', Validators.required),
      coyName: new FormControl(''),
      FromDate: new FormControl(),
      ToDate: new FormControl()
    })
   
  })

  ngAfterContentChecked() {
    this.changeDetectorRef.detectChanges();
    this.setFromAndToDate();
    if(!this.totalInterestDepositorSectionForm?.controls['reportParameters']?.get('CompanyName')?.value){
      this.totalInterestDepositorSectionForm.patchValue({
        reportParameters:{
          coyName:''
        }
      })
    }
  }

  setFromAndToDate(){
    if(this.totalInterestDepositorSectionForm?.value?.reportParameters?.reportFromDate != '' 
      && this.totalInterestDepositorSectionForm?.value?.reportParameters?.reportToDate != '' ){
      this.totalInterestDepositorSectionForm.patchValue({
        reportParameters: {
          FromDate : this.getFormattedDate(this.totalInterestDepositorSectionForm?.value?.reportParameters?.reportFromDate),
          ToDate : this.getFormattedDate(this.totalInterestDepositorSectionForm?.value?.reportParameters?.reportToDate)
        }
      })
    }
  }

  getCompanyList(){
    this.dynapop.getDynaPopListObj("COMPANY","coy_fdyn='Y'").subscribe((res:any)=>{
      this.compHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = ""
      this.rendered.selectRootElement(`#${id}`)?.focus()
    }
    else{
      let startDate = moment(this.totalInterestDepositorSectionForm.get("reportParameters.reportFromDate")?.value).format('YYYY-MM-DD')
      let endDate = moment(this.totalInterestDepositorSectionForm.get("reportParameters.reportToDate")?.value).format('YYYY-MM-DD')
      if (moment(startDate).isAfter(endDate)) {
        this.toastr.showError("Please Enter Valid Date")
        this.totalInterestDepositorSectionForm.get("reportParameters.reportToDate")?.reset()
        this.rendered.selectRootElement(`#${id}`)?.focus()
      }
    }
  }

  getFormattedDate(date: any){
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  
  updateCompanyList(compData: any){
    this.totalInterestDepositorSectionForm.patchValue({
      reportParameters: {
        coyName:compData[this.bringBackColumn].trim()
      }
      })
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  print() {
    if (this.totalInterestDepositorSectionForm.valid) {
      this.totalInterestDepositorSectionForm.value.isPrint = true
      this.loaderToggle = true
      this.reportService.getParameterizedPrintReport(this.totalInterestDepositorSectionForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loaderToggle = false
            this.toastr.showSuccess(res.message)
          }
          else {
            this.loaderToggle = false
            this.toastr.showError(res.message)
          }
        },
        error:()=>{
          this.loaderToggle=false
        }
      })
    }
    else {
      this.validationFields()
    }
  }

  setCompanyName(){
    for( let i =0 ; i< this.compData.dataSet.length ; i++){
      if(this.compData.dataSet[i][0].startsWith(this.totalInterestDepositorSectionForm?.value.reportParameters?.CompanyName)){
       this.totalInterestDepositorSectionForm.patchValue({
        reportParameters: {
          coyName: this.compData.dataSet[i][1].trim()
        }
       })
      }
   }
  }

  validationFields(){
     if (this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['CompanyName'].errors && this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['CompanyName'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Company Name cannot be left blank", this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus(), "error")
      return false
    }
    else if (this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportFromDate'].errors && this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportFromDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#formDateField")?.focus(), "error")
      return false;
    }
    else if (this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportToDate'].errors && this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "To Date is Required", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
      return false;
    }
    else if (this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportFromDate'].value! > this.totalInterestDepositorSectionForm.controls['reportParameters'].controls['reportToDate'].value!) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date should be less then To Date", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
      this.totalInterestDepositorSectionForm.patchValue({
        reportParameters: {
          reportToDate: ""
        }
      })
      return false;
    }
    else{
      return true;
    }
   
  }
}
