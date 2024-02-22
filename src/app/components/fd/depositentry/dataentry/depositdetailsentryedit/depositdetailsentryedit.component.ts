import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnDestroy,
  Renderer2,
  HostListener,
} from '@angular/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as constant from '../../../../../../constants/constant';
import { DatePipe } from '@angular/common';
import { finalize, Subscription, take } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { ModalService } from 'src/app/services/modalservice.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDialog } from '@angular/material/dialog';
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
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-depositdetailsentryedit',
  templateUrl: './depositdetailsentryedit.component.html',
  styleUrls: ['./depositdetailsentryedit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DepositdetailsentryeditComponent implements OnInit {
  depositFetchedData!: any;
  count: number = 0;
  optionList = ['Y', 'N'];
  depositorTableData: any;
  recieptTableData: any;
  recieptColumnHeader!: any[];
  deptColumnHeader!: any[];
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  deptDyanPop!: string;
  recieptDyanPop!: string;
  coy_condition = "coy_fdyn='Y'";
  fetchRequestAPI: any;
  receivedData: any;
  t1: number = 0;
  paramsPost: any;
  receiveDepositData!: FormGroup;
  passRetrieveApiUrl: string = '';
  passSaveApiUrl: any = constant.Add_Deposit;
  addChkApi = constant.RecieptNumber_Chk;
  tabContentFlag: boolean = false;
  isAddClicked!: boolean;
  isRetrievClicked!: boolean;
  insupdVal: string = '';
  depositScreenName: string = 'DepositDetailEntryEdit';
  datePipe = new DatePipe('en-US');
  depositAmount: number = 0;
  testSubscription!: Subscription;
  inchqRequestBean: any[] = [{}];
  data1: any;
  bothDataValid: boolean = false;
  isInchqDataValid: boolean = false;
  resetClickSubscription!: Subscription;
  saveClickSubscription!: Subscription;
  error_modal = 'error';
  showSave: boolean = false;
  showReset: boolean = false;
  loader: boolean = false;
  showBack: boolean = false;
  showAdd: boolean = true;
  showRetrieve: boolean = true;
  showList: boolean = true;
  showPrint: boolean = true;
  showDepositor: boolean = true;
  showExit: boolean = true;
  coy_error = 'Invalid Company Code';
  dep_error = 'Invalid Depositor Code';
  reciept_error = 'Invalid reciept number';
  bankColumnHeader!: any[];
  originColumnHeader!: any[];
  payToColumnHeader!: any[];
  durationColumnHeader!: any[];
  voucherColumnHeader!: any[];
  brokerColumnHeader!: any[];
  inFreqColumnHeader!: any[];
  liquidityColumnHeader!: any[];
  bankTableData: any;
  originTableData: any;
  durationTableDate: any;
  payToTableDate: any;
  voucherData: any;
  brokerTableDate: any;
  inFreqTableDate: any;
  liquidityTableDate: any;
  bank_condition = '';
  orig_condition = '';
  payto_condition = "ent_class = 'PAYTO'";
  broker_condition = '';
  voucher_condition = '';
  duration_condition = '';
  interest_condtion = '';
  liq_condition = '';
  intTest!: any;
  disableSave: boolean = false;
  disableReset: boolean = false;
  readonlyAttr = true;
  receiptNumList: any[] = [];
  @ViewChild(F1Component) comp!: F1Component;

  inChq: any[] = [
    {
      bank: '',
      outstat: 'N',
      date: new Date(),
      num: '',
      amount: '',
      userid: sessionStorage.getItem('userName'),
      chqDate: this.getFormatteDate(new Date()),
      coy: '',
      proprietor: '',
      slipnum: '',
    },
  ];
  bankCode: any = '';
  depAmount: any = '';
  chqNumber: any = '';
  chequeDate: any = new Date();
  totalAmount: number = 0;
  depositDetail!: any;

  depositEntryForm = new FormGroup({
    bankcode: new FormControl('', Validators.required),
    depamount: new FormControl(''),
    depmonths: new FormControl(''),
    nominee: new FormControl(''),
    jowner1: new FormControl(''),
    jowner2: new FormControl(''),
    jowner3: new FormControl(''),
    ngname1: new FormControl(''),
    ngname2: new FormControl(''),
    ngname3: new FormControl(''),
    ngid1: new FormControl(''),
    ngid2: new FormControl(''),
    ngid3: new FormControl(''),
    liqtype: new FormControl(''),
    matamount: new FormControl(''),
    intrate: new FormControl(''),
    matdate: new FormControl(),
    depdate: new FormControl(),
    staffyn: new FormControl('N'),
    payeecode: new FormControl(''),
    instip: new FormControl('H'),
    instbp: new FormControl('H'),
    intfreq: new FormControl(''),
    brokper: new FormControl('0.0'),
    intrate2: new FormControl(''),
    deporigin: new FormControl('N'),
    slipnum: new FormControl('', Validators.required),
    broker: new FormControl(''),
    brokerName: new FormControl(''),
    origreceipt: new FormControl(''),
    chqDate: new FormControl(),
    warbank: new FormControl(''),
    waracc: new FormControl(''),
    instfdr: new FormControl('H'),
    brokcheqdate: new FormControl(),
    grossint: new FormControl(),
  });

  focusInputs(id: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  constructor(
    private dynapop: DynapopService,
    private http: HttpClient,
    private renderer: Renderer2,
    private modalService: ModalService,
    private router: Router,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private actionService: ActionservicesService,
    private toastr: ToasterapiService
  ) {}

  ngOnInit(): void {
    this.depositEntryForm?.controls['deporigin'].disable();
    this.getCompanyList();
  }

  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  scrollPage(height: number) {
    console.log('Testing');
    window.scrollTo(0, height);
  }

  scrollToEnd() {
    window.scrollTo(0, document.body.scrollHeight);
  }
  handleAddClick() {
    if (this.checkIsFormDataValid(false)) {
      let depId =
        this.sectionEntryForm?.value.depositorId?.trim() == null
          ? ''
          : this.sectionEntryForm?.value.depositorId?.trim();
      this.getDepositorAgeAndBirthDate(depId);
      this.depositorTableData.dataSet.filter((itemId: any) => {
        if (itemId[0].trim() == depId) {
          this.sectionEntryForm.patchValue({
            depositorName: itemId[1],
          });
        }
      });
      this.sectionEntryForm.patchValue({
        recieptNum: '',
      });
      this.depositEntryForm.patchValue({
        intrate2: '',
      });
      this.isAddClicked = true;
      this.focusInputs('bank0');
      this.handleButtonForAddOrRetrieve();
      this.setAddOrRetrieveData();
      this.readonlyAttr = false;
      //Added Disable 
      this.sectionEntryForm.disable();
      this.depositEntryForm.patchValue({
        depdate: new Date(),
        brokcheqdate: new Date(),
        depmonths: '12',
      });
      this.setMaturityDate();
    }
  }

  checkIsFormDataValid(checkReciept: boolean): boolean {
    if (
      this.sectionEntryForm?.value.companyCode == '' ||
      this.sectionEntryForm?.value.companyCode == null
    ) {
      this.focusField('company4');
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Company Name Cannot Be Left Blank',
        'error'
      );

      return false;
    } else if (
      this.sectionEntryForm?.value.depositorId == '' ||
      this.sectionEntryForm?.value.depositorId == null
    ) {
      this.focusField('depositor4');
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Depositor Code Cannot Be Left Blank',
        'error'
      );
      return false;
    } else if (
      (this.sectionEntryForm?.value.recieptNum == '' ||
        this.sectionEntryForm?.value.recieptNum == null) &&
      checkReciept
    ) {
      this.focusField('receipt4');
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Reciept Number Cannot Be Left Blank',
        'error'
      );
      return false;
    } else if (
      !this.receiptNumList.includes(
        this.sectionEntryForm?.value.recieptNum?.trim()
      ) &&
      checkReciept
    ) {
      this.focusField('receipt4');
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Invalid Receipt Number',
        'error'
      );
      this.sectionEntryForm.patchValue({
        recieptNum: '',
      });
      return false;
    } else {
      return true;
    }
  }

  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  retrieveDepositDetails() {
    this.t1 = 0;
    this.sectionEntryForm.controls['recieptNum'].addValidators(
      Validators.required
    );
    this.sectionEntryForm.controls['recieptNum'].updateValueAndValidity();
    if (this.checkIsFormDataValid(true) && this.sectionEntryForm.valid) {
      let params = new HttpParams()
        .set('depositorId', this.sectionEntryForm.value.depositorId?.trim()!)
        .set(
          'companyCode',
          this.sectionEntryForm.value.companyCode?.toString().trim()!
        )
        .set(
          'recieptNo',
          this.sectionEntryForm.value.recieptNum?.toString().trim()!
        );
      this.loader = true;
      this.http
        .get(`${environment.API_URL}${constant.api_url.fetchDeposit}`, {
          params: params,
        }).pipe(
          take(1),
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.loader = false;
            if (res.status) {
              this.handleButtonForAddOrRetrieve();
              this.isRetrievClicked = true;
              this.disableSave = true;
              this.disableReset = true;
              this.depositFetchedData = res.data;
              this.setRetrieveValues();
              this.setAddOrRetrieveData();
              this.readonlyAttr = false;
              this.sectionEntryForm.disable();
              if (this.depositFetchedData.inchqResponseBean != undefined) {
                this.focusInputs('bank0');
              } else {
                setTimeout(() => {
                  let focusElement3 = document.getElementById(
                    'uyewuz'
                  ) as HTMLElement;
                  this.renderer.selectRootElement(focusElement3).focus();
                }, 100);
              }
            } else {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'error'
              );
            }
          },
          error: () => {
            console.log("Something Went Wrong");
          },

        } 
);
    }
  }

  handleBackEvent() {
    this.showSave = false;
    this.showReset = false;
    this.showBack = false;
    this.showAdd = true;
    this.showRetrieve = true;
    this.showList = true;
    this.showPrint = true;
    this.showDepositor = true;
    this.showExit = true;
    this.isRetrievClicked = false;
    this.isAddClicked = false;
    this.sectionEntryForm.enable();
    this.sectionEntryForm.reset();
    this.disableSave = false;
    this.disableReset = false;
    this.resetForm();
    this.focusField('company4');
  }

  resetForm() {
    this.depositEntryForm.controls['bankcode'].reset();
    this.depositEntryForm.controls['slipnum'].reset();
    this.depositEntryForm.controls['broker'].reset();
    this.depositEntryForm.controls['brokerName'].reset();
    this.depositEntryForm.controls['depamount'].reset();
    this.depositEntryForm.controls['matamount'].reset();
    this.depositEntryForm.controls['nominee'].reset();
    this.depositEntryForm.controls['jowner1'].reset();
    this.depositEntryForm.controls['jowner2'].reset();
    this.depositEntryForm.controls['jowner3'].reset();
    this.depositEntryForm.controls['ngname1'].reset();
    this.depositEntryForm.controls['ngname2'].reset();
    this.depositEntryForm.controls['ngname3'].reset();
    this.depositEntryForm.controls['ngid1'].reset();
    this.depositEntryForm.controls['ngid2'].reset();
    this.depositEntryForm.controls['ngid3'].reset();
    this.depositEntryForm.controls['warbank'].reset();
    this.depositEntryForm.controls['waracc'].reset();
    this.depositEntryForm.controls['origreceipt'].reset();
    this.resetChequeDetails();
    this.setDefaultValues();
    this.focusInputs('bank0');
  }
  resetBrokerName() {
    if (this.depositEntryForm?.value.broker == '') {
      this.depositEntryForm.patchValue({
        brokerName: '',
      });
    }
  }

  resetChequeDetails() {
    this.inChq[0].bank = '';
    this.inChq[0].date = new Date();
    this.inChq[0].outstat = 'N';
    this.inChq[0].num = '';
    this.inChq[0].amount = '';
    this.t1 = 0;
    let index = this.inChq.length - 1;
    while (index != 0) {
      this.inChq.splice(index, 1);
      index = index - 1;
    }
  }

  setDefaultValues() {
    this.depositEntryForm.patchValue({
      brokcheqdate: new Date(),
      intrate: this.sectionEntryForm?.value.rateOfInterest,
      depdate: new Date(),
      deporigin: 'N',
      payeecode: 'E',
      liqtype: 'M',
      intfreq: '6',
      staffyn: 'N',
      depmonths: '12',
    });
    this.setMaturityDate();
  }

  handleButtonForAddOrRetrieve() {
    this.showSave = true;
    this.showAdd = false;
    this.showRetrieve = false;
    this.showDepositor = false;
    this.showReset = true;
    this.showList = false;
    this.showPrint = false;
    this.showExit = false;
    this.showBack = true;
  }
  setRetrieveValues() {
    this.t1 = 0;
    this.setAddOrRetrieveData();
    this.depositEntryForm.patchValue({
      depamount: this.depositFetchedData?.depamount,
      nominee: this.depositFetchedData?.nominee,
      jowner1: this.depositFetchedData?.jowner1,
      jowner2: this.depositFetchedData?.jowner2,
      jowner3: this.depositFetchedData?.jowner3,
      matamount: this.depositFetchedData?.matamount,
      intrate: this.depositFetchedData?.intrate,
      matdate: new Date(this.depositFetchedData?.matdate),
      depdate: new Date(this.depositFetchedData?.depdate),
      staffyn: this.depositFetchedData?.staffyn,
      instip: this.depositFetchedData?.instip,
      instbp: this.depositFetchedData?.instbp,
      instfdr: this.depositFetchedData?.instfdr,
      brokper: this.depositFetchedData?.brokper,
      intrate2: this.depositFetchedData?.intrate2,
      origreceipt: this.depositFetchedData?.origreceipt,
      warbank: this.depositFetchedData?.warbank,
      waracc: this.depositFetchedData?.waracc,
      ngname1: this.depositFetchedData?.ngname1,
      ngname2: this.depositFetchedData?.ngname2,
      ngname3: this.depositFetchedData?.ngname3,
      ngid1: this.depositFetchedData?.ngid1,
      ngid2: this.depositFetchedData?.ngid2,
      ngid3: this.depositFetchedData?.ngid3,
      brokcheqdate:
        this.depositFetchedData?.brokcheqdate != undefined
          ? new Date(this.depositFetchedData?.brokcheqdate)
          : '',
    });
    this.setInchqAmountRetrieve();
  }

  setAddOrRetrieveData() {
    this.getBankList();
    this.getBrokersList();
    this.getPayeToList();
    this.getDurationist();
    this.getOriginList();
    this.getLiquidityList();
    this.getInFreqList();
  }

  setInchqAmountRetrieve() {
    if( this.depositFetchedData?.inchqResponseBean){
      for (
        let i = 0;
        i < this.depositFetchedData?.inchqResponseBean.length;
        i++
      ) {
        this.t1 =
          this.t1 + Number(this.depositFetchedData?.inchqResponseBean[i].amount);
      }
    }
    
  }
  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
    //this.setDepsoitAmount();
    this.setInchqData();
    this.payLoadData();
    let params = new HttpParams()
      .set(
        'depositorId',
        `${this.sectionEntryForm?.get('depositorId')?.value}`.trim()
      )
      .set('recieptNo', `${this.sectionEntryForm?.get('recieptNum')?.value}`);
    this.paramsPost = params;
  }

  addDepositDetails() {
    this.showAdd = false;
    this.showReset = true;
    this.showBack = true;
    this.showSave = true;
    this.showDepositor = false;
    this.showPrint = false;
    this.showList = false;
    this.showRetrieve = false;
    this.showExit = false;
  }
  openDepositorScreen() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        'fd/depositentry/dataentry/depositordetailsentry/edit',
      ])
    );
    window.open(url, '_blank');
  }
  sectionEntryForm = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    depositorId: new FormControl('', Validators.required),
    depositorName: new FormControl(''),
    dob: new FormControl(''),
    age: new FormControl(''),
    rateOfInterest: new FormControl(''),
    recieptNum: new FormControl(''),
    isValid: new FormControl(false),
  });

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

  payLoadData() {
    this.updateInchqSlipNumber();
    this.receivedData = {
      userid: sessionStorage.getItem('userName'),
      coy: this.sectionEntryForm?.value.companyCode,
      proprietor: this.sectionEntryForm?.value.companyCode,
      depositor: this.sectionEntryForm?.value.depositorId,
      bankcode: this.depositEntryForm?.value.bankcode,
      depamount: this.depositEntryForm?.value.depamount,
      depmonths: this.depositEntryForm?.value.depmonths,
      grossint: this.depositEntryForm?.value.grossint,
      nominee: this.depositEntryForm?.value.nominee,
      jowner1: this.depositEntryForm?.value.jowner1,
      jowner2: this.depositEntryForm?.value.jowner2,
      jowner3: this.depositEntryForm?.value.jowner3,
      ngname1: this.depositEntryForm?.value.ngname1,
      ngname2: this.depositEntryForm?.value.ngname2,
      ngname3: this.depositEntryForm?.value.ngname3,
      ngid1: this.depositEntryForm?.value.ngid1,
      ngid2: this.depositEntryForm?.value.ngid2,
      ngid3: this.depositEntryForm?.value.ngid3,
      liqtype: this.depositEntryForm?.value.liqtype,
      matamount: this.depositEntryForm?.value.matamount,
      intrate: this.depositEntryForm?.value.intrate,
      intrate2:
        this.depositEntryForm?.value.intrate2 == ''
          ? Number(this.depositEntryForm?.value.intrate)
          : Number(this.depositEntryForm?.value.intrate2),
      matdate: this.datePipe.transform(
        this.depositEntryForm?.value.matdate,
        'dd/MM/yyyy'
      ),
      depdate: this.datePipe.transform(
        this.depositEntryForm?.value.depdate,
        'dd/MM/yyyy'
      ),
      receiptdate: this.datePipe.transform(
        this.depositEntryForm?.value.depdate,
        'dd/MM/yyyy'
      ),
      staffyn: this.depositEntryForm?.value.staffyn,
      payeecode: this.depositEntryForm?.value.payeecode,
      instip: this.depositEntryForm?.value.instip,
      instbp: this.depositEntryForm?.value.instbp,
      intfreq: this.depositEntryForm?.value.intfreq,
      brokper: this.depositEntryForm?.value.brokper,
      deporigin: 'N',
      slipnum: this.depositEntryForm?.value.slipnum,
      vouNum: this.depositEntryForm?.value.slipnum,
      broker: this.depositEntryForm?.value.broker,
      brokerName: this.depositEntryForm?.value.brokerName,
      origreceipt: this.sectionEntryForm?.value.recieptNum,
      brokcheqdate:
        this.depositEntryForm?.value.broker != null &&
        this.depositEntryForm?.value.broker != ''
          ? this.datePipe.transform(
              this.depositEntryForm?.value.brokcheqdate,
              'dd/MM/yyyy'
            )
          : '',
      warbank: this.depositEntryForm?.value.warbank,
      waracc: this.depositEntryForm?.value.waracc,
      instfdr: this.depositEntryForm?.value.instfdr,
      inchqRequestBean: this.inChq,
    };

    return this.receivedData;
  }

  handleF1Event(event: any) {
    event.preventDefault();
    this.modalService.showErrorDialog(
      constant.ErrorDialog_Title,
      'Help Not Availablle Here',
      'info'
    );
  }

  updateCompanyList(compData: any) {
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

  setChequeNumber(data: any) {
    this.chqNumber = data;
    this.inChq[this.inChq.length - 1].num = this.chqNumber;
  }

  setCheuqueDate(event: any) {
    this.chequeDate = event.target.value;
    this.inChq[this.inChq.length - 1].date = this.chequeDate;
    this.inChq[this.inChq.length - 1].chqDate = this.getFormatteDate(
      event.target.value
    );
  }

  setBankCode(event: any) {
    this.bankCode = event;
    this.inChq[this.inChq.length - 1].bank = this.bankCode;
  }

  setAmount(event: any) {
    this.depAmount = event;
    this.inChq[this.inChq.length - 1].amount = this.depAmount;
    this.setDepsoitAmount();
  }

  updateInchqSlipNumber() {
    for (let i = 0; i < this.inchqRequestBean.length; i++) {
      this.inchqRequestBean[i].slipnum = this.receiveDepositData?.value.slipnum;
    }
  }

  updateListControl(val: any) {
    console.log('Comapny Called');
    this.sectionEntryForm.patchValue({
      depositorId: val[0].toString(),
      depositorName: val[1].toString().trim(),
    });
    this.getRecieptNumbers(val[0].toString().trim());
    this.getDepositorAgeAndBirthDate(val[0].toString().trim());
    this.depositDetail = val;
  }

  getRecieptNumbers(depositorId: string) {
    this.recieptDyanPop =
      'dep_depositor=' +
      depositorId +
      ' AND ' +
      ` dep_coy='${this.sectionEntryForm?.value.companyCode?.trim()}'`;
    this.dynapop
      .getDynaPopListObj('FDRECEIPTNUM ', this.recieptDyanPop)
      .subscribe((res: any) => {
        this.recieptColumnHeader = [res.data.colhead1, res.data.colhead2];
        for (let i = 0; i < res.data.dataSet.length; i++) {
          this.receiptNumList.push(res.data.dataSet[i][0].trim());
        }
        this.recieptTableData = res.data;
      });
  }

  getDepositorAgeAndBirthDate(depositorId: string) {
    if (
      this.sectionEntryForm?.value.companyCode != null &&
      this.sectionEntryForm?.value.depositorId != null &&
      this.sectionEntryForm?.value.companyCode != '' &&
      this.sectionEntryForm?.value.depositorId != ''
    ) {
      this.fetchRequestAPI =
        'depositor/age-by-depositorid-and-companycode?depositorId=' +
        depositorId +
        '&companyCode=' +
        this.sectionEntryForm.value.companyCode;
      this.actionService
        .getAgeAndBirthDate(this.fetchRequestAPI)
        .subscribe((res: any) => {
          this.sectionEntryForm.patchValue({
            dob: res.data.birthDate == undefined ? '' : res.data.birthDate,
            age: res.data.age == undefined ? '' : res.data.age[0].toString(),
            rateOfInterest:
              res.data.rateOfInterest == undefined
                ? ''
                : res.data.rateOfInterest,
          });
          this.depositEntryForm.patchValue({
            intrate: res.data.rateOfInterest,
          });
        });
    }
  }

  updateReciept(val: any) {
    this.passRetrieveApiUrl =
      'deposit/fetch-deposit-by-companycode-and-depositorid-and-receiptno' +
      '?depositorId=' +
      this.sectionEntryForm.value.depositorId?.trim() +
      '&companyCode=' +
      this.sectionEntryForm.value.companyCode?.toString().trim() +
      '&recieptNo=' +
      val[0].toString().trim();
  }

  tabContainerFlagRefresh(flagVal: any) {
    this.tabContentFlag = flagVal;
  }

  resetAddErrorField(event: any) {
    console.log(this.isAddClicked);
    this.sectionEntryForm.patchValue({
      recieptNum: '',
    });
  }

  // acceptChequeData(data: any) {
  //   this.inchqRequestBean = data;
  //   let amount: number = 0;
  //   for (let i = 0; i < this.inchqRequestBean.length; i++) {
  //     amount = amount + Number(this.inchqRequestBean[i].amount);
  //     this.inchqRequestBean[i].chqDate = this.datePipe.transform(
  //       this.inchqRequestBean[i].date,
  //       'dd/MM/yyyy'
  //     );
  //     this.inchqRequestBean[i].coy = this.sectionEntryForm?.value.companyCode;
  //     this.inchqRequestBean[i].proprietor =
  //       this.sectionEntryForm?.value.companyCode;
  //   }
  //   if (this.d1 != undefined) {
  //     this.d1.setDepositAmount(amount);
  //   }
  // }

  // isDataValid(isValid: boolean) {
  //   this.d1.setChequeDataValidation(isValid);
  // }

  receiveDepositEntryData($event: any) {
    this.receiveDepositData = $event;
  }

  checkIsInchqDataValid(): boolean {
    if (this.inChq[this.inChq.length - 1].bank == '') {
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Bank Name Cannot be Left Empty',
        this.error_modal,
        'bank' + (this.inChq.length - 1)
      );

      return false;
    } else if (this.inChq[this.inChq.length - 1].num == '') {
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Cheque Number Cannot be Left Blank',
        this.error_modal,
        'chqNum' + (this.inChq.length - 1)
      );
      return false;
    } else if (this.inChq[this.inChq.length - 1].amount == 0) {
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Deposit Amount Cannot be Left Blank',
        this.error_modal,
        'amt' + (this.inChq.length - 1)
      );
      return false;
    } else if (
      !moment(
        this.inChq[this.inChq.length - 1]?.date,
        'dd/MM/yyyy',
        true
      ).isValid()
    ) {
      this.inChq[this.inChq.length - 1].date = '';
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Cheque Date Should be Only Entered in dd/MM/yyyy Format',
        this.error_modal,
        ''
      );
      return false;
    } else if (this.inChq[this.inChq.length - 1].amount % 50000 != 0) {
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Deposit Amount Entered should be multiple of 50,000',
        this.error_modal,
        'amt' + (this.inChq.length - 1)
      );
      return false;
    }
    return true;
  }

  checkValidDate() {
    if (
      !moment(
        this.inChq[this.inChq.length - 1]?.date,
        'dd/MM/yyyy',
        true
      ).isValid()
    ) {
      (this.inChq[this.inChq.length - 1].date = ''),
        this.modalService.showErrorDialog(
          constant.ErrorDialog_Title,
          'Cheque Date Should be Only Entered in dd/MM/yyyy Format',
          'error'
        );
    }
  }

  checkIsDepositDataValid(): boolean {
    if (
      this.depositEntryForm.controls['bankcode'].errors &&
      this.depositEntryForm.controls['bankcode'].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'Bank Code is Required',
        this.focusField('bankC123'),
        this.error_modal
      );
      return false;
    } else if (
      this.depositEntryForm.controls['slipnum'].errors &&
      this.depositEntryForm.controls['slipnum'].errors?.['required']
    ) {
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'VoucherNo Cannot be left blank',
        this.focusField('vowNum12'),
        this.error_modal
      );
      return false;
    } else if (this.depositEntryForm?.value.payeecode == '') {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Please Select Pay To Code',
        this.error_modal
      );
      return false;
    } else if (this.depositEntryForm?.value.depmonths == '') {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Duration Cannot be left blank',
        this.error_modal
      );
      return false;
    } else {
      return true;
    }
  }
  upateBankList(val: any) {
    this.depositEntryForm.patchValue({
      bankcode: val[0].toString(),
    });
    this.getVouchersList();
  }

  updateOrigin(val: any) {
    this.depositEntryForm.patchValue({
      deporigin: val[0].toString(),
    });
  }

  checkGuradianId(event: any) {
    console.log('Testing ', event.target.value);
    if (event.target.value != '') {
      if (event.target.value !== 'M' && event.target.value !== 'F') {
        this.modalService.showErrorDialog(
          constant.ErrorDialog_Title,
          'Enter Either M/F only',
          'info'
        );
      }
    }
  }

  getVouchersList() {
    this.voucher_condition = `VSLP_COY='${this.sectionEntryForm?.value.companyCode}' AND VSLP_BANK='${this.depositEntryForm?.value.bankcode}'`;
    this.dynapop
      .getDynaPopListObj('PAYINSLIPNUM', this.voucher_condition)
      .subscribe((res: any) => {
        this.voucherColumnHeader = [res.data.colhead1, res.data.colhead2];
        this.voucherData = res.data;
        if (this.isRetrievClicked) {
          let isChqPresnet =
          this.depositFetchedData?.inchqResponseBean ? this.depositFetchedData?.inchqResponseBean.length > 0 : false
          if (isChqPresnet) {
            this.depositEntryForm.patchValue({
              slipnum: this.depositFetchedData?.inchqResponseBean[0].slipnum,
            });
          }
        }
      });
  }
  updateDuration(val: any) {
    if (val != undefined && val != null) {
      this.depositEntryForm.patchValue({
        depmonths: val[0].trim(),
      });
      this.setMaturityDate();
    } else {
      this.focusInputs(0);
    }
  }

  setInchqData() {
    for (let i = 0; i < this.inChq.length; i++) {
      (this.inChq[i].slipnum = this.depositEntryForm?.value.slipnum),
        (this.inChq[i].coy = this.sectionEntryForm?.value.companyCode),
        (this.inChq[i].proprietor = this.sectionEntryForm?.value.companyCode);
    }
  }

  setMaturityDate() {
    if (this.isAddClicked) {
      if (this.depositEntryForm?.value.depdate < this.inChq[0].date) {
        this.depositEntryForm.patchValue({
          depdate: new Date(),
        });
        this.modalService.showErrorDialogCallBack(
          constant.ErrorDialog_Title,
          ' Deposit Date Should be greater than Cheque Date',
          document.getElementById('depositDate')?.focus(),
          'error'
        );
      } else {
        this.depositEntryForm.patchValue({
          brokcheqdate: this.depositEntryForm?.value.depdate,
        });
        let d: any;
        let d1: any;
        d1 = this.getFormatteDate(this.depositEntryForm?.value.depdate)?.split(
          '/'
        );
        d = new Date();
        d.setFullYear(Number(d1[2]));
        d.setMonth(Number(d1[1]));
        d.setDate(Number(d1[0]));
        d.setMonth(
          d.getMonth() + Number(this.depositEntryForm?.value.depmonths) - 1
        );
        d.setDate(d.getDate() - 1);
        this.depositEntryForm.patchValue({
          matdate: new Date(d),
        });
      }
    }
  }

  saveDepositDetails() {
    if (this.checkIsInchqDataValid() && this.checkIsDepositDataValid()) {
      this.loader = true;
      this.disableSave = true;
      this.http
        .post(`${environment.API_URL}${this.passSaveApiUrl}`, this.receivedData)
        .pipe(
          take(1),
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res:any) => {
            this.loader = false;
            if (res.status) {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'info'
              );
            } else {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'error'
              );
            }
          },
          error: () => {
            this.disableSave = false;
          },
        }
        );
    }
  }

  showErrorDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      window.location.reload();
    });
  }

  getPayeToList() {
    this.dynapop.getDynaPopListObj('PAYEETO', '').subscribe((res: any) => {
      this.payToColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.payToTableDate = res.data;
      if (this.isRetrievClicked) {
        this.depositEntryForm.patchValue({
          payeecode: this.depositFetchedData?.payeecode,
        });
      }
      if (this.isAddClicked) {
        this.depositEntryForm.patchValue({
          payeecode: 'E',
        });
      }
    });
  }
  getOriginList() {
    this.dynapop
      .getDynaPopListObj('ORIGIN', this.orig_condition)
      .subscribe((res: any) => {
        this.originColumnHeader = [res.data.colhead1, res.data.colhead2];
        this.originTableData = res.data;
        if (this.isRetrievClicked) {
          this.depositEntryForm.patchValue({
            deporigin: this.depositFetchedData?.deporigin,
          });
        }
        if (this.isAddClicked) {
          this.depositEntryForm.patchValue({
            deporigin: 'N',
          });
        }
      });
  }

  getLiquidityList() {
    this.dynapop.getDynaPopListObj('LIQUIDITY', '').subscribe((res: any) => {
      this.liquidityColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.liquidityTableDate = res.data;
      if (this.isRetrievClicked) {
        this.depositEntryForm.patchValue({
          liqtype: this.depositFetchedData?.liqtype,
        });
      }
      if (this.isAddClicked) {
        this.depositEntryForm.patchValue({
          liqtype: 'M',
        });
      }
    });
  }

  setDepsoitAmount(): number {
    let depAmount: number = 0;
    for (let i = 0; i < this.inChq.length; i++) {
      depAmount = depAmount + Number(this.inChq[i].amount);
    }
    this.t1 = depAmount;
    this.depositEntryForm.patchValue({
      depamount: depAmount.toString() != '0' ? depAmount.toString() : '',
    });
    this.setMaturityAmount();
    return depAmount;
  }

  setMaturityAmount() {
    let amount = Number(this.depositEntryForm?.value.depamount);
    let roi = Number(this.depositEntryForm?.value.intrate);
    let duration = Number(this.depositEntryForm?.value.depmonths);
    if (amount % 50000 == 0) {
      let grossInterest = amount * (roi / 100) * (duration / 12);
      let maturityAmount = grossInterest + amount;
      this.depositEntryForm.patchValue({
        matamount: maturityAmount.toString(),
        grossint: grossInterest,
      });
    }
  }

  addRow() {
    if (this.isRetrievClicked) {
      this.depositFetchedData.inchqResponseBean.push({
        bank: '',
        outstat: 'N',
      });
    } else {
      if (this.checkIsInchqDataValid()) {
        this.totalAmount = this.setDepsoitAmount();
        this.bankCode = '';
        this.depAmount = '';
        this.chequeDate = new Date();
        this.chqNumber = '';
        this.inChq.push({
          bank: this.bankCode,
          date: this.chequeDate,
          outstat: 'N',
          num: this.chqNumber,
          amount: this.depAmount,
          userid: sessionStorage.getItem('userName'),
          chqDate: this.getFormatteDate(new Date()),
          coy: '',
          proprietor: '',
          slipnum: '',
        });
        this.focusInputs('bank' + (this.inChq.length - 1));
      }
    }
  }

  deleteRow(d: any) {
    const index = this.inChq.indexOf(d);
    if (this.inChq.length == 1) {
      this.toastr.showError(
        'Atleast one cheque must be present in incoming cheque details window'
      );
      this.focusInputs(this.inChq.length - 1);
    } else {
      this.inChq.splice(index, 1);
      this.setDepsoitAmount();
      this.focusInputs(this.inChq.length - 1);
    }
  }

  getInFreqList() {
    this.dynapop.getDynaPopListObj('INTFREQ', '').subscribe((res: any) => {
      this.inFreqColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.inFreqTableDate = res.data;
      if (this.isRetrievClicked) {
        this.depositEntryForm.patchValue({
          intfreq: this.depositFetchedData?.intfreq,
        });
      }
      if (this.isAddClicked) {
        this.depositEntryForm.patchValue({
          intfreq: '6',
        });
      }
    });
  }

  checkAmount() {
    if (this.inChq[this.inChq.length - 1].amount % 50000 != 0) {
      this.showErrorFieldDialog(
        constant.ErrorDialog_Title,
        'Deposit Amount Entered should be multiple of 50,000',
        this.error_modal,
        'amt' + (this.inChq.length - 1)
      );
    }
  }

  getDurationist() {
    this.dynapop.getDynaPopListObj('DURATION', '').subscribe((res: any) => {
      this.durationColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.durationTableDate = res.data;
      if (this.isRetrievClicked) {
        this.depositEntryForm.patchValue({
          depmonths: this.depositFetchedData?.depmonths,
        });
      }
      if (this.isAddClicked) {
        this.depositEntryForm.patchValue({
          depmonths: '12',
        });
      }
    });
  }

  getBrokersList() {
    this.broker_condition =
      'brok_code LIKE ' +
      "'" +
      this.sectionEntryForm?.value.companyCode?.trim() +
      '%' +
      "'";
    console.log('Broker Condition: ', this.broker_condition);
    this.dynapop
      .getDynaPopListObj('BROKERS', this.broker_condition)
      .subscribe((res: any) => {
        let brokerName: string = '';
        this.brokerColumnHeader = [res.data.colhead1, res.data.colhead2];
        this.brokerTableDate = res.data;
        if (this.isRetrievClicked) {
          for (let i = 0; i < res.data.dataSet.length; i++) {
            if (
              res.data.dataSet[i][0].trim() === this.depositFetchedData?.broker
            ) {
              brokerName = res.data.dataSet[i][1].trim();
            }
          }
          this.depositEntryForm.patchValue({
            broker: this.depositFetchedData?.broker,
            brokerName: brokerName,
          });
        }
      });
  }

  updateBrokerList(event: any) {
    this.depositEntryForm.patchValue({
      brokerName: event[1].toString().trim(),
    });
  }

  updatePayTo(event: any) {
    this.depositEntryForm.patchValue({
      payeecode: event[0].toString().trim(),
    });
  }

  updateInterestFreq(event: any) {
    this.depositEntryForm.patchValue({
      intfreq: event[0].toString().trim(),
    });
  }

  updateLiquididty(event: any) {
    this.depositEntryForm.patchValue({
      liqtype: event[0].toString().trim(),
    });
  }

  getDepositSlipNum() {
    return this.depositEntryForm?.value.slipnum;
  }

  getBankList() {
    this.dynapop
      .getDynaPopListObj(
        'BANKS',
        `bank_company='${this.sectionEntryForm?.value.companyCode}'`
      )
      .subscribe((res: any) => {
        console.log(res.data);
        this.bankColumnHeader = [res.data.colhead1, res.data.colhead2];
        this.bankTableData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
        if (this.isRetrievClicked) {
          this.depositEntryForm.patchValue({
            bankcode: this.depositFetchedData?.bankcode,
          });
        }
        this.getVouchersList();
      });
  }

  getFormatteDate(date: any) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  showErrorFieldDialog(
    titleVal: any,
    message: string,
    type: string,
    id: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.focusInputs(id);
    });
  }
}
