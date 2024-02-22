import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DepositEntryService } from 'src/app/services/fd/deposit-entry.service';
import * as moment from 'moment';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import * as fileSaver from 'file-saver';
import { ServiceService } from 'src/app/services/service.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as SockJs from 'sockjs-client'
import * as Stomp from 'stompjs';
import { WsdemoComponent } from 'src/app/shared/generic/wsdemo/wsdemo.component';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

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
  selector: 'app-interestcalculation',
  templateUrl: './interestcalculation.component.html',
  styleUrls: ['./interestcalculation.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      // useValue: 'en-GB' ,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }, WsdemoComponent
    //   { provide: LOCALE_ID, useValue: "en-US" }, //replace "en-US" with your locale
    //otherProviders...
  ],
})
export class InterestcalculationComponent implements OnInit {
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  readonlyAttr = true;
  loaderToggle: boolean = false;
  disabledFlagCalcInterest: boolean = false;
  disabledFlagPrint: boolean = true;
  disabledFlagSave: boolean = true;
  disabledFlagExport: boolean = true;
  exitSession: boolean = false;
  isPdfViewerHide: boolean = true;
  page: number = 1;
  totalPages: number = 0;
  src = '';
  fetchInterestCalcApi =
    'interest-calculation/fetch-interest-calculation-report';
  killSessionApiOnExit = 'interest-calculation/truncate-temp-table';
  saveInterestApiCall = 'interest-calculation/save-interest-calculation';
  closeDate!: string;
  sessionId!: string;
  storeBlobData: any = null;
  summaryBlobData: any = null;
  totalDepositAmount!: any;
  totalInterestAmount!: any;
  totalInterestAmountWithStaff!: any;
  ws:any
  @ViewChild(F1Component) comp!: F1Component;
  @ViewChild('SaveConfirmation') SaveConfirmation!: ElementRef
  modalTitle: any = "K Raheja ERP"
  constructor(
    private dynapop: DynapopService,
    private chageDetection: ChangeDetectorRef,
    private router: Router,
    private commonReportService: CommonReportsService,
    private toastr: ToasterapiService,
    private depositEntryService: DepositEntryService,
    private _service: ServiceService,
    private rendered: Renderer2,
    private modalService: ModalService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _ws:WsdemoComponent
  ) {
    (window as any).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';
  }

