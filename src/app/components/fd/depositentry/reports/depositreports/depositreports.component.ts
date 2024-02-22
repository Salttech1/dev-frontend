import { Component, OnInit, AfterContentChecked, ChangeDetectorRef, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';
import { fileConstants } from 'src/constants/fileconstants';
import { DatePipe } from '@angular/common';
import { CommonReportsService } from 'src/app/services/reports.service';
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant'
import { ServiceService } from 'src/app/services/service.service';
import { ReportsService } from 'src/app/services/fd/reports.service';

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
  selector: 'app-depositreports',
  templateUrl: './depositreports.component.html',
  styleUrls: ['./depositreports.component.css'],
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
export class DepositreportsComponent implements OnInit {
  bringBackColumn!: number;
  tableData: any
  columnHeader: any
  coy_condition = "coy_fdyn='Y'"
  loaderToggle: boolean = false
  datePipe = new DatePipe('en-US')
  depositReportsH2Arr: any = {
    'freshDeposit': 'Fresh Deposit received for the period ',
    'renewedDeposit': 'Deposit renewed for the period ',
    'activeDeposit': 'Active Deposit for the period ending ',
    'activeDepositPeriodWise': 'Active Deposit (period wise) for the period ending ',
    'activeDepositIntRateWise': 'Active Deposit (Int. Rate wise) for the period ending',
    'rapidActual': 'Deposit repaid (Actual) for the period ',
    'rapidRenewal': 'Deposit repaid (Renewal) for the period ',
    'maturityDeposit': 'Deposit Maturing for the period ',
    'activeDepositNonStaff': 'Active Deposit(Non Staff) for the period ending ',
    'activeDepositStaff': 'Active Deposit(Staff) for the period ending ',
    'maturityDepositNonStaff': 'Deposit Maturing(Non Staff) for the period ',
    'maturityDepositStaff': 'Deposit Maturing(Staff) for the period '
  }
  depositReportsSeqId: any = {
    'freshDeposit': 1,
    'renewedDeposit': 2,
    'activeDeposit': 3,
    'activeDepositPeriodWise': 1,
    'activeDepositIntRateWise': 2,
    'rapidActual': 4,
    'rapidRenewal': 5,
    'maturityDeposit': 6,
    'activeDepositNonStaff': 7,
    'activeDepositStaff': 8,
    'maturityDepositNonStaff': 9,
    'maturityDepositStaff': 10
  }

  @ViewChild(F1Component) comp!: F1Component
  constructor(private dynapop: DynapopService, private _service: ServiceService, private toastr: ToasterapiService, private router: Router, private changeDetection: ChangeDetectorRef, private rendered: Renderer2, private commonReportService: CommonReportsService, private modalService: ModalService,
    private reportService: ReportsService) { }

  ngOnInit(): void {
    this.getCompanyList();

    this._service.pageData.subscribe({
      next: (val) => {
        this.depositReportsForm.patchValue({
          reportParameters: {
            formname: `'${val.formName}'`,
          },
        });
      },
    });
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  depositReportsForm = new FormGroup({
    name: new FormControl(fileConstants.depositReportWithOutGrp),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    range: new FormGroup(
      {
        reportFromDate: new FormControl<Date | null>(null, Validators.required),
        reportToDate: new FormControl<Date | null>(null, Validators.required),
      },
      Validators.required
    ),
    exportType: new FormControl('PDF'),
    reportParameters: new FormGroup({
      txtCompanyCd: new FormControl('', Validators.required),
      companyName: new FormControl(),
      reportOption: new FormControl('freshDeposit'),
      h1: new FormControl(),
      h2: new FormControl(),
      h3: new FormControl(),
      exportType: new FormControl(''),
      DtpFromDate: new FormControl(),
      DtpToDate: new FormControl(),
      formname: new FormControl(''),
      ChkGroup1: new FormControl(""),
      ChkGroup2: new FormControl("")
    }
    )
  })

  setH3() {
    if (this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDeposit' || this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositPeriodWise' || this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositIntRateWise' || this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositNonStaff' || this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositStaff') {
      this.depositReportsForm.patchValue({
        reportParameters: {
          ...this.depositReportsForm.controls['range'].value,
          h3: `'${this.datePipe.transform(this.depositReportsForm?.controls['range'].get('reportToDate')?.value, 'dd/MM/yyyy')}'`
        }
      })
    }
    else {
      this.depositReportsForm.patchValue({
        reportParameters: {
          h3: `'${this.datePipe.transform(this.depositReportsForm?.controls['range'].get('reportFromDate')?.value, 'dd/MM/yyyy')}-${this.datePipe.transform(this.depositReportsForm?.controls['range'].get('reportToDate')?.value, 'dd/MM/yyyy')}'`
        }
      })
    }
  }

  setFromToDatePayload() {
    this.depositReportsForm.patchValue({
      reportParameters: {
        DtpFromDate: this.datePipe.transform(this.depositReportsForm?.controls['range'].get('reportFromDate')?.value, 'dd/MM/yyyy'),
        DtpToDate: this.datePipe.transform(this.depositReportsForm?.controls['range'].get('reportToDate')?.value, 'dd/MM/yyyy')
      }
    })
  }

  resetField() {
    if (this.depositReportsForm.controls['reportParameters']?.get('txtCompanyCd')?.value == '') {
      this.depositReportsForm.patchValue({
        reportParameters: {
          companyName: ''
        }
      })
    }
  }
  setSeqId() {
    this.depositReportsForm.patchValue({
      seqId: this.depositReportsSeqId[`${this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value}`]
    })
  }

  ngAfterContentChecked() {
    this.changeDetection.detectChanges()
    this.setH3()
    this.setFromToDatePayload()
    this.resetField()
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
      this.depositReportsForm.patchValue({
        reportParameters:
        {
          companyName: compData[this.bringBackColumn],
        }
      })
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
        this.depositReportsForm.patchValue({
          reportParameters: { txtCompanyCd: '' }
        })
      }
      else {
        this.depositReportsForm.patchValue({
          reportParameters: {
            companyName: result[0][1].trim()
          }
        })
      }
    }
    if (event?.target?.value == '') {
      this.rendered.selectRootElement(this.comp?.fo1?.nativeElement)?.focus()
    }
  }
  fileReportOnChange() {
    if (this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositPeriodWise' || this.depositReportsForm?.controls['reportParameters']?.get('reportOption')?.value == 'activeDepositIntRateWise') {
      this.depositReportsForm.patchValue({ name: fileConstants.depositReports })
    }
    else {
      this.depositReportsForm.patchValue({ name: fileConstants.depositReportWithOutGrp })
    }
  }

  setH2AndH1() {
    this.depositReportsForm.patchValue({
      reportParameters: {
        h2: `'${this.depositReportsH2Arr[`${this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value}`]}'`,
        h1: `'${this.depositReportsForm.controls['reportParameters']?.get('companyName')?.value}'`
      }
    })
  }

  resetFieldAction() {
    setTimeout(() => {
      this.depositReportsForm.controls['reportParameters'].controls['txtCompanyCd']?.reset()
      this.depositReportsForm.controls['reportParameters'].controls['companyName']?.reset()
      this.depositReportsForm.controls['range'].controls['reportFromDate']?.reset()
      this.depositReportsForm.controls['range'].controls['reportToDate']?.reset()
      this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus()
    }, 50)
  }

  chkGroupSet() {
    // (this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value == 'activeDepositPeriodWise') && (
    //   this.depositReportsForm.patchValue({
    //     reportParameters:{
    //       ChkGroup1:"",
    //       ChkGroup2:"",
    //     }
    //   })
    // ),
    (this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value !== 'activeDepositIntRateWise') && (
      this.depositReportsForm.patchValue({
        reportParameters: {
          ChkGroup1: "",
          ChkGroup2: "",
        }
      })
    ),
      (this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value == 'activeDepositIntRateWise') && (
        this.depositReportsForm.patchValue({
          reportParameters: {
            ChkGroup1: "'Y'",
            ChkGroup2: "'N'",
          }
        })
      )
  }

  

  getReport(print: boolean) {
    this.fileReportOnChange()
    this.setH2AndH1()
    this.setSeqId()
    this.chkGroupSet()
    if (this.depositReportsForm?.valid) {
      if (
        this._service.printExcelChk(
          print,
          this.depositReportsForm.get('exportType')?.value!
        )
      )
      {
        this.depositReportsForm.value.isPrint = false
        this.loaderToggle = true
        if (this.depositReportsForm.controls['reportParameters'].get('reportOption')?.value == 'activeDepositPeriodWise') {
          this.depositReportsForm.controls.reportParameters.controls.exportType.patchValue(this.depositReportsForm.get('exportType')
          ?.value!)
          this.reportService.generateFdActiveDepositReport(this.depositReportsForm.value.reportParameters).subscribe({
            next: (res: any) => {
              if (res?.type == 'application/json') {
                this.toastr.showError('No Records Found')
              }
              else {
                console.log("res chk", res?.type == 'application/json');
                let pdf = new Blob([res], { type: "application/pdf" });
                let filename = this.commonReportService.getReportName();
                if (print) {
                  const blobUrl = URL.createObjectURL(pdf);
                  const oWindow = window.open(blobUrl, '_blank');
                  oWindow?.print();
                } else {
                  //fileSaver.saveAs(pdf, filename);
                  this._service.exportReport(
                    print,
                    res,
                    this.depositReportsForm.get('exportType')
                      ?.value!,
                    filename
                  );
                }
              }
            },
            error: (err: any) => {
              this.loaderToggle = false
              console.log(err, "err");
  
              if (err.status === 404) {
                this.resetFieldAction()
              }
            },
            complete: () => {
              this.loaderToggle = false
            }
          })
        }
        else {
          this.commonReportService.getTtxParameterizedReport(this.depositReportsForm?.value).subscribe({
            next: (res: any) => {
              if (res?.type == 'application/json') {
                this.toastr.showError('No Records Found')
              }
              else {
                console.log("res chk", res?.type == 'application/json');
                let pdf = new Blob([res], { type: "application/pdf" });
                let filename = this.commonReportService.getReportName();
                if (print) {
                  const blobUrl = URL.createObjectURL(pdf);
                  const oWindow = window.open(blobUrl, '_blank');
                  oWindow?.print();
                } else {
                  //fileSaver.saveAs(pdf, filename);
                  this._service.exportReport(
                    print,
                    res,
                    this.depositReportsForm.get('exportType')
                      ?.value!,
                    filename
                  );
                }
              }
            },
            error: (err: any) => {
              this.loaderToggle = false
              console.log(err, "err");
  
              if (err.status === 404) {
                this.resetFieldAction()
              }
            },
            complete: () => {
              this.loaderToggle = false
            }
          })
        }
      }
      console.log("depositReportsForm", this.depositReportsForm?.value);
    }
    else {
      this.validationField()
      this.depositReportsForm.markAllAsTouched()
    }
  }
  print() {
    this.fileReportOnChange()
    this.setH2AndH1()
    this.setSeqId()
    if (this.depositReportsForm?.valid) {
      this.depositReportsForm.value.isPrint = true
      this.loaderToggle = true
      this.commonReportService.getTtxParameterizedPrintReport(this.depositReportsForm?.value).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.loaderToggle = false
            this.toastr.showSuccess(res.message)
          }
          else {
            this.loaderToggle = false
            this.toastr.showError(res.message)
            this.resetFieldAction()
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
          if (err.status === 404) {
            this.resetFieldAction()
          }
        },
        complete: () => {
          this.loaderToggle = false
        }
      })
    }
    else {
      this.validationField()
      this.depositReportsForm.markAllAsTouched()
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }

  validationField() {
    if (this.depositReportsForm.controls['reportParameters'].controls['txtCompanyCd'].errors && this.depositReportsForm.controls['reportParameters'].controls['txtCompanyCd'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "companyCode is Required", this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "error")
    }
    // else if (this.depositReportsForm.controls['range'].controls['reportFromDate'].errors && this.depositReportsForm.controls['range'].controls['reportFromDate'].errors?.['required']) {
    //   this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "From Date is Required", this.rendered.selectRootElement("#fromDateField")?.focus(), "error")
    // }
    else if (this.depositReportsForm.controls['range'].controls['reportToDate'].errors && this.depositReportsForm.controls['range'].controls['reportToDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Date is Required", this.rendered.selectRootElement("#toDateField")?.focus(), "error")
    }

  }

}

export function dateValidationCompare(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromDt = new Date(control.get('reportFromDate')?.value)
    const toDt = new Date(control.get('reportToDate')?.value)
    if (fromDt < toDt) {
      control.get('reportParameters.reportToDate')?.setErrors({ 'toDate': true })
    }
    return null
  }

}