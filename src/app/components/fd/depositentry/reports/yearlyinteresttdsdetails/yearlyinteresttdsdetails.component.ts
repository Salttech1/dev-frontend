import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { take } from 'rxjs';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { fileConstants } from 'src/constants/fileconstants';
import * as constant from '../../../../../../constants/constant'
import { ModalService } from 'src/app/services/modalservice.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';

@Component({
  selector: 'app-yearlyinteresttdsdetails',
  templateUrl: './yearlyinteresttdsdetails.component.html',
  styleUrls: ['./yearlyinteresttdsdetails.component.css']
})
export class YearlyinteresttdsdetailsComponent implements OnInit {
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  deptDyanPop!: string;
  deptColumnHeader: any
  depositorTableData: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  accYear!: string
  @ViewChild(F1Component) comp!: F1Component
  constructor(private actionService: ActionservicesService, private dynapop: DynapopService, private tostr: ToasterapiService, private changeDetector: ChangeDetectorRef, private router: Router, private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private rendered: Renderer2, private modalService: ModalService) { }

  ngOnInit(): void {
    this.getCompanyList()
    this.accountingYearDate()
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  yearlyInterestDetailsTdsReportForm = new FormGroup({
    name: new FormControl(fileConstants.yearlyInterestDetails),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      CompanyName: new FormControl('', Validators.required),
      CoyName: new FormControl(),
      DepositorName: new FormControl(),
      Depositor: new FormControl('', Validators.required),
      accountingYear: new FormControl(this.accountingYearDate(), [Validators.required, Validators.minLength(8), Validators.pattern(/^-?(0|[1-9]\d*)?$/), yearRange()]),
      FromDate: new FormControl(),
      ToDate: new FormControl()
    })
  })


  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    this.yearlyInterestDetailsTdsReportForm.patchValue({
      reportParameters: {
        FromDate: `01-Apr-${this.yearlyInterestDetailsTdsReportForm.get("reportParameters.accountingYear")?.value?.slice(0, 4)}`,
        ToDate: `31-Mar-${this.yearlyInterestDetailsTdsReportForm.get("reportParameters.accountingYear")?.value?.slice(4, 8)}`
      }
    })
    this.actionService.commonFlagCheck(true, true, true, false, true, true, true, true, false, true, true)
    if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].get('CompanyName')?.value == '') {
      this.yearlyInterestDetailsTdsReportForm.patchValue({
        reportParameters: {
          CoyName: null
        }
      })
    }
    if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].get('Depositor')?.value == '') {
      this.yearlyInterestDetailsTdsReportForm.patchValue({
        reportParameters: {
          DepositorName: null
        }
      })
    }
  }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.yearlyInterestDetailsTdsReportForm.patchValue({
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

  updateListControl(val: any, formControl: any) {
    if (val !== undefined) {
      formControl.setValue(val[this.bringBackColumn])
    }
  }

  accountingYearDate() {
    var currentMonth = new Date().getMonth() + 1
    var currentYear = new Date().getFullYear()
    if (currentMonth >= 4 && currentMonth <= 12) {
      this.accYear = `${currentYear}${currentYear + 1}`
      return this.accYear
    }
    else if (currentMonth >= 1 && currentMonth <= 3) {
      this.accYear = `${currentYear - 1}${currentYear}`
      return this.accYear
    }
    return
  }

  limitInputLength(eventVal: any, event: KeyboardEvent) {
    var maxLength = 8
    if (eventVal.length > maxLength) {
      this.yearlyInterestDetailsTdsReportForm.patchValue({
        reportParameters: {
          accountingYear: eventVal.slice(0, maxLength)
        }
      })
    }

  }

  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }
  getReport(print: boolean) {
    if (this.yearlyInterestDetailsTdsReportForm.valid) {
      this.yearlyInterestDetailsTdsReportForm.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.yearlyInterestDetailsTdsReportForm.value).pipe(take(1)).subscribe({
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
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
      })
    }
    else {
      this.validationFields()
      this.yearlyInterestDetailsTdsReportForm.markAllAsTouched()
    }
  }

  print() {
    if (this.yearlyInterestDetailsTdsReportForm.valid) {
      this.yearlyInterestDetailsTdsReportForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.yearlyInterestDetailsTdsReportForm.value).pipe(take(1)).subscribe({
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
      })
    }
    else {
      this.validationFields()
      this.yearlyInterestDetailsTdsReportForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['CompanyName'].errors && this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['CompanyName'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "company code is Required", (document.getElementById('companyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['Depositor'].errors && this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['Depositor'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor Code is Required", (document.getElementById('depositorCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "accounting year is Required", this.rendered.selectRootElement("#accountingYear")?.focus(), "error")
    }
    else if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors && this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors?.['minlength']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "accounting year must be at least 8 characters long.", this.rendered.selectRootElement("#accountingYear")?.focus(), "error")
    }
    else if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors && this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors?.['pattern']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, " accounting year shoul be only numeric", this.rendered.selectRootElement("#accountingYear")?.focus(), "error")
    }
    else if (this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].controls['accountingYear'].errors?.['yearVal']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Accounting Year", this.rendered.selectRootElement("#accountingYear")?.focus(), "error")
    }
  }

  updateOnChangeCompanyList(event: any) {
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
        this.yearlyInterestDetailsTdsReportForm.patchValue({
          reportParameters: { CompanyName: '' }
        })
      }
      else {
        this.yearlyInterestDetailsTdsReportForm.patchValue({
          reportParameters: {
            CoyName: result[0][1].trim()
          }
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].get('CompanyName')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.yearlyInterestDetailsTdsReportForm.controls['reportParameters'].get('CompanyName')?.value}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
        this.depositorTableData = res.data
      })
  }

  updateDepositorOnChange(event: any) {
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
        this.yearlyInterestDetailsTdsReportForm.patchValue({
          reportParameters: { Depositor: '' }
        })
      }
      else {
        this.yearlyInterestDetailsTdsReportForm.patchValue({
          reportParameters: {
            DepositorName: result[0][1].trim()
          }
        })
      }
    }
  }
}

export function yearRange(): ValidatorFn {
  return (_control: AbstractControl): ValidationErrors | null => {
    let yearVal = _control.value
    let firstFourCharacter = yearVal.slice(0, 4)
    let secondFourCharacter = yearVal.slice(4, 8)
    if (secondFourCharacter > firstFourCharacter && secondFourCharacter - firstFourCharacter == 1) {
      return null
    }
    return { 'yearVal': true }

  };

}
