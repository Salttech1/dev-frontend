import { Component, OnInit, Renderer2 , ViewChild,AfterContentChecked,ChangeDetectorRef} from '@angular/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { fileConstants } from 'src/constants/fileconstants';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/services/modalservice.service';
import { take } from 'rxjs';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as constant from '../../../../../../constants/constant'
import * as fileSaver from 'file-saver';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';

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
  selector: 'app-listoftotalmonthwiserepayments',
  templateUrl: './listoftotalmonthwiserepayments.component.html',
  styleUrls: ['./listoftotalmonthwiserepayments.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class ListoftotalmonthwiserepaymentsComponent implements OnInit ,AfterContentChecked{

  isViewClicked: boolean = false;
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition="coy_fdyn='Y'";
  datePipe = new DatePipe('en-US');
  loaderToggle: boolean = false;

  @ViewChild(F1Component) comp!: F1Component;

  constructor(private dynapop: DynapopService, private rendered: Renderer2,
    private modalService: ModalService, private commonReportService: CommonReportsService,
    private toastr: ToasterapiService, private router: Router,private changeDetectioRef:ChangeDetectorRef, private _service: ServiceService) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.listOfMonthwiseRepaymentsForm.controls['reportParameters'].controls['companyName'].disable();

    this._service.pageData.subscribe({
      next: (val) => {
        this.listOfMonthwiseRepaymentsForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  listOfMonthwiseRepaymentsForm = new FormGroup({
    name: new FormControl(fileConstants.listOfMonthwiseRepayments),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    range: new FormGroup(
      {
        reportFromDate: new FormControl<Date | null>(null, Validators.required),
        reportToDate: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
    reportParameters: new FormGroup({
      companyName: new FormControl(''),
      TxtCoyCode: new FormControl('', Validators.required),
      TxtDtDepUptoDate: new FormControl('',Validators.required),
      TxtDtDepFrmDate: new FormControl('', Validators.required),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      h1: new FormControl(),
      h2: new FormControl(),
      formname: new FormControl('')
    }
    )
  })

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement).focus();
  }

  ngAfterContentChecked(){
    this.changeDetectioRef.detectChanges()
    if(!this.listOfMonthwiseRepaymentsForm.controls['reportParameters'].get('TxtCoyCode')?.value){
      this.listOfMonthwiseRepaymentsForm.patchValue({
        reportParameters:{
          companyName:''
        }
      })
    }
  }

  getReport(print: boolean){
    if(this.validateFields()){
      this.setReportFormulaFields();
      this.loaderToggle = true;
      this.commonReportService.getTtxParameterizedReport(this.listOfMonthwiseRepaymentsForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.loaderToggle = false
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
          this.loaderToggle = false
         },
        complete: () => {
          this.loaderToggle = false
        }
      }
      )}
  }

  print(){
    if (this.validateFields()) {
      this.setReportFormulaFields();
      this.listOfMonthwiseRepaymentsForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportService.getTtxParameterizedPrintReport(this.listOfMonthwiseRepaymentsForm.value).pipe(take(1)).subscribe({
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
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete: () => {
          this.loaderToggle = false
        }
      })
    }
  }

  
  setCompanyName(){
    for( let i =0 ; i< this.compData.dataSet.length ; i++){
      if(this.compData.dataSet[i][0].startsWith(this.listOfMonthwiseRepaymentsForm?.value.reportParameters?.TxtCoyCode)){
       this.listOfMonthwiseRepaymentsForm.patchValue({
        reportParameters: {
          companyName: this.compData.dataSet[i][1].trim()
        }
       })
      }
   }
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  setReportFormulaFields(){
    this.listOfMonthwiseRepaymentsForm.patchValue({
      reportParameters: {
        TxtDtDepFrmDate: this.datePipe.transform(this.listOfMonthwiseRepaymentsForm?.controls['range'].get('reportFromDate')?.value, 'dd/MM/yyyy'),
        TxtDtDepUptoDate: this.datePipe.transform(this.listOfMonthwiseRepaymentsForm?.controls['range'].get('reportToDate')?.value, 'dd/MM/yyyy'),
        h2: "'" + "List of Total Monthwise Repayments" + "'",
        h1: `'${this.listOfMonthwiseRepaymentsForm.controls['reportParameters']?.get('companyName')?.value}'`,
        FromDate: "'" + this.datePipe.transform(this.listOfMonthwiseRepaymentsForm?.controls['range'].get('reportFromDate')?.value, 'dd/MM/yyyy') + "'",
        ToDate: "'" + this.datePipe.transform(this.listOfMonthwiseRepaymentsForm?.controls['range'].get('reportToDate')?.value, 'dd/MM/yyyy') + "'"
      }
    })
    
  }
  updateCompanyList(compData: any){
    this.listOfMonthwiseRepaymentsForm.patchValue({
      reportParameters:{
        companyName:compData[this.bringBackColumn].trim()
      } 
    })
  }
  getCompanyList(){
    this.dynapop.getDynaPopListObj("COMPANY","coy_fdyn='Y'").subscribe((res:any)=>{
      this.compHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  validateFields(){

    if (this.listOfMonthwiseRepaymentsForm.controls['reportParameters'].controls['TxtCoyCode'].errors && this.listOfMonthwiseRepaymentsForm.controls['reportParameters'].controls['TxtCoyCode'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Company code cannot be left blank", this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "error")
      return false;
    }
    else if( this.listOfMonthwiseRepaymentsForm.controls['range'].controls['reportFromDate'].errors && this.listOfMonthwiseRepaymentsForm.controls['range'].controls['reportFromDate'].errors?.['required']){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid date", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
      return false;
    }
    else  if (this.listOfMonthwiseRepaymentsForm.controls['range'].controls['reportToDate'].errors && this.listOfMonthwiseRepaymentsForm.controls['range'].controls['reportToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid date", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
      return false;
    }
    
    else{
      return true;
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }
}
