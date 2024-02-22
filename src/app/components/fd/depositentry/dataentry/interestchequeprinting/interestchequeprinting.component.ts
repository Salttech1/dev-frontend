import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fileConstants } from 'src/constants/fileconstants';
import { DynapopService } from 'src/app/services/dynapop.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant'
import { take } from 'rxjs';
import * as fileSaver from 'file-saver';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import * as moment from 'moment';
import { DepositEntryService } from 'src/app/services/fd/deposit-entry.service';

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
};
@Component({
  selector: 'app-interestchequeprinting',
  templateUrl: './interestchequeprinting.component.html',
  styleUrls: ['./interestchequeprinting.component.css'],
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
export class InterestchequeprintingComponent implements OnInit {

  constructor(private dynapop: DynapopService, private renderer: Renderer2, private router: Router, private modalService: ModalService,
    private commonReportsService: CommonReportsService, private toastr: ToasterapiService, private depositService: DepositEntryService,
    private changeDetection: ChangeDetectorRef) { 
      (window as any).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';
    }
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  depositorFromTableData: any;
  depositorFromColumnHeader!: any[]
  depositorUpToTableData: any;
  depositorUpToColumnHeader!: any
  coy_condition = "coy_fdyn='Y'"
  deptDyanPop!: string;
  disabledFlagRetrieve: boolean = false
  disabledFlagReset: boolean = false
  disabledFlagExit: boolean = false
  loaderToggle: boolean = false
  disabledFlagcfioloPrint: boolean = true
  disabledFlagPrint: boolean = true
  isExitClickAfterReterieveClick: boolean = false
  isPdfViewerHide: boolean = true
  src = ''
  page: number = 1;
  totalPages: number = 0;
  foliSeqId!: string
  fetchInterestChqPrintApi = 'interest-cheque-printing/fetch-interest-cheque-printing'
  killApiUrl = 'interest-cheque-printing/truncate-temp-table'
  @ViewChild(F1Component) comp!: F1Component
  pdfFileBlob:any
  reportPayload = {
    "name": "IntCheqPrintRpt.rpt",
    "seqId": 1,
    "reportParameters": {
      "coy": "UNIQ",
      "sessionId": "452078",
      "fromDate": "2022/04/01",
      "toDate1": "2022/04/30",
      "toDate": "30-04-2022"
    },
    "isPrint": false
  }
  interestChequePrintingFormGroup = new FormGroup({
    name: new FormControl(fileConstants.InterestChequePrint),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    reportParameters: new FormGroup({
      coy: new FormControl('', Validators.required),
      companyName: new FormControl(),
      depFrom: new FormControl('', Validators.required),
      depTo: new FormControl('', Validators.required),
      startChequeNo: new FormControl('', [Validators.required, Validators.minLength(6)]),
      chequeDate: new FormControl('', Validators.required),
      testPrintOption: new FormControl('N', Validators.required),
      h1: new FormControl(),
      intUpToDate: new FormControl(),
      sessionId: new FormControl(),
      intUpToDatePlusOneMonth: new FormControl()
    })
  })


  ngOnInit(): void {
    this.getCompanyList()
  }
  ngAfterViewInit() {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus()
  }

  ngAfterContentChecked() {
    this.changeDetection.detectChanges()
    if (this.interestChequePrintingFormGroup.controls['reportParameters'].get('coy')?.value == '') {
      this.interestChequePrintingFormGroup.patchValue({
        reportParameters: {
          companyName: ''
        }
      })
    }
  }

  updateCompanyList(compData: any) {
    if (compData !== undefined) {
      this.interestChequePrintingFormGroup.patchValue({
        reportParameters: {
          companyName: compData[this.bringBackColumn],

        }
      })

      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {
          this.depositorFromColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorUpToColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorFromTableData = res.data,
            this.depositorUpToTableData = res.data
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
        this.interestChequePrintingFormGroup.patchValue({
          reportParameters: { coy: '' }
        })
      }
      else {
        this.interestChequePrintingFormGroup.patchValue({
          reportParameters: {
            companyName: result[0][1].trim()
          }
        })
      }
    }

  }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }



  retrieve() {
    let reterievePayLoad = {
      chequeDate: moment(this.interestChequePrintingFormGroup.controls['reportParameters'].get('chequeDate')?.value).format('DD/MM/YYYY'),
      chequeNum: this.interestChequePrintingFormGroup.controls['reportParameters'].get('startChequeNo')?.value,
      companyCode: this.interestChequePrintingFormGroup.controls['reportParameters'].get('coy')?.value,
      depFrom: this.interestChequePrintingFormGroup.controls['reportParameters'].get('depFrom')?.value,
      depTo: this.interestChequePrintingFormGroup.controls['reportParameters'].get('depTo')?.value,
      isTestPrint: false,
      userId: sessionStorage.getItem('userName')
    }
    if (this.interestChequePrintingFormGroup.controls['reportParameters'].get('testPrintOption')?.value == 'Y') {
      reterievePayLoad.isTestPrint = true
    }
    else {
      reterievePayLoad.isTestPrint = false
    }
    console.log(reterievePayLoad);
    if (this.interestChequePrintingFormGroup?.valid) {
      this.isExitClickAfterReterieveClick = true
      this.loaderToggle = true
      let resData: any
      this.depositService.fetchInterestChequePrinting(this.fetchInterestChqPrintApi, reterievePayLoad).pipe(take(1)).subscribe({
        next: (res: any) => {
          console.log("fetc resposne", res);
          resData = res
        },
        error: (err: any) => {
          this.loaderToggle = false
        },
        complete: () => {
          if (resData.status) {
            this.foliSeqId = resData.data.folioReportSeqId
            this.interestChequePrintingFormGroup.patchValue({
              reportParameters: {
                sessionId: `${resData.data.sessionId}`,
                intUpToDate: `${resData.data.intUpToDate}`,
                intUpToDatePlusOneMonth: `${resData.data.intUpToDatePlusOneMonth}`
              }
            })
            this.viewReport()
          }
          else {
            this.loaderToggle = false
            this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, resData.message, this.renderer.selectRootElement("#chqDataField")?.focus(), "error")
          }
          console.log("--------->", this.interestChequePrintingFormGroup.value);

        }
      })

    }
    else {
      this.validationField()
      this.interestChequePrintingFormGroup.markAllAsTouched()
      this.enableDisabledActionField(false, false, true, true, false)
    }
  }

  reset() {
    this.interestChequePrintingFormGroup.reset()
    this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus()
    this.interestChequePrintingFormGroup.patchValue({
      name:fileConstants.InterestChequePrint,
      isPrint:false,
      seqId:1,
      reportParameters: {
        testPrintOption: 'N'
      }
    })
    this.isExitClickAfterReterieveClick = false
    this.enableDisabledActionField(false, false, true, true, false)
  }
  handleExit() {
    if (this.isExitClickAfterReterieveClick) {
      this.loaderToggle = true
      this.depositService.exitKillInterestChequePrinting(this.killApiUrl).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.interestChequePrintingFormGroup.reset()
            this.interestChequePrintingFormGroup.patchValue({
              name:fileConstants.InterestChequePrint,
              isPrint:false,
              seqId:1,
              reportParameters: {
                testPrintOption: 'N'
              }
            })
            this.isPdfViewerHide = true
            this.isExitClickAfterReterieveClick = false
            setTimeout(() => {
              this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus()
            }, 50)
            this.disabledFlagcfioloPrint = false
            this.enableDisabledActionField(false, false, true, true, false)
            this.interestChequePrintingFormGroup.patchValue({
              reportParameters: {
                testPrintOption: 'N'
              }
            })
            this.page=1
          }
        },
        error: (err: any) => {
          this.loaderToggle= false
          this.toastr.showError('Something went wrong')
        },
        complete: () => {
          this.loaderToggle = false
        }
      })
    }
    else {
      this.router.navigate(['/dashboard'])
    }
  }
  enableDisabledActionField(isReterieveFlag: any, isResetFlag: any, isCfioloPrint: any, isPrint: any, isExit: any,) {
    this.disabledFlagRetrieve = isReterieveFlag,
      this.disabledFlagReset = isResetFlag,
      this.disabledFlagcfioloPrint = isCfioloPrint,
      this.disabledFlagPrint = isPrint,
      this.disabledFlagExit = isExit
  }
  cfioloPrint() {
    this.interestChequePrintingFormGroup.patchValue({
      name: fileConstants.InterestChequeFolioPrint,
      isPrint: false,
      reportParameters: {
        h1: `'${this.interestChequePrintingFormGroup.controls['reportParameters'].get('companyName')?.value}'`
      }
    })
    this.commonReportsService.getTtxParameterizedReport(this.interestChequePrintingFormGroup?.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        if (res?.type == 'application/json') {
          this.toastr.showError("No Records Found")
        }
        else {
          let pdf = new Blob([res], { type: "application/pdf" });
          //let filename = this.commonReportsService.getReportName();
          const blobUrl = URL.createObjectURL(pdf);
          const oWindow = window.open(blobUrl, '_blank');
          oWindow?.print();
         // fileSaver.saveAs(pdf, filename);
          this.disabledFlagcfioloPrint = true
        }
      },
      error: (err: any) => {
        this.loaderToggle = false
        if (err.status === 404) {
          this.toastr.showError("No Records Found")
        }
        else {
          this.toastr.showError("something went wrong")
        }
      },
      complete: () => {
        this.loaderToggle = false
      }
    })


  }
  print() {
    const blobUrl = URL.createObjectURL(this.pdfFileBlob);
    const oWindow = window.open(blobUrl, '_blank');
    oWindow?.print();
       
  }

  validationField() {
    if (this.interestChequePrintingFormGroup.controls['reportParameters'].controls['coy'].errors && this.interestChequePrintingFormGroup.controls['reportParameters'].controls['coy'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Company Code", this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "error")
    }
    else if (this.interestChequePrintingFormGroup.controls['reportParameters'].controls['depFrom'].errors && this.interestChequePrintingFormGroup.controls['reportParameters'].controls['depFrom'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor From Code is required", (document.getElementById("depositorFromCode")?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.interestChequePrintingFormGroup.controls['reportParameters'].controls['depTo'].errors && this.interestChequePrintingFormGroup.controls['reportParameters'].controls['depTo'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Depositor To Code is required", (document.getElementById("UpToCode")?.childNodes[0] as HTMLInputElement)?.focus(), "error")
    }
    else if (this.interestChequePrintingFormGroup.controls['reportParameters'].controls['startChequeNo'].errors && this.interestChequePrintingFormGroup.controls['reportParameters'].controls['startChequeNo'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Cheque No is required", this.renderer.selectRootElement("#startChequeNoId")?.focus(), "error")
    }
    else if (this.interestChequePrintingFormGroup.controls['reportParameters'].controls['chequeDate'].errors && this.interestChequePrintingFormGroup.controls['reportParameters'].controls['chequeDate'].errors?.['required']) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Cheque Date is required ", this.renderer.selectRootElement("#chqDataField")?.focus(), "error")
    }
  }
  viewReport() {
    this.commonReportsService.getTtxParameterizedReport(this.interestChequePrintingFormGroup.value).pipe(take(1)).subscribe({
      next: (res: any) => {
        this.loaderToggle = false
        if (res?.type == 'application/json') {
          this.toastr.showError('No Records Found')
        }
        else {
          let pdfFile = new Blob([res], { type: "application/pdf" });
          let fileName = this.commonReportsService.getReportName();
          const url = window.URL.createObjectURL(pdfFile);
          this.src = url;
          this.enableDisabledActionField(true, true, false, false, false)
          this.isPdfViewerHide = false
          this.pdfFileBlob = pdfFile
        }
      },
      error: (err: any) => {
        this.loaderToggle = false
        if (err.status === 404) {
          this.toastr.showError("No Records Found")
        }
      },
      complete: () => {
        this.loaderToggle = false
      }
    })
  }

  nextPage() {
    this.page++;
  }
  prevPage() {
    this.page--;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.loaderToggle = false
  }
}