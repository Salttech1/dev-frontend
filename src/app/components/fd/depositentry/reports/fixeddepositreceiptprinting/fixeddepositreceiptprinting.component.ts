import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { DatePipe } from '@angular/common';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { Router } from '@angular/router';
import { fileConstants } from 'src/constants/fileconstants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { finalize, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-fixeddepositreceiptprinting',
  templateUrl: './fixeddepositreceiptprinting.component.html',
  styleUrls: ['./fixeddepositreceiptprinting.component.css'],
})
export class FixeddepositreceiptprintingComponent implements OnInit {
  compHeader!: any[];
  compData!: any;
  columnHeader!: any[];
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  depositorTableData: any;
  deptColumnHeader!: any[];
  recieptTableData: any;
  recieptColumnHeader!: any[];
  deptDyanPop!: string;
  recieptDyanPop!: string;
  datePipe = new DatePipe('en-US');
  readonlyAttr: boolean = false;
  isViewClicked: boolean = false;
  loaderToggle: boolean = false;
  page: number = 1;
  totalPages: number = 0;
  src = '';
  pdfFile: any;
  fileName: any;
  recieptNumList: any[] = [];
  reportParamData: any;

  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private dynapop: DynapopService,
    private router: Router,
    private renderer: Renderer2,
    private commonReportService: CommonReportsService,
    private modalService: ModalService,
    private route: Router,
    private http: HttpClient,
    private toastr: ToasterapiService,
    private changeDetectRef: ChangeDetectorRef
  ) {
    (window as any).pdfWorkerSrc = 'assets/js/pdf.worker.min.js';
  }

  ngOnInit(): void {
    this.getCompanyList();
    this.fixedDepositPrintSectionForm.controls['reportParameters']
      .get('deptr_coy_1')
      ?.disable();
    this.fixedDepositPrintSectionForm.controls['reportParameters']
      .get('depositorName')
      ?.disable();
  }

  ngAfterContentChecked() {
    this.changeDetectRef.detectChanges();
    if (
      this.fixedDepositPrintSectionForm.controls['reportParameters'].get('coy')
        ?.value == ''
    ) {
      this.fixedDepositPrintSectionForm.patchValue({
        reportParameters: {
          deptr_coy_1: '',
        },
      });
    }
    if (
      this.fixedDepositPrintSectionForm.controls['reportParameters'].get(
        'Depositor'
      )?.value == ''
    ) {
      this.fixedDepositPrintSectionForm.patchValue({
        reportParameters: {
          depositorName: '',
        },
      });
    }
  }

  fixedDepositPrintSectionForm = new FormGroup({
    name: new FormControl(fileConstants.fixedDepositReceiptPrint),
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    exportType: new FormControl(),
    reportParameters: new FormGroup({
      coy: new FormControl('', Validators.required),
      deptr_coy_1: new FormControl(''),
      nominee: new FormControl(''),
      signatory: new FormControl(''),
      amtinwords: new FormControl(''),
      address: new FormControl(''),
      renewal_desc: new FormControl(''),
      Depositor: new FormControl('', Validators.required),
      depositorName: new FormControl(''),
      ReceiptNum: new FormControl('', Validators.required),
      CloseDate: new FormControl(),
      PartyCode: new FormControl(''),
    }),
  });

  viewReport() {
    if (this.fixedDepositPrintSectionForm?.valid) {
      this.loaderToggle = true;
      this.fixedDepositPrintSectionForm.value.exportType = 'PDF';
      this.commonReportService
        .getTtxParameterizedReport(this.fixedDepositPrintSectionForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            console.log('view pdf', res);
            if (res.type == 'application/json') {
              this.toastr.showError('Something went wrong');
              this.fixedDepositPrintSectionForm.reset();
              this.fixedDepositPrintSectionForm.patchValue({
                name: fileConstants.fixedDepositReceiptPrint,
                isPrint: false,
                seqId: 1,
              });
              this.renderer
                .selectRootElement(this.comp.fo1.nativeElement)
                ?.focus();
            } else {
              this.isViewClicked = true;
              this.pdfFile = new Blob([res], {
                type: 'application/octet-stream',
              });
              this.fileName = this.commonReportService.getReportName();
              const url = window.URL.createObjectURL(this.pdfFile);
              this.src = url;
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
            if (err.status === 404) {
              this.renderer
                .selectRootElement(this.comp.fo1.nativeElement)
                .focus();
            } else {
              this.renderer
                .selectRootElement(this.comp.fo1.nativeElement)
                .focus();
            }
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.fixedDepositPrintSectionForm.markAllAsTouched();
    }
  }

  exportReport(print: boolean) {
    this.loaderToggle = true;
    this.fixedDepositPrintSectionForm.value.exportType = print ? 'PDF' : 'WORD';
    this.commonReportService
      .getTtxParameterizedReport(this.fixedDepositPrintSectionForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.loaderToggle = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.type == 'application/json') {
            this.toastr.showError('Something went wrong');
          } else {
            this.fileName = this.commonReportService.getReportName();
            if (print) {
              this.pdfFile = new Blob([res], {
                type: 'application/pdf',
              });
              const blobUrl = URL.createObjectURL(this.pdfFile);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              this.pdfFile = new Blob([res], {
                type: 'application/octet-stream',
              });
              fileSaver.saveAs(this.pdfFile, this.fileName + '.docx');
            }
          }
        },
      });

    // if (print) {
    //   console.log('print2', print);

    //   const blobUrl = URL.createObjectURL(this.pdfFile);
    //   const oWindow = window.open(blobUrl, '_blank');
    //   oWindow?.print();
    // } else
    // {
    //   console.log('print3', print);

    // }
  }

  nextPage() {
    this.page++;
  }
  prevPage() {
    this.page--;
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.loaderToggle = false;
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  handleBackClick() {
    this.isViewClicked = false;
    this.fixedDepositPrintSectionForm.reset();
    this.fixedDepositPrintSectionForm.patchValue({
      name: fileConstants.fixedDepositReceiptPrint,
      isPrint: false,
      seqId: 1,
    });
    setTimeout(() => {
      this.renderer.selectRootElement(this.comp.fo1.nativeElement)?.focus();
    }, 50);
    this.page = 1;
  }

  print() {
    if (this.fixedDepositPrintSectionForm.valid) {
      this.fixedDepositPrintSectionForm.value.isPrint = true;
      this.loaderToggle = true;
      this.commonReportService
        .getTtxParameterizedPrintReport(this.fixedDepositPrintSectionForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.loaderToggle = false;
              this.toastr.showSuccess(res.message);
            } else {
              this.toastr.showError(res.message);
            }
          },
          error: (err: any) => {
            this.loaderToggle = false;
          },
          complete: () => {
            this.loaderToggle = false;
          },
        });
    } else {
      this.checkIsDataValid();
    }
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.compHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.compData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  fetchReportParams(actionType: string) {
    setTimeout(() => {
      let params = new HttpParams()
        .set(
          'companyCode',
          this.fixedDepositPrintSectionForm?.value.reportParameters?.coy!
        )
        .set(
          'depositorId',
          this.fixedDepositPrintSectionForm?.value.reportParameters?.Depositor!
        )
        .set(
          'receiptNum',
          this.fixedDepositPrintSectionForm?.value.reportParameters?.ReceiptNum!
        );
      this.http
        .get(
          `${environment.API_URL}${constant.api_url.fetchFixedDepositParams}`,
          { params: params }
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.reportParamData = res.data;
              this.setReportValues();
              if (actionType == 'V') {
                this.viewReport();
              }
              if (actionType == 'P') {
                this.handlePrintClick();
              }
            }
          },
          error: (err: any) => {
            console.log('Error: ', err);
          },
        });
    }, 30);
  }

  setReportValues() {
    this.fixedDepositPrintSectionForm.patchValue({
      reportParameters: {
        signatory: `'Authorised / Signatory Director'`,
        amtinwords: `'${this.reportParamData?.amtinwords}'`,
        address: `'${this.reportParamData?.address}'`,
        renewal_desc: `'${this.reportParamData?.renewalDesc}'`,
        nominee: `'${this.reportParamData?.nominee}'`,
        PartyCode:
          this.fixedDepositPrintSectionForm?.value.reportParameters?.coy
            ?.trim()
            .concat(
              this.fixedDepositPrintSectionForm?.value.reportParameters?.Depositor!.trim()
            ),
      },
    });
  }

  fetchCompanyCloseDate() {
    setTimeout(() => {
      let params = new HttpParams().set(
        'companyCode',
        this.fixedDepositPrintSectionForm.controls['reportParameters']?.get(
          'coy'
        )?.value!
      );
      this.http
        .get(
          `${environment.API_URL}${constant.api_url.fetchCompanyCloseDate}`,
          { params: params }
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.fixedDepositPrintSectionForm.patchValue({
              reportParameters: {
                CloseDate: res.data,
              },
            });
          },
          error: (err: any) => {},
        });
    }, 30);
  }

  updateCompanyList(compData: any) {
    this.fixedDepositPrintSectionForm.patchValue({
      reportParameters: {
        deptr_coy_1: compData[this.bringBackColumn].trim(),
      },
    });
    this.fetchCompanyCloseDate();
    this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`;
    this.dynapop
      .getDynaPopListObj(
        'DEPOSITORS',
        `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      )
      .subscribe((res: any) => {
        this.deptColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.depositorTableData = res.data;
      });
  }

  updateListControl(val: any) {
    this.fixedDepositPrintSectionForm.patchValue({
      reportParameters: {
        Depositor: val[0].toString(),
        depositorName: val[1].toString().trim(),
      },
    });
    this.getRecieptNumbers(val[0].toString().trim());
  }

  getRecieptNumbers(depositorId: string) {
    this.recieptNumList = [];
    this.recieptDyanPop =
      'dep_depositor=' +
      depositorId +
      ' AND ' +
      ` dep_coy='${this.fixedDepositPrintSectionForm?.value.reportParameters?.coy?.trim()}'`;
    this.dynapop
      .getDynaPopListObj('FDRECEIPTNUM ', this.recieptDyanPop)
      .subscribe((res: any) => {
        this.recieptColumnHeader = [res.data.colhead1, res.data.colhead2];
        for (let i = 0; i < res.data.dataSet.length; i++) {
          // res.data.dataSet[i][1] = this.datePipe.transform(res.data.dataSet[i][1], 'dd/MM/yyyy');
          this.recieptNumList.push(res.data.dataSet[i][0].trim());
        }
        this.recieptTableData = res.data;
      });
  }

  updateReciept(val: any) {}

  setCompanyName() {
    for (let i = 0; i < this.compData.dataSet.length; i++) {
      if (
        this.compData.dataSet[i][0].startsWith(
          this.fixedDepositPrintSectionForm?.value.reportParameters?.coy
        )
      ) {
        this.fixedDepositPrintSectionForm.patchValue({
          reportParameters: {
            deptr_coy_1: this.compData.dataSet[i][1].trim(),
          },
        });
      }
    }
  }

  handlePrintClick() {
    let params = new HttpParams()
      .set(
        'depositorId',
        this.fixedDepositPrintSectionForm.controls[
          'reportParameters'
        ].value.Depositor?.trim()!
      )
      .set(
        'companyCode',
        this.fixedDepositPrintSectionForm.controls[
          'reportParameters'
        ].value.coy?.trim()!
      )
      .set(
        'recieptNo',
        this.fixedDepositPrintSectionForm.controls[
          'reportParameters'
        ].value.ReceiptNum?.trim()!
      );
    this.http
      .get(
        `${environment.API_URL}${constant.api_url.validateDepositPrintRev}`,
        { params: params }
      )
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.exportReport(true);
          } else {
            this.modalService.showErrorDialog(
              constant.ErrorDialog_Title,
              res.message,
              'info'
            );
          }
        },
        error: (err: any) => {},
      });
  }

  setDepositorName() {
    for (let i = 0; i < this.depositorTableData.dataSet.length; i++) {
      if (
        this.depositorTableData.dataSet[i][0].startsWith(
          this.fixedDepositPrintSectionForm?.value.reportParameters?.Depositor
        )
      ) {
        this.fixedDepositPrintSectionForm.patchValue({
          reportParameters: {
            depositorName: this.depositorTableData.dataSet[i][1].trim(),
          },
        });
      }
    }
  }

  handleViewClick() {
    if (this.checkIsDataValid()) {
      this.fetchReportParams('V');
    }
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  checkIsDataValid() {
    if (this.fixedDepositPrintSectionForm?.value.reportParameters?.coy == '') {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Company code cannot be left blank',
        this.focusField('company4'),
        'error'
      );
      return false;
    }
    if (
      this.fixedDepositPrintSectionForm?.value.reportParameters?.Depositor == ''
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Depositor code cannot be left blank',
        this.focusField('depositor4'),
        'error'
      );
      return false;
    }
    if (
      this.fixedDepositPrintSectionForm?.value.reportParameters?.ReceiptNum ==
      ''
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Receipt Num cannot be left blank',
        this.focusField('receipt4'),
        'error'
      );
      return false;
    }
    if (
      !this.recieptNumList.includes(
        this.fixedDepositPrintSectionForm?.value.reportParameters?.ReceiptNum?.trim()
      )
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Invalid Receipt Number',
        this.focusField('receipt4'),
        'error'
      );
      this.fixedDepositPrintSectionForm.patchValue({
        reportParameters: {
          ReceiptNum: '',
        },
      });
      return false;
    } else {
      return true;
    }
  }

  handleExit() {
    this.route.navigate(['/dashboard']);
  }
}
