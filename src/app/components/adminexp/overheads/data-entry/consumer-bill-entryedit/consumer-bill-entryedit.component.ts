import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { interval, of, range, Subject, Subscription, take } from 'rxjs';
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { error } from 'jquery';
import Swal from 'sweetalert2';
import  *  as CryptoJS from  'crypto-js';
//import {ConsumerDepositEntryeditComponent} from 'src/app/app/components/adminexp/overheads/data-entry/consumerdepositentryedit';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    yearMonthLabel: 'YYYYMM',
  },
};

@Component({
  selector: 'app-consumer-bill-entryedit',
  templateUrl: './consumer-bill-entryedit.component.html',
  styleUrls: ['./consumer-bill-entryedit.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ConsumerBillEntryeditComponent
  implements OnInit, OnChanges, OnDestroy
{
  billTypeF1List: any;
  billTypeF1abc: any;
  ConnnoF1abc: any; 
  billTypeColHeadings!: any[];
  ConnTableDataList: any;
  billwiseconnFilter!: string;
  strBilltype!: string;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  ConnColumnHeader: any;
  ConnBillData!: any[];
  decCummamt!: number;
  IntcumulativeAmt!: number;
  StrLocTotalbill!: number;
  StrLocTotalAdv!: number;
  decActPayamt!: number;
  decLocGSTActBillAmt!: number;
  decLocTotalbill!: number;
  DecLocGSTActBillAmt!: number;
  decLocTotalAdv!: number;
  prvAdvanceMaxPeriod!: number;
  prvActPayMaxPeriod!: number;
  DecLocCGSTAmt!: number;
  DecLocSGSTAmt!: number;
  DecPriActCummAmt!: number;
  DecPriActBillAmt!: number;
  DecLocLatestAmt!: number;
  IntEditActCumulativeAmt!: number;
  strMaxyearMonthCompany!: string;
  displayRecord!:boolean;
  //advance!: number;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  insertUpdateDelete: String = '';
  tranMode: String = '';
  overHeadConsRequestData: any;
  pipe: any;
  subs!: Subscription;
  @ViewChild('innerdiv1') innerDiv1!: ElementRef;
  @ViewChild(F1Component) comp!: F1Component;
  supplimentrybillflag: String = '';
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disableFlagDelete: boolean = false;
  disabledFlagSave: boolean = true;
  disabledFlagBack: boolean = true;
  disabledFlagExit: boolean = false;
  visibleformcontrol: boolean = false;
  visibleConnectionSelection: boolean = false;
  recordExistorNot: boolean = false;
  loaderToggle: boolean = false;
  setDepositeAmt: Subscription = of().subscribe();

  connectionSelection: FormGroup = new FormGroup({
    billType: new FormControl<String | null>('', Validators.required),
    supplementarybill: new FormControl<Boolean>({
      value: false,
      disabled: false,
    }),
    connectionNo: new FormControl<String | null>('', Validators.required),
    //  billperiod: new FormControl<Date | null>({ value: moment(), disabled: false },Validators.maxLength(6)),
    billperiod: new FormControl(moment(), Validators.required),
  });

  connectionform: FormGroup = new FormGroup({
    consumerNo: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhbillcoy: new FormControl<String | null>({ value: '', disabled: true }),
    billCoyName: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhpaycoy: new FormControl<String | null>({ value: '', disabled: true }),
    payCoyName: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhlocation: new FormControl<String | null>({ value: '', disabled: true }),
    locationName: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhload: new FormControl<String | null>({ value: '', disabled: true }),
    advance: new FormControl<String | null>({ value: '0', disabled: true }),
    ohdhdepositeamt: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    meterno: new FormControl<String | null>({ value: '', disabled: true }),
  });

  billEntryform: FormGroup = new FormGroup({
    range: new FormGroup({
      fromdate: new FormControl<Date | null>(null),
      todate: new FormControl<Date | null>(null),
    }),
    bilentdateField: new FormControl<String>('', [
      //Validators.maxLength(5),
      Validators.required,
    ]),
    billno: new FormControl<String>('', [
      Validators.maxLength(16),
      Validators.required,
    ]),
    billamt: new FormControl<number>(0, [Validators.maxLength(10)]),
    // intrest: new FormControl<String>('', [
    //   Validators.maxLength(5),
    //   Validators.required,
    // ]),
    //intrest: new FormControl<number>(0, [Validators.maxLength(6)]),
    intrest: new FormControl<String | null>({ value: '0', disabled: true }),
    cgstper: new FormControl<number>(9, [Validators.maxLength(6)]),
    cgst: new FormControl<number>(0, [Validators.maxLength(10)]),
    sgstper: new FormControl<number>(9, [Validators.maxLength(6)]),
    sgst: new FormControl<number>(0, [Validators.maxLength(10)]),
    payamt: new FormControl<number>(0, [Validators.maxLength(10)]),
    unitno: new FormControl<String>('', [Validators.maxLength(10)]),
    prvadvamt: new FormControl<String | null>({ value: '0', disabled: true }),
    prvactpay: new FormControl<String | null>({ value: '0', disabled: true }),
    cumamt: new FormControl<Number | null>({ value: 0, disabled: true }),
    advRemin: new FormControl<String | null>({ value: '0', disabled: true }),
    //prvadvamt: new FormControl<number>(0, [Validators.maxLength(10)]),
    //prvactpay: new FormControl<number>(0, [Validators.maxLength(10)]),
    //cumamt: new FormControl<number>(0, [Validators.maxLength(10)]),
    //advRemin: new FormControl<number>(0, [Validators.maxLength(10)]),
    remarks: new FormControl<String>(''),
    bilentdate: new FormControl(),
    fromdate: new FormControl<Date | null>(null),
    todate: new FormControl<Date | null>(null),
  });

  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private overheadsService: OverheadsService
  ) {
    //console.log("call Constructor");
    
    this.pollData();
  }

  ngOnInit(): void {
    this.createF1forBillType();
    //this.focusField();
    this.dtOptions = {
      pageLength: 10,
      // processing: false,
      lengthChange: false,
      //deferRender: false,
      bPaginate: true,
      bInfo: false,
      // order: [[1, 'asc']]
    };
    this.pollData();
  }
  
  decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, 'deposite').toString(CryptoJS.enc.Utf8);
  }

  pollData() {
    console.log("window.localStorage.getItem('deposite')",window.localStorage.getItem('deposite'));
    
    if (localStorage.getItem('deposite'))  {
      console.log("inside polldata");
      let data= localStorage.getItem('deposite')|| "";
      const source = interval(1000);
      this.subs = source.subscribe((val) =>
        this.connectionform.patchValue({
          //ohdhdepositeamt: window.localStorage.getItem('deposite'),
          ohdhdepositeamt:this.decrypt(data?.toString())
        })
      );
      
    }
    
  }

  tblSearch(inputid: string, tblName: string) {
    $(`#${inputid}`).on('keyup', (event: any) => {
      $(`#${tblName}`).DataTable().search(event?.target.value).draw();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('ngOnChanges');
    //console.log("this.innerDiv1.nativeElement.innerHTML :" + this.innerDiv1.nativeElement.innerHTML);
    //const isInStorage = (str: string) => localStorage.getItem(str) !== null;
    let x = localStorage.getItem('deposite');
    console.log('x', x);
    if (localStorage.getItem('deposite')) {
      this.pollData();
    }
  }

  ngAfterViewInit() {
    this.comp?.fo1?.nativeElement?.focus();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    window.localStorage.removeItem('deposite');
    this.subs.unsubscribe();
  }
  
  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('billType')
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }
  //AFTER ADD/RETRIVE BUTTON FOCUS GO TO BILL DATE
  // focusField1() {
  //   //Below getElementById should be unique id in every component
  //   let el = document.getElementById('range')
  //     ?.childNodes[0] as HTMLInputElement;
  //   el?.focus();
  // }

  displayConncode(e: any) {
    this.strohdh_connocode = e[1]?.trim();
    this.strohdh_conno = e[0]?.trim();
  }
  displayConnDetailForm(res: any) {
    console.log('displayConnDetailForm', res);
    //console.log("inside patch meter no",res.overheadmeterResponseBeanList[0]?.meterno);

    this.connectionform.patchValue({
      consumerNo: res?.ohdhconno,
      ohdhbillcoy: res?.ohdhbillcoy,
      ohdhpaycoy: res?.ohdhpaycoy,
      ohdhlocation: res?.ohdhlocation,
      ohdhload: res?.ohdhload,
      ohdhdepositeamt: res?.ohdhdepositeamt,
      meterno: res.overheadmeterResponseBeanList[0]?.meterno,
      //advance: res?.advance,
      advance: 0,
    });
  }
  dispalyLocNamePayCoyNameBillCoyNameForm(res: any) {
    //console.log("insideBillcoy",res);
    this.connectionform.patchValue({
      billCoyName: res.data[0]?.billcoyname,
      payCoyName: res.data[0]?.paycompany,
      locationName: res.data[0]?.locname,
    });
  }
  dispalyPrvBillDataForm(res: any) {
    console.log('inside prv bill data', res);
    (this.prvAdvanceMaxPeriod = res.data[0]?.ohdd_advance),
      (this.prvActPayMaxPeriod = res.data[0]?.ohdd_payamt),
      this.billEntryform.patchValue({
        prvadvamt: res.data[0]?.ohdd_prvadvamt,
        prvactpay: res.data[0]?.ohdd_PrvActPay,
        advRemin: res.data[0]?.ohdd_advance,
        cumamt: res.data[0]?.ohdd_cumamt,
        //payamt: res.data[0]?.ohdd_payamt,
      });
    (this.decCummamt = res.data[0]?.ohdd_cumamt),
      this.connectionform.patchValue({
        ohdhdepositeamt: res.data[0]?.ohdd_depositeamt,
        advance: res.data[0]?.ohdd_advance,
      });
    this.IntcumulativeAmt = res.data[0]?.ohdd_cumamt;
  }

  displayBillDetailform(res: any) {
    //console.log('inside DisplayBill entry', res);
    // console.log('res.data[0]?.fromdate.value', res.data[0]?.fromdate);

    this.billEntryform.patchValue({
      range: {
        fromdate: res.data[0]?.fromdate
          ? moment(res.data[0]?.fromdate, 'DD/MM/YYYY')
          : null,
        todate: res.data[0]?.todate
          ? moment(res.data[0]?.todate, 'DD/MM/YYYY')
          : null,
        //todate: res.data[0]?.todate ?? null,
      },
      bilentdateField: moment(res.data[0]?.bilentdate, 'DD/MM/YYYY'),
      billno: res.data[0]?.billno.trim(),
      billamt: res.data[0]?.billamt ? res.data[0]?.billamt : 0,
      intrest: res.data[0]?.intrest ? res.data[0]?.intrest : 0,
      cgstper: res.data[0]?.cgstper ? res.data[0]?.cgstper : 0,
      cgst: res.data[0]?.cgst ? res.data[0]?.cgst : 0,
      sgstper: res.data[0]?.sgstper ? res.data[0]?.sgstper : 0,
      sgst: res.data[0]?.sgst ? res.data[0]?.sgst : 0,
      payamt: res.data[0]?.payamt,
      unitno: res.data[0]?.unitno ? res.data[0]?.unitno : 0,
      prvAdvAmt: res.data[0]?.prvadvamt ? res.data[0]?.prvadvamt : 0,
      prvadvamt: res.data[0]?.prvactpay ? res.data[0]?.prvactpay : 0,
      cumamt: res.data[0]?.cumamt ? res.data[0]?.cumamt : 0,
      advRemin: res.data[0]?.advance ? res.data[0]?.advance : 0,
      remarks: res.data[0]?.remarks,
      bilentdate: moment(
        this.billEntryform.get('bilentdateField')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),
    });
    this.DecPriActCummAmt = res.data[0]?.cumamt ? res.data[0]?.cumamt : 0;
    this.DecPriActBillAmt = res.data[0]?.billamt ? res.data[0]?.billamt : 0;
  }

  fetchDepositeAmtByConncode() {
    if (this.strohdh_connocode) {
      console.log('inside fetch deposite');

      this.overheadsService
        .getDepositeAmtbyConnocode(this.strohdh_connocode.trim())
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('data', res);
            this.connectionform.patchValue({
              //ohdhdepositeamt: res.data > 0 ? res.data : 0,
              ohdhdepositeamt: res.data,
            });
          },
        });
    }
  }

  addOverheadBillDetails() {
    if (this.connectionSelection?.valid) {
      this.checkConnocodeBillperiodSupplementarybillexists();
      this.fetchDepositeAmtByConncode();

      this.tranMode = 'A';
      console.log("this.displayRecord inside add",this.displayRecord);
      
      setTimeout(() => {
        this.renderer.selectRootElement('#toDateField')?.focus();
      }, 100);

      // if (this.displayRecord==true)
      // {
      //   setTimeout(() => {
      //     this.renderer.selectRootElement('#toDateField')?.focus();
      //   }, 100);
      // }
      
      this.connectionSelection.get('billType')?.disable();
      this.connectionSelection.get('connectionNo')?.disable();
      this.connectionSelection.get('billperiod')?.disable();
      if (this.connectionSelection.get('billType')?.value == 'G') {
        this.billEntryform.get('cgstper')?.enable();
        this.billEntryform.get('cgst')?.enable();
        this.billEntryform.get('sgstper')?.enable();
        this.billEntryform.get('sgst')?.enable();
      } else {
        this.billEntryform.get('cgstper')?.disable();
        this.billEntryform.get('cgst')?.disable();
        this.billEntryform.get('sgstper')?.disable();
        this.billEntryform.get('sgst')?.disable();
        this.billEntryform.patchValue({
          cgst: 0,
          cgstper: 0,
          sgst: 0,
          sgstper: 0,
        });
      }
    } else {
      this.toastr.error('Please Enter Mandatory Fields');
      this.connectionSelection?.markAllAsTouched();
    }
    //chk max year month
    // console.log(
    //   "this.connectionform.get('ohdhpaycoy')?.value",
    //   this.connectionform.get('ohdhpaycoy')?.getRawValue()
    // );
    // this.findMaxYearMonthforCompany();
    //this.focusField1();
    //this.visibleformcontrol = true;
  }

  validateInvalidFormat(event: any, id: any, message: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.renderer.selectRootElement(`#${id}`)?.focus();
      this.toastr.error(message);
    }
  }
  findconsumerNoExist() {
    //console.log("this.connectionSelection.get('connectionNo')?.value",this.connectionSelection.get('connectionNo')?.value);

    if (this.connectionSelection.get('connectionNo')?.value) {
      //console.log('find consumer no exist', this.connectionSelection.get('connectionNo')?.value);
      this.overheadsService
        .getOverheadConsumerExist(
          this.connectionSelection.get('connectionNo')?.value
        )
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Overhead detail ',
                'Consumer No Not found',
                'info'
              );
              this.back();
              this.comp?.fo1?.nativeElement?.focus();
            } else {
              //this.findconsumerNoExist();
              localStorage.setItem(
                'billType',
                this.connectionSelection.get('billType')?.value
              );

              this.strohdh_connocode;
              localStorage.setItem(
                'connectionNo',
                this.connectionSelection.get('connectionNo')?.value
              );

              localStorage.setItem('conncode', this.strohdh_connocode);
              this.overheadsService.billtype.next(5);

              const url = this.router.serializeUrl(
                this.router.createUrlTree([
                  'adminexp/overheads/dataentry/consumerdepositentryedit',
                ])
              );
              window.open(url, '_blank');
            }
            //this.back();
            //this.comp?.fo1?.nativeElement?.focus();
            //}
          },
        });
    }
  }
  retriveOverheadBillDetails() {
    if (this.connectionSelection?.valid) {
      this.retriveBillwithAddcondition();
      this.retriveBillByConncodePeriodSupplimentry();
      this.retriveconnBilldetails();
      this.retriveLocNameBillCoyNamePayCoyName();
      //added as on 22/05/2023
      this.retrivePrvBillData();
      //end
      //fetch total deposite amt
      this.fetchDepositeAmtByConncode();
      this.tranMode = 'R';
      //console.log('inside Retrive mode', this.tranMode);
      this.actionDisabledEnabledButtons(true, true, true, false, false);
      this.visibleformcontrol = true;
      //debugger
      // this.visibleConnectionSelection = true;
      this.connectionSelection.get('billType')?.disable();
      this.connectionSelection.get('connectionNo')?.disable();
      this.connectionSelection.get('billperiod')?.disable();
      if (this.connectionSelection.get('billType')?.value == 'G') {
        this.billEntryform.get('cgstper')?.enable();
        this.billEntryform.get('cgst')?.enable();
        this.billEntryform.get('sgstper')?.enable();
        this.billEntryform.get('sgst')?.enable();
      } else {
        this.billEntryform.get('cgstper')?.disable();
        this.billEntryform.get('cgst')?.disable();
        this.billEntryform.get('sgstper')?.disable();
        this.billEntryform.get('sgst')?.disable();
        this.billEntryform.patchValue({
          cgst: 0,
          cgstper: 0,
          sgst: 0,
          sgstper: 0,
        });
      }
    } else {
      this.toastr.error('Please Enter Mandatory Fields');
      this.connectionSelection?.markAllAsTouched();
    }
  }
  deleteOverheadBill() {
    if (this.connectionSelection?.valid) {
      this.retriveOverheadBillDetails();
      this.tranMode = 'D';
      this.connectionSelection.get('billType')?.disable();
      this.connectionSelection.get('connectionNo')?.disable();
      this.connectionSelection.get('billperiod')?.disable();
    } else {
      this.toastr.error('Please Enter Mandatory Fields');
      this.connectionSelection?.markAllAsTouched();
    }
  }

  overHeadConsPayLoadData() {
    this.overHeadConsRequestData = {
      ohdhbillcoy: this.connectionform.get('ohdhbillcoy')?.value,
      ohdhbilltype: this.connectionSelection.get('billType')?.value,
      ohdhbldgcode: this.connectionSelection.get('ohdhbldgcode')?.value,
      ohdhconnocode: this.connectionform.get('ohdhconnocode')?.value,
      ohdhlocation: this.connectionform.get('location')?.value,
      ohdhpaycoy: this.connectionform.get('ohdhpaycoy')?.value,
      ohdhstatus: this.connectionform.get('ohdhstatus')?.value,
    };
    return this.overHeadConsRequestData;
  }
  onFocusOutEvent(event: any) {
    this.billEntryform.patchValue({
      remarks:
        'Bill Amt.' +
        this.billEntryform.get('billamt')?.value +
        ',' +
        'int.' +
        this.billEntryform.get('intrest')?.value +
        'Pay Amt. ' +
        ',' +
        this.billEntryform.get('payamt')?.value,
    });
  }

  onfocusoutGstamt(event: any) {
    this.DecLocGSTActBillAmt =
      Number(this.billEntryform.get('billamt')?.value) +
      Number(this.billEntryform.get('intrest')?.value);
    this.DecLocCGSTAmt = Number(this.billEntryform.get('cgst')?.value);
    this.DecLocSGSTAmt = Number(this.billEntryform.get('sgst')?.value);
    this.DecLocGSTActBillAmt =
      this.DecLocGSTActBillAmt + this.DecLocCGSTAmt + this.DecLocSGSTAmt;
    this.StrLocTotalbill = this.DecLocGSTActBillAmt;
    if (this.StrLocTotalAdv > 0 && this.StrLocTotalbill < this.StrLocTotalAdv) {
      this.billEntryform.patchValue({
        payamt: this.StrLocTotalbill - this.StrLocTotalAdv,
      });
    } else {
      if (this.StrLocTotalbill > this.StrLocTotalAdv) {
        this.billEntryform.patchValue({
          payamt: this.StrLocTotalbill - this.StrLocTotalAdv,
          advRemin: 0,
        });
      } else {
        this.billEntryform.patchValue({
          payamt: 0,
          advRemin: 0,
        });
      }
    }
  }

  onfocusOutBillamountevent(event: any) {
    //IntcumulativeAmt
    if (this.connectionSelection.get('billType')?.value != 'G') {
      this.billEntryform.patchValue({
        cgst: 0,
        cgstper: 0,
        sgst: 0,
        sgstper: 0,
      });
    }
    if (this.tranMode == 'A') {
      this.billEntryform.patchValue({
        payamt: 0,
      });

      this.billEntryform.patchValue({
        cumamt:
          Number(this.IntcumulativeAmt) +
          Number(this.billEntryform.get('billamt')?.value) +
          Number(this.billEntryform.get('cgst')?.value) +
          Number(this.billEntryform.get('sgst')?.value),
      });

      console.log('advance', this.connectionform.get('advance')?.value);
      console.log('cgst', this.billEntryform.get('cgst')?.value);
      console.log('sgst', this.billEntryform.get('sgst')?.value);
      console.log('billamt', this.billEntryform.get('billamt')?.value);
      console.log('this.decCummamt', this.decCummamt);
      console.log('payamt', this.billEntryform.get('payamt')?.value);
    } else {
      this.DecLocLatestAmt = this.DecPriActCummAmt - this.DecPriActBillAmt;
      this.IntEditActCumulativeAmt =
        this.DecLocLatestAmt +
        Number(this.billEntryform.get('billamt')?.value) +
        Number(this.billEntryform.get('cgst')?.value) +
        Number(this.billEntryform.get('sgst')?.value);
      this.billEntryform.patchValue({
        cumamt: this.IntEditActCumulativeAmt,
      });
      this.billEntryform.patchValue({
        payamt: 0,
      });
    }
    this.decLocGSTActBillAmt =
      Number(this.billEntryform.get('billamt')?.value) +
      Number(this.billEntryform.get('intrest')?.value);
    this.DecLocCGSTAmt = Math.round(
      (Number(this.billEntryform.get('billamt')?.value) *
        Number(this.billEntryform.get('cgstper')?.value)) /
        100
    );
    this.billEntryform.patchValue({
      cgst: this.DecLocCGSTAmt,
    });
    this.DecLocSGSTAmt = Math.round(
      (Number(this.billEntryform.get('billamt')?.value) *
        Number(this.billEntryform.get('sgstper')?.value)) /
        100
    );
    this.billEntryform.patchValue({
      sgst: this.DecLocSGSTAmt,
    });

    this.decLocGSTActBillAmt =
      this.decLocGSTActBillAmt + this.DecLocCGSTAmt + this.DecLocSGSTAmt;
    this.StrLocTotalbill = this.decLocGSTActBillAmt;
    //advRemin
    //StrLocTotalAdv = CDec(txtohdd_payamt.Text) + CDec(txtAdvRem.Text)
    this.StrLocTotalAdv =
      Number(this.billEntryform.get('payamt')?.value) +
      Number(this.billEntryform.get('advRemin')?.value);

    if (this.StrLocTotalAdv > 0 && this.StrLocTotalbill < this.StrLocTotalAdv) {
      console.log('inside29');
      this.billEntryform.patchValue({
        advRemin: this.StrLocTotalAdv - this.StrLocTotalbill,
      });
    } else {
      if (this.StrLocTotalbill > this.StrLocTotalAdv) {
        console.log('inside30');
        this.billEntryform.patchValue({
          payamt: this.StrLocTotalbill - this.StrLocTotalAdv,
          advRemin: 0,
        });
      } else {
        console.log('inside31');

        this.billEntryform.patchValue({
          payamt: 0,
          advRemin: 0,
        });
      }
    }
  }

  onfocusGstperevent(
    event: any,
    CGSTpercontrolName: any,
    CGSTAmtpatchControlName: any,
    SGSTpercontrolName: any,
    SGSTAmtpatchControlName: any
  ) {
    this.billEntryform.patchValue({
      payamt: 0,
    });
    this.DecLocGSTActBillAmt =
      Number(this.billEntryform.get('billamt')?.value) +
      Number(this.billEntryform.get('intrest')?.value);

    this.billEntryform
      .get(CGSTAmtpatchControlName)
      ?.patchValue(
        Math.round(
          (this.DecLocGSTActBillAmt *
            Number(this.billEntryform.get(CGSTpercontrolName)?.value)) /
            100
        )
      );
    this.billEntryform
      .get(SGSTAmtpatchControlName)
      ?.patchValue(
        Math.round(
          (this.DecLocGSTActBillAmt *
            Number(this.billEntryform.get(SGSTpercontrolName)?.value)) /
            100
        )
      );
    console.log(' onfocusGstperevent inside1', this.DecLocGSTActBillAmt);

    this.DecLocGSTActBillAmt =
      this.DecLocGSTActBillAmt +
      Number(this.billEntryform.get('cgst')?.value) +
      Number(this.billEntryform.get('sgst')?.value);
    console.log(
      ' onfocusGstperevent cgst',
      this.billEntryform.get('cgst')?.value
    );
    console.log(
      ' onfocusGstperevent sgst',
      this.billEntryform.get('sgst')?.value
    );
    console.log(' onfocusGstperevent inside2', this.DecLocGSTActBillAmt);
    this.StrLocTotalbill = this.DecLocGSTActBillAmt;

    this.StrLocTotalAdv =
      Number(this.billEntryform.get('payamt')?.value) +
      Number(this.billEntryform.get('advRemin')?.value);

    console.log(
      "this.billEntryform.get('payamt')?.value",
      this.billEntryform.get('payamt')?.value
    );
    console.log(
      "this.billEntryform.get('advRemin')?.value",
      this.billEntryform.get('advRemin')?.value
    );
    console.log('onfocusGstperevent inside3', this.StrLocTotalAdv);

    if (this.StrLocTotalAdv > 0 && this.StrLocTotalbill < this.StrLocTotalAdv) {
      console.log('test1');

      this.billEntryform.patchValue({
        advRemin: this.StrLocTotalAdv - this.StrLocTotalbill,
        payamt: 0,
      });
    } else {
      if (this.StrLocTotalbill > this.StrLocTotalAdv) {
        console.log('test2');
        this.billEntryform.patchValue({
          payamt: this.StrLocTotalbill - this.StrLocTotalAdv,
          advRemin: 0,
        });
      } else {
        console.log('test3');
        this.billEntryform.patchValue({
          payamt: 0,
          advRemin: 0,
        });
      }
    }
    console.log(
      'onfocusGstperevent inside4',
      this.billEntryform.get('payamt')?.value
    );
    //this.onfocusOutBillamountevent(event);
  }

  deposite() {
    //console.log('test deposte');
    this.findconsumerNoExist();
  }
  saveOverheadBill() {
    // console.log('Form: ',this.connectionSelection.get('billType')?.value );
    // if (this.connectionSelection.get('billType')?.value != 'G') {
    //   console.log('Form: ',this.connectionSelection.get('billType')?.value );
    //   this.billEntryform.patchValue({
    //     cgst: this.billEntryform.get('cgst')?.getRawValue(),
    //     cgstper: this.billEntryform.get('cgstper')?.getRawValue(),
    //     sgst: this.billEntryform.get('sgst')?.getRawValue(),
    //     sgstper: this.billEntryform.get('sgstper')?.getRawValue(),
    //   });
    // }
    console.log('inside save payload1', this.billEntryform);
    this.billEntryform.patchValue({
      fromdate: moment(
        this.billEntryform.get('range')?.value.fromdate,
        'yyyy-MM-dd',
        true
      ).isValid()
        ? moment(
            this.billEntryform.get('range')?.value.fromdate,
            'DD/MM/YYYY'
          ).format('DD/MM/YYYY')
        : null,
      todate: moment(
        this.billEntryform.get('range')?.value.fromdate,
        'yyyy-MM-dd',
        true
      ).isValid()
        ? moment(
            this.billEntryform.get('range')?.value.todate,
            'DD/MM/YYYY'
          ).format('DD/MM/YYYY')
        : null,
    });
    this.billEntryform.patchValue({
      bilentdate: moment(
        this.billEntryform.get('bilentdateField')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),
    });
    //console.log('Form: ', this.billEntryform);
    if (this.billEntryform?.valid) {
      console.log('inside save payload', this.billEntryform);
      //connectionSelection
      let userid = sessionStorage.getItem('userName');
      //console.log("this.supplimentrybillflag",this.supplimentrybillflag);

      if (this.supplimentrybillflag == '') {
        this.supplimentrybillflag = 'N';
      }
      //if (this.billEntryform.valid) {
      //console.log('form', this.billEntryform);
      // console.log(
      //   "this.billEntryform.get('cumamt')?.value",
      //   this.billEntryform.get('cumamt')?.value
      // );

      let savePayload = {
        ...this.billEntryform.value,
        userid,

        billperiod: moment(
          this.connectionSelection.get('billperiod')?.value
        ).format('YYYYMM'),
        //this.connectionSelection.get('billperiod')?.value,
        connocode: this.strohdh_connocode,
        // fromdate: moment(),
        // todate: moment(),
        hsncode: '999',
        noofprint: '0',
        advance: this.billEntryform.get('advRemin')?.value,
        prvadvamt: this.prvAdvanceMaxPeriod,
        prvactpay: this.prvActPayMaxPeriod,
        cumamt: this.billEntryform.get('cumamt')?.value,

        cgst: this.billEntryform.get('cgst')?.getRawValue(),
        cgstper: this.billEntryform.get('cgstper')?.getRawValue(),
        sgst: this.billEntryform.get('sgst')?.getRawValue(),
        sgstper: this.billEntryform.get('sgstper')?.getRawValue(),

        supplementarybill: this.supplimentrybillflag,
        overheadconsRequestBean: this.overHeadConsPayLoadData(),
      };

      console.log('save', savePayload);

      // return;
      if (this.tranMode == 'A') {
        // console.log('save mode flag ', this.tranMode);
        // console.log('savePayload insert ', savePayload);
        this.loaderToggle = true;
        this.overheadsService.addOverheadBill(savePayload).subscribe({
          next: (res) => {
            //console.log('save res', res);
            this.loaderToggle = false;
            if (res.status) {
              // this.modalService.showErrorDialog(
              //   'Overhead Bill Inserted',
              //   res['message'],
              //   'info'
              // );
              // this.back();
              Swal.fire({
                title: 'Consumer Bill Information',
                text: res['message'],
                icon: 'success',
                confirmButtonColor: '#e23335',
                confirmButtonText: 'Ok',
              }).then((e) => {
                e.isConfirmed ? this.back() : '';
              });
            }
          },
          error: (error: any) => {
            this.loaderToggle = false;
          },
        });
      } else if (this.tranMode == 'R') {
        //console.log('inside Rerive save', this.tranMode);
        this.loaderToggle = true;
        this.overheadsService.updateOverheadBill(savePayload).subscribe({
          next: (res) => {
            //console.log('save res', res);
            this.loaderToggle = false;
            if (res.status) {
              // this.modalService.showErrorDialog(
              //   'Overhead Bill Inserted',
              //   res['message'],
              //   'info'
              // );
              // this.back();
              Swal.fire({
                title: 'Consumer Bill Information',
                text: res['message'],
                icon: 'success',
                confirmButtonColor: '#e23335',
                confirmButtonText: 'Ok',
              }).then((e) => {
                e.isConfirmed ? this.back() : '';
              });
            }
          },
          error: (error: any) => {
            this.loaderToggle = false;
          },
        });
      } else if (this.tranMode == 'D') {
        console.log('inside delete');

        let billPeriod = moment(
          this.connectionSelection.get('billperiod')?.value
        ).format('YYYYMM');
        if (this.supplimentrybillflag == '') {
          this.supplimentrybillflag = 'N';
        }

        this.loaderToggle = true;
        this.overheadsService
          .deleteoverheadBill(
            this.strohdh_connocode,
            billPeriod,
            this.supplimentrybillflag
          )
          .subscribe({
            next: (res) => {
              console.log('save res', res);
              this.loaderToggle = false;
              if (res.status) {
                // this.modalService.showErrorDialog(
                //   'Overhead Bill Deleted',
                //   res['message'],
                //   'info'
                // );
                // this.back();
                Swal.fire({
                  title: 'Consumer Bill Information',
                  text: res['message'],
                  icon: 'success',
                  confirmButtonColor: '#e23335',
                  confirmButtonText: 'Ok',
                }).then((e) => {
                  e.isConfirmed ? this.back() : '';
                });
              } else {
                // this.modalService.showErrorDialog(
                //   'Overhead Bill Deleted',
                //   res['message'],
                //   'info'
                // );
                // this.back();
                Swal.fire({
                  title: 'Consumer Bill Information',
                  text: res['message'],
                  icon: 'success',
                  confirmButtonColor: '#e23335',
                  confirmButtonText: 'Ok',
                }).then((e) => {
                  e.isConfirmed ? this.back() : '';
                });
              }
            },
            error: (error: any) => {
              this.loaderToggle = false;
            },
          });
      }
    } else {
      this.toastr.error('Please Fill all Mandatory Fields');
      this.billEntryform?.markAllAsTouched();
    }
  }

  retriveconnBilldetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    //console.log("retriveconnBilldetails",this.connectionSelection.get('billperiod')?.value);

    let billPeriod = moment(
      this.connectionSelection.get('billperiod')?.value
    ).format('YYYYMM');
    if (this.strohdh_connocode) {
      this.overheadsService
        .getConsumerDetailBillDetailbyConnCode(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.data) {
              //console.log("retriveconnBilldetails",res.data);
              this.ConnBillData = res.data;
              
              //console.log("before sort",this.ConnBillData);
              //********syntax to sort data
              //this.ConnBillData.sort((a, b) => b.billperiod.toString().localeCompare(a.billperiod.toString())) 
              //console.log(this.ConnBillData.sort((a, b) => b.billperiod.toString().localeCompare(a.billperiod.toString())) );
              //**********
              
              //this.dtTrigger.next('');
              console.log("this.ConnBillData",this.ConnBillData);
              //console.log("after sort",this.ConnBillData);
            } else {
              //res['message']
              //this.toastr.error('Record Not  Found for this connection');
              this.toastr.error(res['message']);
              this.back();
              this.comp?.fo1?.nativeElement?.focus();
            }
          },
        });
    }
  }

  retriveBillwithAddcondition() {
    //console.log('test', this.connectionSelection);

    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    if (this.strohdh_connocode) {
      //console.log("connocode for add", this.strohdh_connocode);
      this.overheadsService
        .getConsumerDetailbyconnCode(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            //console.log('data for add', res);
            if (res.data) {
              this.displayConnDetailForm(res.data);
              console.log(
                'testsandy',
                this.connectionform.get('ohdhpaycoy')?.getRawValue()
              );
              if (this.tranMode == 'A') {
                this.findMaxYearMonthforCompany();
              }
            } else {
              //this.toastr.error('Record Not  Found');
              if (!res.status) {
                this.modalService.showErrorDialog(
                  'Overhead detail ',
                  res['message'],
                  'info'
                );
                this.back();
                this.comp?.fo1?.nativeElement?.focus();
              }
              this.back();
              this.comp?.fo1?.nativeElement?.focus();
            }
          },
        });
    }
  }
  getsupplimetryflag(e: any) {
    // console.log('e', e);
    if (e.target.checked) {
      this.supplimentrybillflag = 'Y';
    } else {
      this.supplimentrybillflag = 'N';
    }
    //console.log('sup', this.supplimentrybillflag);
  }
  retriveLocNameBillCoyNamePayCoyName() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    if (this.strohdh_connocode) {
      this.overheadsService
        .getLocnamePaycoynameBillcoyname(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            //console.log('data for coybillloc', res);
            //console.group("insertUpdateDelete",this.insertUpdateDelete);
            if (res.data) {
              //console.log("inside retrive", this.insertUpdateDelete);
              this.dispalyLocNamePayCoyNameBillCoyNameForm(res);
            } else {
              // this.toastr.error('Record Not  Found');
              // this.back();
              if (!res.status) {
                this.modalService.showErrorDialog(
                  'Overhead detail ',
                  res['message'],
                  'info'
                );
                this.back();
              }
            }
          },
        });
    }
  }
  retrivePrvBillData() {
    console.log('retrivePrvBillData');

    if (this.strohdh_connocode) {
      //console.log('retrivePrvBillconncode', this.strohdh_connocode);
      this.overheadsService
        .getPrvBillData(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            //console.log('data for coybillloc', res);
            //console.group("insertUpdateDelete",this.insertUpdateDelete);
            if (res.data) {
              this.dispalyPrvBillDataForm(res);
            } else {
              // this.toastr.error('Record Not  Found');
              // this.back();
              if (!res.status) {
                this.modalService.showErrorDialog(
                  'Overhead detail ',
                  res['message'],
                  'info'
                );
                this.back();
              }
            }
          },
        });
    }
  }

  findMaxYearMonthforCompany() {
    ////strMaxyearMonthCompany
    console.log(
      "this.connectionform.get('ohdhpaycoy')?.value",
      this.connectionform.get('ohdhpaycoy')?.getRawValue()
    );

    this.overheadsService
      .getMaxYearMonthfromOverheadCoy(
        this.connectionform.get('ohdhpaycoy')?.getRawValue()
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('inside max', res);

            this.strMaxyearMonthCompany = res;
            console.log(
              'this.strMaxyearMonthCompany',
              this.strMaxyearMonthCompany
            );
            console.log(
              'this.connectionSelection',
              moment(this.connectionSelection.get('billperiod')?.value).format(
                'YYYYMM'
              )
            );
            if (
              Number(this.strMaxyearMonthCompany) >
              Number(
                moment(
                  this.connectionSelection.get('billperiod')?.value
                ).format('YYYYMM')
              )
            ) {
              console.log(
                'Number(this.strMaxyearMonthCompany)',
                Number(this.strMaxyearMonthCompany)
              );
              console.log(
                'test',
                Number(
                  moment(
                    this.connectionSelection.get('billperiod')?.value
                  ).format('YYYYMM')
                )
              );

              this.modalService.showErrorDialog(
                'Overhead detail ',
                'Period Cannot be less than Company Max Period',
                'info'
              );
              this.back();
            }
          }
        },
      });
  }

  checkConnocodeBillperiodSupplementarybillexists() {
    let billPeriod = moment(
      this.connectionSelection.get('billperiod')?.value
    ).format('YYYYMM');
  
    if (this.supplimentrybillflag == '') {
      this.supplimentrybillflag = 'N';
    }
    if (this.strohdh_connocode) {
      //console.log('connocode', this.strohdh_connocode);
      this.overheadsService
        .getConsumerDetailbyConnCodeBillperiodSupplimentryBill(
          this.strohdh_connocode,
          billPeriod,
          this.supplimentrybillflag
        )
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            //console.log('data', res);
            if (res.data?.length) {
              this.recordExistorNot = true;
              this.toastr.error('Record Already Exist');
              this.displayRecord=false;
              console.log("inside dis",this.displayRecord);
              
              this.back();
            } else {
              this.retriveBillwithAddcondition();
              this.retriveconnBilldetails();
              console.log('beforre prv bill data');
              this.retriveLocNameBillCoyNamePayCoyName();
              this.retrivePrvBillData();
              this.tranMode = 'A';
              this.actionDisabledEnabledButtons(true, true, true, false, false);
              this.visibleformcontrol = true;
              this.displayRecord=true;
              console.log("inside dis",this.displayRecord);
            }
          },
        });
    }
  }

  retriveBillByConncodePeriodSupplimentry() {
    //this.actionService.getReterieveClickedFlagUpdatedValue(true);

    let billPeriod = moment(
      this.connectionSelection.get('billperiod')?.value
    ).format('YYYYMM');
    //this.connectionSelection.get('billperiod')?.value?.trim();
    if (this.supplimentrybillflag == '') {
      this.supplimentrybillflag = 'N';
    }
    if (this.strohdh_connocode) {
      //console.log('connocode', this.strohdh_connocode);

      this.overheadsService
        .getConsumerDetailbyConnCodeBillperiodSupplimentryBill(
          this.strohdh_connocode,
          billPeriod,
          this.supplimentrybillflag
        )
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            //console.log('data', res);
            //console.group("insertUpdateDelete",this.insertUpdateDelete);
            if (res.data) {
              //console.log("inside billbyconncodeperiod",res.data);

              this.displayBillDetailform(res);
            } else {
              //this.toastr.error('Record Not  Found');
              this.toastr.error(res['message']);
              this.back();
              // if (!res.status) {
              //   this.modalService.showErrorDialogCallBack(
              //     'Overhead detail ',
              //     res['message'],
              //     this.comp?.fo1?.nativeElement?.focus(),
              //     'info'
              //   );
              //   this.back();
              // }
            }
          },
        });
    }
  }

  displayBillType(e: any) {
    //console.log("billtype",e);
    this.strBilltype = e[0];
    //get Connection List
    this.billwiseconnFilter = `Ohdh_billtype='${this.strBilltype}'`;
    this.dynapop
      .getDynaPopListObj('CONSUMERNO', `Ohdh_billtype='${this.strBilltype}'`)
      .subscribe((res: any) => {
        this.ConnColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.ConnTableDataList = res.data;
        this.ConnnoF1abc = res.data.bringBackColumn;
      });
  }
  // action
  actionDisabledEnabledButtons(
    isAddFlag: boolean,
    isRetrieveFlag: boolean,
    isDelete: boolean,
    isSaveFlag: boolean,
    isBack: boolean
  ) {
    this.disabledFlagAdd = isAddFlag;
    this.disabledFlagRetrieve = isRetrieveFlag;
    this.disabledFlagSave = isSaveFlag;
    this.disableFlagDelete = isDelete;
    this.disabledFlagBack = isBack;
  }
  back() {
    this.connectionSelection.reset();
    this.connectionform.reset();
    this.billEntryform.reset();
    this.billEntryform.patchValue({
      intrest: 0,
      cgstper: 0,
      cgst: 0,
      sgstper: 0,
      sgst: 0,
      payamt: 0,
      unitno: '',
      prvadvamt: 0,
      prvactpay: 0,
      cumamt: 0,
      advRemin: 0,
    });
    this.ConnBillData = [];
    this.actionDisabledEnabledButtons(false, false, false, true, true);
    this.visibleConnectionSelection = true;
    this.connectionSelection.get('billType')?.enable();
    this.connectionSelection.get('connectionNo')?.enable();
    this.connectionSelection.get('billperiod')?.enable();
    this.billEntryform.get('cgstper')?.enable();
    this.billEntryform.get('cgst')?.enable();
    this.billEntryform.get('sgstper')?.enable();
    this.billEntryform.get('sgst')?.enable();
    this.focusField();
    this.visibleformcontrol = false;
    // console.log(
    //   'new Date().getFullYear()).toString()',
    //   new Date().getFullYear()
    // );
    // console.log('new Date().getFullYear()).toString()', new Date().getMonth());
    this.connectionSelection.patchValue({
      billperiod: moment(),
    });
    //this.comp?.fo1?.nativeElement?.focus();
    //localStorage.removeItem('deposite'); // clear local storage deposite value
  }

  createF1forBillType() {
    this.dynapop.getDynaPopListObj('OVERHEADS', '').subscribe((res: any) => {
      this.billTypeColHeadings = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this.billTypeF1List = res.data;
      this.billTypeF1abc = res.data.bringBackColumn;
    });
  }
  handleExitClick() {
    this.router.navigate(['/dashboard']);
  }

  chosenMonthHandler(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>,
    dateCtrl: any
  ) {
    if (!dateCtrl?.valid) {
      this.connectionSelection.patchValue({
        billPeriod: normalizedMonthAndYear,
      });
    }
    const ctrlValue: any = dateCtrl?.value;
    // console.log(ctrlValue);
    ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year());
    dateCtrl?.setValue(ctrlValue);
    datepicker.close();
  }
}