  interestCalculationFormGroup = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    calCulateUpTo: new FormControl(this.setDefaultDate(), Validators.required),
    companyName: new FormControl(),
  });
  reportPayload: any | undefined = {
    name: 'Int_Calc.rpt',
    seqId: 1,
    reportParameters: {
      sessionId: '',
      closeDate: '',
      Calc_Upto: `${moment(
        this.interestCalculationFormGroup.get('calCulateUpTo')?.value
      ).format('DD/MM/YYYY')}`,
      formname: `''`,
    },
    isPrint: false,
  };

  ngOnInit(): void {
    this.getCompanyList();
    this.setDefaultDate();

    this._service.pageData.subscribe({
      next: (val) => {
        this.reportPayload.reportParameters['formname'] = `'${val.formName}'`;
      },
    });
  }

  ngAfterViewInit() {
    this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus();
  }

  ngAfterContentChecked() {
    this.chageDetection.detectChanges();
    this.resetField();
  }
  resetField() {
    if (this.interestCalculationFormGroup.get('companyCode')?.value == '') {
      this.interestCalculationFormGroup.patchValue({
        companyName: '',
      });
    }
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.columnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.tableData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  updateListControl(val: any, formControl: any) {
    if (val != undefined) {
      formControl.setValue(val[this.bringBackColumn]);
    }
  }

  setDefaultDate() {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    let setDefaultDateValue;
    console.log('currentMonth', currentMonth, currentYear);
    if (currentMonth <= 3) {
      setDefaultDateValue = `${currentYear}-03-31`;
      return setDefaultDateValue;
    }
    if (currentMonth == 4) {
      setDefaultDateValue = `${currentYear}-04-30`;
      return setDefaultDateValue;
    }
    if (currentMonth >= 5 && currentMonth <= 10) {
      setDefaultDateValue = `${currentYear}-10-31`;
      return setDefaultDateValue;
    }
    if (currentMonth >= 11) {
      setDefaultDateValue = `${currentYear + 1}-03-31`;
      return setDefaultDateValue;
    }
    return;
  }

  enableDisableFlagBtn(calcInterestFlag: any, exportFlag: any, printFlag: any) {
    (this.disabledFlagCalcInterest = calcInterestFlag),
      (this.disabledFlagExport = exportFlag),
      (this.disabledFlagPrint = printFlag);
  }


  calcWs(){
    this.loaderToggle = true
    this._service.updateWs(true)

    let wsEndPt = `${environment.API_URL}fd-interest-calc`;
    let _client = new SockJs(wsEndPt)
    this.ws = Stomp.over(_client);
    const that = this;
    let sub=  this.ws.connect({}, function () {
      that.ws.subscribe('/fd/interest-calc-socket', function (message: any) {
        if(message.body=='DISCONNECT'){
          that._service.showGreeting('Retrieving Report'); 
          that.disconnect(that.ws);
        
        }else{
          let dMsg = JSON.parse(message.body);
          let crrDepositor = `Depositor : ${dMsg.depositor} / Receipt No : ${dMsg.deposit}`
          that._service.showGreeting(crrDepositor); 
        }
      });
      that.ws.subscribe('/errors', function (error: any) {
        alert("Errors" + error.body)
        that.loaderToggle=false
      });
    },
      function (error: string) {
        alert("STOMP error " + error);
        that.loaderToggle=false
      }
    )
   
    this._service.updateWs(false)

  }

  calcInterest() {
    this.reportPayload.reportParameters.Calc_Upto = `'${moment(
      this.interestCalculationFormGroup.get('calCulateUpTo')?.value
    ).format('DD/MM/YYYY')}'`;
    if (this.interestCalculationFormGroup?.valid) {
      this.exitSession = true;
      this.disabledFlagExport = false;
      this.loaderToggle = true;
      this._service.getWsMsg(true)
      this.calcWs()
      this.viewReport();
    } else {
      this.exitSession = false;
      this.validationField();
      this.interestCalculationFormGroup.markAllAsTouched();
    }
  }
  updateOnChangeCompanyList(event: any) {
    console.log('tabledata', this.tableData);
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (
        this.tableData.dataSet[i][0].trim() ===
        event?.target?.value.toUpperCase()
      ) {
        return this.tableData.dataSet[i];
      } else {
        return null;
      }
    });
    if (event?.target?.value) {
      if (result.length == 0) {
        this.interestCalculationFormGroup.patchValue({
          companyCode: '',
        });
      } else {
        this.interestCalculationFormGroup.patchValue({
          companyName: result[0][1].trim(),
        });
      }
    }
    if (event?.target?.value == '') {
      (
        document.getElementById('companyCode')
          ?.childNodes[0] as HTMLInputElement
      )?.focus();
    }
  }

  disconnect(ws: any) {
    console.log("yash..."+ ws);
    if (ws != null) {
      ws.disconnect()
      console.log("disconnect...");
    }
  }

  handleExit() {
    this._ws.disconnect()
    if (this.exitSession) {
      this.loaderToggle = true;
      this.depositEntryService
        .exitKillSessionInterestCalculation(this.killSessionApiOnExit)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res?.status) {
              this.storeBlobData = null;
              this.summaryBlobData = null;
              this.isPdfViewerHide = true;
              this.exitSession = false;
              this.enableDisableFlagBtn(false, true, true);
              this.disabledFlagSave = true
              this.interestCalculationFormGroup.reset();
              setTimeout(() => {
                this.rendered
                  .selectRootElement(this.comp.fo1.nativeElement)
                  ?.focus();
              }, 50);
              this.page = 1;
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
            this.toastr.showError(err);
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  

  getInterestPaymentSummaryReport() {
    let payload = {
      coy: this.interestCalculationFormGroup.get('companyCode')?.value,
      intupto: moment(
        this.interestCalculationFormGroup.get('calCulateUpTo')?.value
      ).format('DD/MM/YYYY'),
      sessid: this.reportPayload.reportParameters.sessionId,
      totalDepositAmount: this.totalDepositAmount,
      totalInterestAmount: this.totalInterestAmount,
      totalInterestAmountForStaff: this.totalInterestAmountWithStaff,
      site: sessionStorage.getItem('site'),
      userid: sessionStorage.getItem('userName'),
    };
    this.depositEntryService.interestPaymentSummaryReport(payload).subscribe({
      next: (res: any) => {
        if (res?.type == 'application/json') {
          this.toastr.showError('No Records Found');
          this.isPdfViewerHide = true;
          this.enableDisableFlagBtn(false, true, true);
          this.disabledFlagSave = true;
          this.loaderToggle = false
        } else {
          this.summaryBlobData = res;
          this.isPdfViewerHide = false;
          this.enableDisableFlagBtn(true, false, false);
          this.loaderToggle=false
        }
      },
      error:(err:any)=>{
        this.isPdfViewerHide = true;
        this.enableDisableFlagBtn(false, true, true);
        this.disabledFlagSave = true;
        this.loaderToggle=false
      }
    });

  }

  getReport(print: boolean) {
    let pdf = new Blob([this.storeBlobData], { type: 'application/pdf' });
    let summaryPdf = new Blob([this.summaryBlobData], { type: 'application/pdf' });
    //this.depositEntryService.interestPaymentSummaryReport()
    let filename = this.commonReportService.getReportName();
    let filenameSumm = "interestPayment_" + this.commonReportService.getReportName();
    if (print) {
      const blobUrl = URL.createObjectURL(pdf);
      const oWindow = window.open(blobUrl, '_blank');
      oWindow?.print();
    } else {
      fileSaver.saveAs(pdf, filename);
      fileSaver.saveAs(summaryPdf, filenameSumm);
    }
  }
  // print() {
  //   this.loaderToggle = true;
  //   const blobUrl = URL.createObjectURL(pdf);
  //   const oWindow = window.open(blobUrl, '_blank');
  //   oWindow?.print();
  // }

  nextPage() {
    this.page++;
  }
  prevPage() {
    this.page--;
  }
  viewReport() {
    let resData: any;
    this.depositEntryService
      .fetchInterestCalculationReport(
        this.fetchInterestCalcApi,
        this.interestCalculationFormGroup.get('companyCode')?.value,
        moment(
          `${this.interestCalculationFormGroup.get('calCulateUpTo')?.value}`
        ).format('DD/MM/YYYY')
      )
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          resData = res;
        },
        error: (err: any) => {
          this.enableDisableFlagBtn(false, true, true);
          this.loaderToggle = false;
        },
        complete: () => {
          console.log(resData?.status);
          if (resData?.status) {
            this.reportPayload.reportParameters.closeDate =
              resData?.data?.closeDate;
            this.reportPayload.reportParameters.sessionId =
              resData?.data?.sessionId;
            this.totalDepositAmount = resData?.data?.totalDepositAmount.value;
            this.totalInterestAmount =
              resData?.data?.totalInterestAmount?.value;
            this.totalInterestAmountWithStaff =
              resData?.data?.totalInterestAmountForStaff?.value;
            if (resData?.data?.isSaveEnabled) {
              this.disabledFlagSave = false;
            }
            this.commonReportService
              .getTtxParameterizedReport(this.reportPayload)
              .pipe(take(1))
              .subscribe({
                next: (res: any) => {
                  if (res?.type == 'application/json') {
                    this.toastr.showError('No Records Found');
                    this.enableDisableFlagBtn(false, true, true);
                    this.disabledFlagSave = true;
                    this.loaderToggle =false
                  } else {
                    this.storeBlobData = res;
                    let pdfFile = new Blob([res], { type: 'application/pdf' });
                    let fileName = this.commonReportService.getReportName();
                    const url = window.URL.createObjectURL(pdfFile);
                    this.src = url;
                    this.getInterestPaymentSummaryReport()
                  }
                },
                error: (err: any) => {
                  this.loaderToggle = false;
                  if (err.status === 404) {
                    setTimeout(() => {
                      this.interestCalculationFormGroup.reset();
                      this.rendered
                        .selectRootElement(this.comp.fo1.nativeElement)
                        ?.focus();
                    }, 50);
                  }
                  this.enableDisableFlagBtn(false, true, true);
                  this.disabledFlagSave = true;
                },
                complete: () => {
                  this._service.showGreeting('')
                  this._service.getWsMsg(false)
                },
              });
          } else {
            this.loaderToggle = false;
            this.toastr.showError(resData.message);
          }
        },
      });
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.loaderToggle = false;
  }

  validationField() {
    if (
      this.interestCalculationFormGroup.controls['companyCode'].errors &&
      this.interestCalculationFormGroup.controls['companyCode'].errors?.[
      'required'
      ]
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'companyCode is Required',
        this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(),
        'error'
      );
    } else if (
      this.interestCalculationFormGroup.controls['calCulateUpTo'].errors &&
      this.interestCalculationFormGroup.controls['calCulateUpTo'].errors?.[
      'required'
      ]
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'CalculateUpTo Date is Required',
        this.rendered.selectRootElement('#calCulateUpToDate')?.focus(),
        'error'
      );
    }
  }

  openDialog(titleVal: any, templateField: any, isF1PressedFlag: boolean, type: string | null, msg: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        isF1Pressed: isF1PressedFlag,
        title: titleVal,
        message: msg,
        template: templateField,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
    this.dialogRef.afterClosed().subscribe(()=>{
      this.disabledFlagSave = false
    })
  }

  yesSave(){
    this.loaderToggle = true;
    this.dialogRef.close();
      let payload = {
      coy: this.interestCalculationFormGroup.get('companyCode')?.value,
      intupto: moment(
        this.interestCalculationFormGroup.get('calCulateUpTo')?.value
      ).format('DD/MM/YYYY'),
      sessid: this.reportPayload.reportParameters.sessionId,
      totalDepositAmount: this.totalDepositAmount,
      totalInterestAmount: this.totalInterestAmount,
      totalInterestAmountForStaff: this.totalInterestAmountWithStaff,
      site: sessionStorage.getItem('site'),
      userid: sessionStorage.getItem('userName'),
    };
    this.depositEntryService
      .saveInterestCalculation(this.saveInterestApiCall, payload)
      .subscribe({
        next: (res: any) => {
          if (!res.status) {
            this.modalService.showErrorDialog(constant.ErrorDialog_Title,res.message,"error")
            this.disabledFlagSave = false
          } else {
            this.getReport(false)
            this.modalService.showErrorDialog(constant.ErrorDialog_Title,res.message,"info")
            this.isPdfViewerHide = true;
            this.interestCalculationFormGroup.reset();
            setTimeout(() => {
              this.rendered
                .selectRootElement(this.comp.fo1.nativeElement)
                ?.focus();
            }, 50);
            this.enableDisableFlagBtn(false, true, true);
            this.disabledFlagSave = true
            this.storeBlobData = null;
            this.summaryBlobData = null;
          }
        },
        error: (err: any) => {
          this.loaderToggle = false;
          this.disabledFlagSave = false
          this.toastr.showError('something went wrong');
        },
        complete: () => {
          this.loaderToggle = false;
        },
      });
  }

  no(){
    this.disabledFlagSave = false
    this.dialogRef.close()
  }

  save() {
    this.disabledFlagSave = true
    this.openDialog(this.modalTitle,this.SaveConfirmation,true,null,"")
  }

  //  connect() {
  //   //connect to stomp where stomp endpoint is exposed
  //   let socket  = new SockJS(`${environment.API_URL}fd-interest-calc`);
  //   this.ws = Stomp.over(socket);
    
  //   // let socket = new WebSocket("ws://localhost:8080/gs-guide-websocket"); 
  //   // this.ws = Stomp.over(socket);
  //   let that = this;
  //   this.ws.connect({}, function() {
  //     that.ws.subscribe("/topic/greetings", function(message: any) {
  //       console.log(message)
  //       that.showGreeting(JSON.parse(message.body));
  //     });
  //     that.ws.subscribe("/errors", function(message: any) {
  //       alert("Error " + message.body);
  //     });
  //     that.disabled = true;
  //   }, function(error: string) {
  //     alert("STOMP error " + error);
  //   });
  // }
}
