import { AfterContentChecked, Component, OnInit, Renderer2, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { fileConstants } from 'src/constants/fileconstants';
import { DatePipe } from '@angular/common';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ReportsService } from 'src/app/services/fd/reports.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
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
  selector: 'app-activedepositindividualwise',
  templateUrl: './activedepositindividualwise.component.html',
  styleUrls: ['./activedepositindividualwise.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      // useValue: 'en-GB' ,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
    //   { provide: LOCALE_ID, useValue: "en-US" }, //replace "en-US" with your locale
    //otherProviders...
  ]
})


export class ActivedepositindividualwiseComponent implements OnInit, AfterContentChecked {
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  deptDyanPop!: string;
  deptColumnHeader: any
  depositorTableData: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  @ViewChild(F1Component) comp!: F1Component;
  constructor(private dynapop: DynapopService, private actionService: ActionservicesService, private router: Router, private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private modalService: ModalService, private rendered: Renderer2, private changeDetectionRef: ChangeDetectorRef) { }


  pipe = new DatePipe("en-IN");
  activeDepositIndividualwiseReport = new FormGroup({
    name: new FormControl(fileConstants.activeDepositIndividual),
    isPrint: new FormControl(false),
    reportParameters: new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl(),
      Depositor: new FormControl('', Validators.required),
      DepositorName: new FormControl(),
      UptoDate: new FormControl(),
      activeUpToDate: new FormControl(new Date(), Validators.required),
      reportOption: new FormControl('activeDeposit', Validators.required)
    })
  })

  ngOnInit(): void {
    this.getCompanyList()
    this.actionService.commonFlagCheck(true, true, true, true, true, true, true, true, false, true, true)
  }

  ngAfterViewInit(): void {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(); //To add default focus on input field
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
      this.activeDepositIndividualwiseReport.patchValue({
        reportParameters:
        {
          CompanyName: compData[this.bringBackColumn]
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

  updateCalcs(event: any) {

  }

  optionSelect(event: any) {
    if (event.value == "activeDeposit") {
      this.activeDepositIndividualwiseReport.patchValue({ name: fileConstants.activeDepositIndividual })
    }
    else if (event.value == "activeDepositWithJointOwnerDetails") {
      this.activeDepositIndividualwiseReport.patchValue({ name: fileConstants.activeDepositJointOwner })
    }
  }
  updateLoaderFlag(event: any) {
    this.loaderToggle = event
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges()
    if (this.activeDepositIndividualwiseReport.get("reportParameters.reportOption")?.value == 'activeDeposit') {
      this.activeDepositIndividualwiseReport.patchValue({
        reportParameters: {
          UptoDate: this.pipe.transform(this.activeDepositIndividualwiseReport.get("reportParameters.activeUpToDate")?.value, 'dd/MM/yyyy')
        }
      })
    }
    else if (this.activeDepositIndividualwiseReport.get("reportParameters.reportOption")?.value == 'activeDepositWithJointOwnerDetails') {
      this.activeDepositIndividualwiseReport.patchValue({
        reportParameters: {
          UptoDate: this.pipe.transform(this.activeDepositIndividualwiseReport.get("reportParameters.activeUpToDate")?.value, 'yyyy-MM-dd')
        }
      })
    }
    if (this.activeDepositIndividualwiseReport?.controls['reportParameters']?.get("Depositor")?.value == '') {
      this.activeDepositIndividualwiseReport.patchValue({
        reportParameters: {
          DepositorName: ''
        }
      })
    }
    if (this.activeDepositIndividualwiseReport?.controls['reportParameters']?.get("CompanyCode")?.value == '') {
      this.activeDepositIndividualwiseReport.patchValue({
        reportParameters: {
          CompanyName: ''
        }
      })
    }
  }

  getReport(print: boolean) {
    if (this.activeDepositIndividualwiseReport.valid) {
      this.activeDepositIndividualwiseReport.value.isPrint = false
      this.loaderToggle = true
      this.commonReportsService.getParameterizedReport(this.activeDepositIndividualwiseReport.value).pipe(take(1)).subscribe({
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
      this.activeDepositIndividualwiseReport.markAllAsTouched()
    }
  }

  print() {
    if (this.activeDepositIndividualwiseReport.valid) {
      this.activeDepositIndividualwiseReport.value.isPrint = true
      this.loaderToggle = true
      this.commonReportsService.getParameterizedPrintReport(this.activeDepositIndividualwiseReport.value).pipe(take(1)).subscribe({
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
      this.activeDepositIndividualwiseReport.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationFields() {
    if (this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['CompanyCode'].errors && this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['CompanyCode'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "company code is Required", (document.getElementById('companyCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['Depositor'].errors && this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['Depositor'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor Code is Required", (document.getElementById('depositorCode')?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['activeUpToDate'].errors && this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['activeUpToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#asOnDate")?.focus(), "error")
    }
    else if (this.activeDepositIndividualwiseReport.controls['reportParameters'].controls['reportOption'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "report option is Required", "", "error")
    }
  }

  updateOnChangeCompanyList(event: any) {
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
        this.activeDepositIndividualwiseReport.patchValue({
          reportParameters: { CompanyCode: '' }
        })
      }
      else {
        this.activeDepositIndividualwiseReport.patchValue({
          reportParameters: {
            CompanyName: result[0][1].trim()
          }
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.activeDepositIndividualwiseReport.controls['reportParameters'].get('CompanyCode')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.activeDepositIndividualwiseReport.controls['reportParameters'].get('CompanyCode')?.value}'`)
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
        this.activeDepositIndividualwiseReport.patchValue({
          reportParameters: { Depositor: '' }
        })
      }
      else {
        this.activeDepositIndividualwiseReport.patchValue({
          reportParameters: {
            DepositorName: result[0][1].trim()
          }
        })
      }
    }
  }

}


