import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
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
import { OverheadsService } from 'src/app/services/adminexp/overheads.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { overheadfileconstants } from '../../overheadfileconstants';
import  *  as CryptoJS from  'crypto-js';


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
  selector: 'app-consumer-deposit-entryedit',
  templateUrl: './consumer-deposit-entryedit.component.html',
  styleUrls: ['./consumer-deposit-entryedit.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class ConsumerDepositEntryeditComponent implements OnInit {
  billTypeF1List: any;
  billTypeF1abc: any;
  ConnnoF1abc: any;
  billTypeColHeadings!: any[];
  ConnTableDataList: any;
  billwiseconnFilter!: string;
  strBilltype!: string;
  billtypeFromOerheadtxn!: string;
  strohdh_connocode!: string;
  strohdh_conno!: string;
  ConnColumnHeader: any;
  ConnDepositData!: any[];
  insertUpdateDelete: String = '';
  tranMode: String = '';
  overheadconsRequestBean: any;
  overheaddepositdtlsRequestBean: any;
  chkradiabutton!: string;
  pipe: any;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disableFlagDelete: boolean = false;
  disabledFlagSave: boolean = true;
  disabledFlagBack: boolean = true;
  disabledFlagExit: boolean = false;
  visibleformcontrol: boolean = false;
  recordExistorNot: boolean = false;
  adddeductionFlag: string = 'A';
  depositeAmt: any;
  loaderToggle: boolean = false;
  @ViewChild(F1Component) comp!: F1Component;
  constructor(
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private overheadsService: OverheadsService,
    private router: Router,
    private service: ServiceService,
    private el: ElementRef
  ) {
    // console.log(
    //   'overheadfileconstants.billType constructor',
    //   overheadfileconstants.billType
    // );
    // alert('tettt2');
  }

  ngOnInit(): void {
    this.createF1forBillType();

    this.connectionSelection.patchValue({
      billType: localStorage.getItem('billType'),
      connectionNo: localStorage.getItem('connectionNo'),
      // displayConncode(e: any) {
      //   this.strohdh_connocode = e[1]?.trim();
      //   this.strohdh_conno = e[0]?.trim();
      // }
      
    });
    this.strohdh_connocode=localStorage.getItem('conncode')!;
    this.strohdh_conno = localStorage.getItem('connectionNo')!;
      console.log("fdf", this.strohdh_connocode)
    //this.billtypeFromOerheadtxn = localStorage.getItem('billType')?.toString;//"teest"; //localStorage.getItem('billType');
    if (this.connectionSelection.get('billType')?.value != null) {
      this.billtypeFromOerheadtxn = 'Y';
    } else {
      this.billtypeFromOerheadtxn = 'N';
    }
    
    localStorage.removeItem('billType');
    localStorage.removeItem('connectionNo');
    localStorage.removeItem('conncode');
    this.billEntryform?.controls['inlineRadioOptions'].valueChanges.subscribe(
      (value) => {
        console.log('test Radio', value);
        this.chkradiabutton = value;
        this.setRadioOption();
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("this.innerDiv1.nativeElement.innerHTML :" + this.innerDiv1.nativeElement.innerHTML);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngAfterViewInit() {
    this.comp?.fo1?.nativeElement?.focus();
  }
  connectionSelection: FormGroup = new FormGroup({
    billType: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(5),
    ]),
    connectionNo: new FormControl<String | null>('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    supplementarybill: new FormControl<Boolean>({
      value: false,
      disabled: false,
    }),
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
    ohdhbldgcode: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhbilltype: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhconno: new FormControl<String | null>({ value: '', disabled: true }),
    ohdhconnocode: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
    ohdhconsumerno: new FormControl<String | null>({
      value: '',
      disabled: true,
    }),
  });

  billEntryform: FormGroup = new FormGroup({
    inlineRadioOptions: new FormControl('option1'),
    depositeamt: new FormControl<number>(0, [Validators.maxLength(10)]),
    remarks: new FormControl<String>('', [Validators.maxLength(50)]),
  });

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
  displayBillType(e: any) {
    console.log('billtype', e);
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
  // isplayConncode(e: any) {
  //   this.strohdh_connocode = e[1]?.trim();
  //   this.strohdh_conno = e[0]?.trim();
  // }
  displayConncode(e: any) {
    this.strohdh_connocode = e[1]?.trim();
    this.strohdh_conno = e[0]?.trim();
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
    console.log(ctrlValue);

    ctrlValue?.month(normalizedMonthAndYear?.month());
    ctrlValue?.year(normalizedMonthAndYear?.year());
    dateCtrl?.setValue(ctrlValue);
    datepicker.close();
  }
  dispalyLocNamePayCoyNameBillCoyNameForm(res: any) {
    console.log('insideBillcoy', res);
    this.connectionform.patchValue({
      billCoyName: res.data[0]?.billcoyname,
      payCoyName: res.data[0]?.paycompany,
      locationName: res.data[0]?.locname,
    });
  }

  dispalyOverheadDetails(res: any) {
    console.log('insideoverhead', res);
    console.log('res.data[0]?.ohdhbillcoy', res?.ohdhbillcoy);

    this.connectionform.patchValue({
      ohdhbillcoy: res?.ohdhbillcoy,
      ohdhpaycoy: res?.ohdhpaycoy,
      ohdhlocation: res?.ohdhlocation,
      consumerNo: res?.ohdhconno,
    });
  }
  
  retriveDepositeDetail() {
    //this.retriveoverheadconncodedetails();
    if (this.connectionSelection?.valid) {
      this.retriveDepositeDetails();
      this.retriveLocNameBillCoyNamePayCoyName();
      this.tranMode = 'R';
      this.actionDisabledEnabledButtons(true, true, true, false, false);
      this.visibleformcontrol = true;
    } else {
      this.toastr.error('Please Fill all Mandatory Fields');
      this.connectionSelection?.markAllAsTouched();
    }
  }
  addOverheadBillDetails() {
    if (this.connectionSelection?.valid) {
      this.checkConnocodeBillperiodDepositeExists();
      this.retriveoverheadconncodedetails();
      this.retriveLocNameBillCoyNamePayCoyName();
      
      this.tranMode = 'A';
      this.actionDisabledEnabledButtons(true, true, true, false, false);
      this.visibleformcontrol = true;
    } else {
      this.toastr.error('Please Fill all Mandatory Fields');
      this.connectionSelection?.markAllAsTouched();
    }
  }

  checkConnocodeBillperiodDepositeExists() {
    if (this.strohdh_connocode) {
      console.log('connocode', this.strohdh_connocode);
      let billPeriod = moment(
        this.connectionSelection.get('billperiod')?.value
      ).format('YYYYMM');
      this.overheadsService
        .getDepositWithConnocodeBillperiodexists(
          this.strohdh_conno.trim(),
          billPeriod
        )
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('data', res);
            this.recordExistorNot = res.status;
            if (this.recordExistorNot == false) {
              //this.toastr.error('Record Already Exist');
              this.modalService.showErrorDialog(
                'Record Already Exist',
                res['message'],
                'info'
              );
              this.back();
            } else {
              this.retriveoverheadconncodedetails();
              this.retriveLocNameBillCoyNamePayCoyName();
            }
          },
        });
    }
  }

  retriveoverheadconncodedetails() {
    //console.log('test', this.connectionSelection);

    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    if (this.strohdh_conno) {
      //console.log("connocode for add", this.strohdh_connocode);
      this.overheadsService
        .getConsumerDetailbyconnCode(this.strohdh_connocode)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log('dispalyOverheadDetails data ', res);
            if (res.data) {
              this.dispalyOverheadDetails(res.data);
            } else {
              this.toastr.error('Record Not  Found');
              this.back();
            }
          },
        });
    }
  }
  retriveLocNameBillCoyNamePayCoyName() {
    //getLocnamePaycoynameBillcoyname
    this.actionService.getReterieveClickedFlagUpdatedValue(true);
    if (this.strohdh_conno) {
      console.log('payconnocode', this.strohdh_connocode);
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
              //this.toastr.error('Record Not  Found');
              this.modalService.showErrorDialog(
                'Record Not  Found',
                res['message'],
                'info'
              );
              this.back();
            }
          },
        });
    }
  }
  retriveDepositeDetails() {
    this.actionService.getReterieveClickedFlagUpdatedValue(true);

    let billPeriod = moment(
      this.connectionSelection.get('billperiod')?.value
    ).format('YYYYMM');
    if (this.strohdh_connocode) {
      console.log('inside retrive', this.strohdh_conno);
      //console.log("inside retrive bill period",this.billPeriod);
      this.overheadsService
        .getOverheadDeposite(this.strohdh_conno, billPeriod)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            if (res.data) {
              console.log('data', res.data);
              this.displayBillDetailform(res);
            } else {
              //this.toastr.error('Record Not  Found for this connection');
              this.modalService.showErrorDialog(
                'Record Not  Found for this connection',
                res['message'],
                'info'
              );
              this.back();
            }
          },
        });
    }
  }
  displayBillDetailform(res: any) {
    this.billEntryform.patchValue({
      depositeamt:
        res.data[0]?.depositeamt > 0
          ? res.data[0]?.depositeamt
          : res.data[0]?.depositeamt * -1,
      remarks: res.data[0]?.remarks,
    });
    this.adddeductionFlag = res.data[0]?.adddeduction;

    if (this.adddeductionFlag == 'A') {
      this.billEntryform?.get('inlineRadioOptions')?.setValue('option1');
    } else {
      this.billEntryform?.get('inlineRadioOptions')?.setValue('option2');
    }
    //patch overheadcons details
    this.connectionform.patchValue({
      consumerNo: res.data[0]?.overheadconsResponseBean['ohdhconno']?.trim(),
      ohdhbillcoy: res.data[0]?.overheadconsResponseBean['ohdhbillcoy']?.trim(),
      ohdhbldgcode:
        res.data[0]?.overheadconsResponseBean['ohdhbldgcode']?.trim(),
      ohdhlocation:
        res.data[0]?.overheadconsResponseBean['ohdhlocation']?.trim(),
      ohdhpaycoy: res.data[0]?.overheadconsResponseBean['ohdhpaycoy']?.trim(),
    });
  }
  onFocusOutEvent(event: any) {
    this.billEntryform.patchValue({
      remarks:
        'Dep.Amt.' +
        this.billEntryform.get('depositeamt')?.value +
        ' For ' +
        this.strohdh_conno +
        ' Conno',
    });
  }

  encrypt(depositeamtforstorage: string): string {
    console.log("txt",depositeamtforstorage);
    
    return CryptoJS.AES.encrypt(depositeamtforstorage, 'deposite').toString();
    //return CryptoJS.AES.encrypt(JSON.stringify(txt), 'deposite').toString();
    
  }

  saveOverheadDeposite() {
    let userid = sessionStorage.getItem('userName');
    // //depositeAmt
    // if (this.adddeductionFlag == 'A') {
    //   this.depositeAmt = this.billEntryform.get('depositeAmt')?.value;
    // } else {
    //   if (this.adddeductionFlag == 'D') {
    //     this.depositeAmt = this.billEntryform.get('depositeAmt')?.value * -1;
    //   }
    // }
    console.log('chkdepositeamt', this.billEntryform.get('depositeamt')?.value);
    let chkdepositeamt = this.billEntryform.get('depositeamt')?.value
      ? this.billEntryform.get('depositeamt')?.value
      : 0;

    console.log('chkdepositeamt', chkdepositeamt);
    //this.billEntryform.get('depositeAmt')?.value ?  this.billEntryform.get('depositeAmt')?.value : 0
    if (chkdepositeamt == 0) {
      this.toastr.error('Please enter deposite amount');
    } else {
      console.log('this.adddeductionFlag', this.adddeductionFlag);

      let savePayload = {
        userid,
        adddeduction: this.adddeductionFlag,
        billtype: this.connectionSelection.get('billType')?.value.trim(),
        period: moment(
          this.connectionSelection.get('billperiod')?.value
        ).format('YYYYMM'),
        connocode: this.strohdh_conno,
        conno: this.strohdh_connocode,
        coycode: this.connectionform.get('ohdhpaycoy')?.value,
        depositeamt:
          this.adddeductionFlag == 'A'
            ? this.billEntryform.get('depositeamt')?.value
            : this.billEntryform.get('depositeamt')?.value * -1,

        //depositeamt: this.depositeAmt,
        remarks: this.billEntryform.get('remarks')?.value,
        overheadconsRequestBean: this.overheadconsRequestBeanPayLoadData(),
      };
      console.log('overheadconsRequestBean', this.overheadconsRequestBean);
      if (this.tranMode == 'A') {
        console.log('save mode flag ', this.tranMode);
        console.log('savePayload insert ', savePayload);
        this.loaderToggle = true;
        this.overheadsService.addOverheadDeposit(savePayload).subscribe({
          next: (res) => {
            //console.log('save res', res);
            this.loaderToggle = false;
            if (res.status) {
              // this.modalService.showErrorDialog(
              //   'Overhead Bill Inserted',
              //   res['message'],
              //   'info'
              // );
              Swal.fire({
                title: 'Deposite Bill Information',
                text: res['message'],
                icon: 'success',
                confirmButtonColor: '#e23335',
                confirmButtonText: 'Ok',
              }).then((e) => {
                e.isConfirmed ? this.back() : '';
              });
              //this.back();
              // console.log('res', res);
              // console.log('res', res.data);
              // let ss=this.encrypt(res.data.toString());
              // console.log("ss",ss);
              // console.log("befor localstorage");
              localStorage.setItem('deposite', this.encrypt(res.data.toString()));
              //localStorage.setItem('deposite', res.data);
            }
          },
        });
      } else {
        if (this.tranMode == 'R') {
          console.log('save mode flag ', this.tranMode);
          console.log('savePayload insert ', savePayload);
          this.loaderToggle = true;
          this.overheadsService.updateOVerheadDeposite(savePayload).subscribe({
            next: (res) => {
              console.log('save res', res);
              this.loaderToggle = false;
              if (res.status) {
                // this.modalService.showErrorDialog(
                //   'Overhead Bill Updated',
                //   res['message'],
                //   'info'
                // );
                Swal.fire({
                  title: 'Deposite Bill Information',
                  text: res['message'],
                  icon: 'warning',
                  confirmButtonColor: '#e23335',
                  confirmButtonText: 'Ok',
                }).then((e) => {
                  e.isConfirmed ? this.back() : '';
                });
                //this.back();
              } else {
                Swal.fire({
                  title: 'Deposite Bill Error',
                  text: res['message'],
                  icon: 'warning',
                  confirmButtonColor: '#e23335',
                  confirmButtonText: 'Ok',
                  background: '#fff url(/images/trees.png)',
                 
                }).then((e) => {
                  e.isConfirmed ? this.back() : '';
                });
              }
              console.log('res', res);
              console.log('res', res.data);
              
              // let ss=this.encrypt(res.data.toString());
              // console.log("ss",ss);
              // console.log("befor localstorage");
              localStorage.setItem('deposite', this.encrypt(res.data.toString()));
              //sessionStorage.setItem('deposite', res.data.toString());
            },
          });
        }
      }
    }
  }

  overheadconsRequestBeanPayLoadData() {
    this.overheadconsRequestBean = {
      //this.strohdh_connocode
      ohdhconno: this.strohdh_conno,
      ohdhconnocode: this.strohdh_connocode,
      ohdhconsumerno: this.strohdh_conno,
      ohdhbldgcode: this.connectionform.get('ohdhbldgcode')?.value,
      coycode: this.connectionform.get('ohdhpaycoy')?.value,
      ohdhlocation: this.connectionform.get('ohdhlocation')?.value,
      ohdhbillcoy: this.connectionform.get('ohdhbillcoy')?.value,
      ohdhpaycoy: this.connectionform.get('ohdhpaycoy')?.value,
      ohdhbilltype: this.connectionSelection.get('billType')?.value.trim(),
    };
    return this.overheadconsRequestBean;
  }

  // private selectedLink: string = 'option1';
  // setradio(e: string): void {
  //   this.selectedLink = e;
  //   console.log('test', this.selectedLink);
  //   let selectRadiobutton;
  //   selectRadiobutton = this.selectedLink;
  //   console.log('selectRadiobutton', selectRadiobutton);
  //   if (e == 'option1') {
  //     this.adddeductionFlag = 'A';
  //   } else {
  //     this.adddeductionFlag = 'D';
  //     // if (selectRadiobutton.toString() == 'option2') {

  //     // }
  //   }
  //   console.log('this.adddeductionFlag', this.adddeductionFlag);
  // }
  setRadioOption() {
    console.log('this.chkradiabutton', this.chkradiabutton);

    if (this.chkradiabutton == 'option1') {
      this.adddeductionFlag = 'A';
    } else {
      this.adddeductionFlag = 'D';
    }
  }

  back() {
    this.connectionSelection.reset();
    this.connectionform.reset();
    this.billEntryform.reset();
    this.ConnDepositData = [];
    this.actionDisabledEnabledButtons(false, false, false, true, true);
    this.focusField();
    this.visibleformcontrol = false;
    this.connectionSelection?.get('billperiod')?.patchValue(moment());
    this.billEntryform.patchValue({
      inlineRadioOptions: 'option1',
    });
  }
  handleExitClick() {
    console.log('this.billtypeFromOerheadtxn', this.billtypeFromOerheadtxn);

    if ((this.billtypeFromOerheadtxn = 'Y')) {
      window.close();
    } else {
      if ((this.billtypeFromOerheadtxn = 'N')) {
        //this.router.navigate(['/dashboard']);
        alert('close');
      }
    }
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
  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('billType')
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }
}
