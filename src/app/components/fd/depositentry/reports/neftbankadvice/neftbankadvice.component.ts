import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fileConstants } from 'src/constants/fileconstants';
import { ReportsService } from 'src/app/services/fd/reports.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as moment from 'moment';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant'

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
  selector: 'app-neftbankadvice',
  templateUrl: './neftbankadvice.component.html',
  styleUrls: ['./neftbankadvice.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class NeftbankadviceComponent implements OnInit {
  constructor(private reportServices: ReportsService, private changeDetection: ChangeDetectorRef, private router: Router, private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private rendered: Renderer2, private modalService: ModalService) { }

  loaderToggle: boolean = false
  datePipe = new DatePipe('en-US')
  reportSelectedText: string = 'Advice'
  bankSelectedText: string = 'PUNB'
  fromDateField!: String
  toDateField!: String
  ngOnInit(): void {
    this.fetchFromAndToDate()
  }

  fetchFromAndToDate() {
    this.reportServices.getFromToDateNeftAdvice().pipe(take(1)).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.fromDateField = res.data?.fromDate
          this.toDateField = res.data?.toDate
          this.neftBankAdviceFormGroup.patchValue({
            reportParameters: {
              reportFromDate: this.getDate(res.data?.fromDate),
              reportToDate: this.getDate(res.data?.toDate)
            }
          })
        }
      }
    })
  }

  neftBankAdviceFormGroup = new FormGroup({
    name: new FormControl(fileConstants.neftBankAdviceOther),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      reportOptions: new FormControl('Advice', Validators.required),
      reportFromDate: new FormControl(new Date(), Validators.required),
      reportToDate: new FormControl(new Date(), Validators.required),
      reportLetterDate: new FormControl('', [Validators.required]),
      BankStr: new FormControl("='PUNB'", Validators.required),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      HeaderText1: new FormControl(),
      FromDt: new FormControl(),
      ToDt: new FormControl(),
      Fromdt: new FormControl(),
      Todt: new FormControl()
    },
      {
        validators: letterDateValidation('reportToDate', 'reportLetterDate')
      }
    )
  })

  optionSelect(bankOptionVal: any) {
    this.bankSelectedText = bankOptionVal.getAttribute('selection-opt')
  }
  reportOptionSelect(reportOptipnVal: any) {
    this.reportSelectedText = reportOptipnVal.getAttribute('selection-opt')
  }

  getDate(date: any): Date {
    let currentDate = new Date(`'${date?.split("/")[2]}-${date?.split("/")[1]}-${date?.split("/")[0]}'`)
    currentDate.setDate(date.split("/")[0])
    return currentDate
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  ngAfterContentChecked() {
    this.changeDetection.detectChanges()
    if (this.neftBankAdviceFormGroup.get('reportParameters.reportToDate')?.value == null || this.neftBankAdviceFormGroup.get('reportParameters.reportToDate')?.value == null) {
      this.neftBankAdviceFormGroup.patchValue({
        reportParameters: {
          reportLetterDate: null
        }
      })
    }
    if (this.reportSelectedText === 'Advice' && this.bankSelectedText === 'PUNB') {
      this.neftBankAdviceFormGroup.patchValue({
        name: fileConstants.neftBankAdvicePnb
      })
    }
    else if (this.reportSelectedText === 'Advice' && this.bankSelectedText === 'Others') {
      this.neftBankAdviceFormGroup.patchValue({
        name: fileConstants.neftBankAdviceOther
      })
    }
    else if (this.reportSelectedText === 'Letter') {
      this.neftBankAdviceFormGroup.patchValue({
        name: fileConstants.neftBankLetter
      })
    }
    this.neftBankAdviceFormGroup.patchValue({
      reportParameters: {
        FromDate: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportFromDate, 'dd/MM/yyyy'),
        FromDt: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportFromDate, 'dd/MM/yyyy'),
        Fromdt: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportFromDate, 'dd/MM/yyyy'),
        ToDate: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportToDate, 'dd/MM/yyyy'),
        ToDt: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportToDate, 'dd/MM/yyyy'),
        Todt: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportToDate, 'dd/MM/yyyy'),
        HeaderText1: this.datePipe.transform(this.neftBankAdviceFormGroup.value?.reportParameters?.reportLetterDate, 'dd/MM/yyyy')
      }
    })
  }

  getReport(print: boolean) {
    if (this.neftBankAdviceFormGroup.valid) {
      this.neftBankAdviceFormGroup.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.neftBankAdviceFormGroup.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if(res.type == 'application/json'){
            this.toastr.showError('No Records Found')
          }
          else{
          this.loaderToggle = false
          let pdf = new Blob([res], { type: "application/pdf" });
          let filename = this.commonReportsService.getReportName();
          if (print) {
            const blobUrl = URL.createObjectURL(pdf);
            const oWindow = window.open(blobUrl, '_blank');
            oWindow?.print();
          } else {
            fileSaver.saveAs(pdf, filename);
          }
          }
        }
        ,
        error: (err: any) => {
          this.loaderToggle=false
        },
        complete:()=>{
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validationFields()
      this.neftBankAdviceFormGroup.markAllAsTouched()
    }
  }

  print() {
    if (this.neftBankAdviceFormGroup.valid) {
      this.neftBankAdviceFormGroup.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.neftBankAdviceFormGroup.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.showSuccess(res.message)
          }
          else {
            this.toastr.showError(res.message)
          }
        },
        error:()=>{
          this.loaderToggle = false
        },
        complete:()=>{
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validationFields()
      this.neftBankAdviceFormGroup.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportFromDate'].errors && this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportFromDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#formDateField")?.focus(), "error")
    }
    else if (this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportToDate'].errors && this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "To Date is Required", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
    }
    else if (this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportLetterDate'].errors && this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportLetterDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Letter Date is Required", this.rendered.selectRootElement("#letterDateField")?.focus(), "error")
    }
    else if (this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportLetterDate'].errors && this.neftBankAdviceFormGroup.controls['reportParameters'].controls['reportLetterDate'].errors?.['letterDate']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Date", this.rendered.selectRootElement("#letterDateField")?.focus(), "error")
    }
  }

  validateInvalidFormat(event: any, id: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = ""
      this.rendered.selectRootElement(`#${id}`)?.focus()
    }
  }

}

export function letterDateValidation(toDateVal: string, letterDateVal: string): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let datePipe = new DatePipe('en-US')
    let letterDateField: any = _control.get(letterDateVal)?.value
    var toDateValField = datePipe.transform(_control.get(toDateVal)?.value, 'dd/MM/yyyy')
    let dateStrings: any = toDateValField?.split("/");
    var dateFormate: any, beforeThreeDays: any, afterThreeDays: any
    if (dateStrings != undefined) {
      dateFormate = new Date(dateStrings[2] + "-" + dateStrings[1] + "-" + dateStrings[0])
      dateFormate.setHours(0, 0, 0)
      beforeThreeDays = new Date(dateFormate.setDate(dateFormate.getDate() - 3))
      dateFormate.setDate(dateStrings[0])
      dateFormate.setHours(0, 0, 0)
      afterThreeDays = new Date(dateFormate.setDate(dateFormate.getDate() + 3))
    }
    var validationFlagChkVal = letterDateField >= beforeThreeDays && letterDateField <= afterThreeDays
    if (letterDateField != '' && letterDateField != null) {
      if (!validationFlagChkVal) {
        _control.get(letterDateVal)?.setErrors({ 'letterDate': true })
      }
      else {
        _control.get(letterDateVal)?.setErrors(null)
      }
    }
    return null

  };


}