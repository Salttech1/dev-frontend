import { DatePipe, DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, LOCALE_ID, OnInit, Renderer2,AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
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
  selector: 'app-detailsforit',
  templateUrl: './detailsforit.component.html',
  styleUrls: ['./detailsforit.component.css'],
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
export class DetailsforitComponent implements OnInit, AfterContentChecked {
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  deptDyanPop!: string;
  deptColumnHeader: any
  depositorTableData: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  @ViewChild(F1Component) comp!:F1Component
  constructor(private actionService: ActionservicesService, private dynapop: DynapopService, private dateAdapter: DateAdapter<Date>, private changeDetector: ChangeDetectorRef, private toastr: ToasterapiService, private commonReportsService: CommonReportsService, private router: Router, private modalService: ModalService, private rendered: Renderer2) {
    this.actionService.commonFlagCheck(true, true, true, true, true, true, true, true, false, true, true)
    //this.dateAdapter.setLocale('en-IN'); //dd/MM/yyyy
    this.actionService.commonFlagCheck(true, true, true, false, true, true, true, true, true, true, true)
  }

  ngOnInit(): void {
    this.getCompanyList()
  }

  ngAfterViewInit(){
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.detailsITEntryForm.patchValue({
      reportParameters:
      {
        Depositor: this.detailsITEntryForm.get("reportParameters.DepCode")?.value,
        CompanyName: this.detailsITEntryForm.get("reportParameters.CoyCode")?.value
      }
    })
    this.actionService.commonFlagCheck(true, true, true, false, true, true, true, true, false, true, true)
    if(this.detailsITEntryForm.controls['reportParameters']?.get('CoyCode')?.value == ''){
      this.detailsITEntryForm.patchValue({
        reportParameters:
        {
          CoyName: ''
        }
      })
    }
    if(this.detailsITEntryForm.controls['reportParameters']?.get('DepCode')?.value == ''){
      this.detailsITEntryForm.patchValue({
        reportParameters:
        {
          depositorName: ''
        }
      })
    }
    //this.dateValidation()
  }


  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }



  detailsITEntryForm = new FormGroup({
    name: new FormControl(),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      CoyCode: new FormControl('', Validators.required),
      CoyName: new FormControl(),
      DepCode: new FormControl('', Validators.required),
      Depositor: new FormControl(''),
      CompanyName: new FormControl(''),
      depositorName: new FormControl(),
      reportFromDate: new FormControl('', Validators.required),
      reportToDate: new FormControl('', Validators.required),
      reportOption: new FormControl('', Validators.required),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
    })
  })

  updateCalcs(event: any) {
    this.detailsITEntryForm.patchValue({
      reportParameters: {
        FromDate: moment(this.detailsITEntryForm.get("reportParameters.reportFromDate")?.value).format('DD/MM/YYYY'),
        ToDate: moment(this.detailsITEntryForm.get("reportParameters.reportToDate")?.value).format('DD/MM/YYYY'),
      }
    })
  }

  updateListControl(val: any, formControl: any) {
    if (val !== undefined) {
      formControl.setValue(val[this.bringBackColumn])
    }
  }

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.detailsITEntryForm.patchValue({
        reportParameters:
        {
          CoyName: compData[this.bringBackColumn],

        }
      })
      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {
          this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorTableData = res.data
        })
    }
  }

  optionSelect(event: any) {
    if (event.value == "depositDetails") {
      this.detailsITEntryForm.patchValue({ name: fileConstants.depositDetail })
    }
    else if (event.value == "interestDetils") {
      this.detailsITEntryForm.patchValue({ name: fileConstants.interestDetail })
    }
  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  dateValidation() {
    let startDate = moment(this.detailsITEntryForm.get("reportParameters.reportFromDate")?.value).format('YYYY-MM-DD')
    let endDate = moment(this.detailsITEntryForm.get("reportParameters.reportToDate")?.value).format('YYYY-MM-DD')
    if (moment(startDate).isAfter(endDate)) {
      this.toastr.showError("Please Enter Valid Date")
      this.detailsITEntryForm.get("reportParameters.reportToDate")?.reset()
    }
    // if (moment(this.detailsITEntryForm.get("reportParameters.reportFromDate")?.value).format('YYYY') == moment(this.detailsITEntryForm.get("reportParameters.reportToDate")?.value).format('YYYY')) {
    //   if (moment(this.detailsITEntryForm.get("reportParameters.reportToDate")?.value).format('MM') < moment(this.detailsITEntryForm.get("reportParameters.reportFromDate")?.value).format('MM')) {
    //     this.toastr.showError("Please Enter valid To Date")
    //     this.detailsITEntryForm.patchValue({
    //       reportParameters: {
    //         reportToDate: ''
    //       }
    //     })
    //   }
    // }
    // if (moment(this.detailsITEntryForm.get("reportParameters.reportFromDate")?.value).format('YYYY') > moment(this.detailsITEntryForm.get("reportParameters.reportToDate")?.value).format('YYYY')) {
    //   this.toastr.showError("Please select valid Year for From Date")
    //   this.detailsITEntryForm.patchValue({
    //     reportParameters: {
    //       reportFromDate: ''
    //     }
    //   })
    // }
  }
  getReport(print: boolean) {
    if (this.detailsITEntryForm.valid) {
      this.detailsITEntryForm.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.detailsITEntryForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
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
        ,
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete:()=>[
          this.loaderToggle = false
        ]
      })
    }
    else {
      this.validationFields()
      this.detailsITEntryForm.markAllAsTouched()
    }
  }

  print() {
    if (this.detailsITEntryForm.valid) {
      this.detailsITEntryForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.detailsITEntryForm.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.showSuccess(res.message)
          }
          else {
            this.toastr.showError(res.message)
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete:()=>{
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validationFields()
      this.detailsITEntryForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.detailsITEntryForm.controls['reportParameters'].controls['CoyCode'].errors && this.detailsITEntryForm.controls['reportParameters'].controls['CoyCode'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "company code is Required", (document.getElementById('coyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.detailsITEntryForm.controls['reportParameters'].controls['DepCode'].errors && this.detailsITEntryForm.controls['reportParameters'].controls['DepCode'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor Code is Required", (document.getElementById('depCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.detailsITEntryForm.controls['reportParameters'].controls['reportFromDate'].errors && this.detailsITEntryForm.controls['reportParameters'].controls['reportFromDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#formDateField")?.focus(), "error")
    }
    else if (this.detailsITEntryForm.controls['reportParameters'].controls['reportToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "To Date is Required", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
    }
    else if (this.detailsITEntryForm.controls['reportParameters'].controls['reportOption'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "report option is Required", "", "error")
    }
  }

  updateOnChangeCompanyList(event:any) {
    console.log("tabledata", this.tableData);
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (this.tableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.tableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.detailsITEntryForm.patchValue({
          reportParameters: { CoyCode: '' }
        })
      }
      else {
        this.detailsITEntryForm.patchValue({
          reportParameters: {
            CoyName: result[0][1].trim()
          }
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.detailsITEntryForm.controls['reportParameters'].get('CoyCode')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.detailsITEntryForm.controls['reportParameters'].get('CoyCode')?.value}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
        this.depositorTableData = res.data
      })
  }

  updateDepositorOnChange(event:any) {
    const result = this.depositorTableData.dataSet.filter((s: any, i: any) => {
      if (this.depositorTableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.depositorTableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.detailsITEntryForm.patchValue({
          reportParameters: { DepCode: '' }
        })
      }
      else {
        this.detailsITEntryForm.patchValue({
          reportParameters: {
            depositorName: result[0][1].trim()
          }
        })
      }
    }
    // for (let i = 0; i < this.depositorTableData.dataSet.length; i++) {
    //   if (this.depositorTableData.dataSet[i][0].startsWith(this.detailsITEntryForm?.value?.reportParameters?.DepCode)) {
    //     this.detailsITEntryForm.patchValue({
    //       reportParameters: {
    //         depositorName: this.depositorTableData.dataSet[i][1].trim()
    //       }
    //     })
    //   }
    // }
  }
}


