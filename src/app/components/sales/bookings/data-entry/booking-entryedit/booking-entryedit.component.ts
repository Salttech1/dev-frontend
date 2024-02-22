import {
  Component,
  OnInit,
  AfterContentChecked,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
  Input,
  OnChanges,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { range, Subject, take } from 'rxjs';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ServiceService } from 'src/app/services/service.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { BookingsService } from 'src/app/services/sales/bookings.service';
import Swal from 'sweetalert2';
declare var window: any;

// interface BookingRequestBean {
//   [key: string]: any;
// }

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
  selector: 'app-booking-entryedit',

  templateUrl: './booking-entryedit.component.html',
  styleUrls: ['./booking-entryedit.component.css'],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class BookingEntryeditComponent implements OnInit {
  formModal: any;
  loaderToggle: boolean = false;
  selectedIndex: number | null = null;
  service: any;
  @ViewChild(F1Component) comp!: F1Component;
  renderer: any;
  toastr: any;
  showPopup = false;
  tranMode: String = '';
  strflat!: string;
  strwing!: string;
  strbuilding!: string;
  StrCopyFromOwnerId!: string;
  strownerid!: string;
  StrFlatFloor!: string;
  Strbunitarea!: string;
  fetchvalueArray!: any[];
  flat: String = '';
  wing: String = '';
  buidlingwingwiseFilter_condition: String = '';
  //for finding Perticularowner detail
  ownersrno: String = '';
  ownertitle: String = '';
  ownername: String = '';
  ownerpanno: String = '';
  ownergstno: String = '';
  owneraadharno: String = '';
  ownerrelation: String = '';
  StrLocPartyCode: String = '';
  StrLocAltPartyCode: String = '';
  StrPriAltOwnerId: String = '';
  StrPriOwnerId: String = '';
  StrPrifistOwnerName: String = '';
  StrAltBldgCode: String = '';
  StrAltAltwing: String = '';
  flatnum1: String = '';
  IntPriStampduty: number | null = null;
  IntPriTDSAmt: number | null = null;
  disabledFlagAdd: boolean = false;
  disabledFlagRetrieve: boolean = false;
  disableFlagDelete: boolean = false;
  disabledFlagSave: boolean = true;
  disabledFlagBack: boolean = true;
  disabledFlagExit: boolean = false;
  visibleformcontrol: boolean = false;

  //for our building patch in request bean
  bookingRequestBean: any;
  addressmailRequestBean: any;
  addresspmtRequestBean: any;
  bldgwingmapRequestBean: any;
  flatcharRequestBean: any;
  flatownerRequestBean: any;
  flatpayOtherBldgRequestBean: any;
  flatpayRequestBean: any;
  flatsRequestBean: any;
  loanhistoryRequestBean: any;
  partyRequestBean: any;

  bookingRequestBean1: string = '';
  addressmailRequestBean1: string = '';
  addresspmtRequestBean1: string = '';
  bldgwingmapRequestBean1: string = '';
  flatcharRequestBean1: string = '';
  flatownerRequestBean1: string = '';
  flatpayOtherBldgRequestBean1: string = '';
  flatpayRequestBean1: string = '';
  flatsRequestBean1: string = '';
  loanhistoryRequestBean1: string = '';
  partyRequestBean1: string = '';
  //dataObject: any;
  //dataObject1: any

  //for alternet Building Patch in Request Bean
  bookingAltBldgRequestBean: any;
  addressmailAltBldgRequestBean: any;
  addresspmtAltBldgRequestBean: any;
  flatcharAltBldgRequestBean: any;
  flatownerAltBldgRequestBean: any;
  flatpayAltBldgRequestBean: any;
  loanhistoryAltBldgRequestBean: any;
  partyAltBldgRequestBean: any;

  bookingAltBldgRequestBean1: string = '';
  addressmailAltBldgRequestBean1: string = '';
  addresspmtAltBldgRequestBean1: string = '';
  flatcharAltBldgRequestBean1: string = '';
  flatownerAltBldgRequestBean1: string = '';
  flatpayAltBldgRequestBean1: string = '';
  loanhistoryAltBldgRequestBean1: string = '';
  partyAltBldgRequestBean1: string = '';

  //for flatpay request bean for stamduty and TDS
  CommonSTAMDUTYRequestBean: any;
  CommonTDSRequestBean: any;
  CommonAmtPaidRequestBean: any;
  content: any;
  dataObject: any;

  // bldgcode!: string;
  // wing!: string;
  // flatnum!: string;
  // ownerid!: string;

  constructor(
    private actionService: ActionservicesService,
    public router: Router,
    private dynapop: DynapopService,
    private dialog: MatDialog,
    private cdref: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalComponent>,
    private cderf: ChangeDetectorRef,
    private rendered: Renderer2,
    private toasterService: ToastrService,
    public _actionService: ActionservicesService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private el: ElementRef,
    private bookingservice: BookingsService
  ) {}
  ngOnInit(): void {
    this.selectedIndex = 0;
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }
  openFormModal() {
    this.formModal.show();
  }
  saveBankBrachDetails() {
    // confirm or save something
    this.formModal.hide();
  }

  ngAfterViewInit(): void {
    //this.focusField();
    this.comp?.fo1?.nativeElement?.focus();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  validateInvalidFormat(event: any, id: any, message: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.renderer.selectRootElement(`#${id}`)?.focus();
      this.toastr.error(message);
    }
  }
  // getF1Value() {
  //   return {
  //     id: "SALESBLDG",
  //     isSingleValue: true
  //   };
  // }
  bookingSelection: FormGroup = new FormGroup({
    buildingCode: new FormControl<String | null>('', Validators.required),

    wing: new FormControl<String | null>('', Validators.required),
    flatnum: new FormControl<String | null>('', Validators.required),

    outbldgCode: new FormControl<String[] | null>({
      value: [],
      disabled: false,
    }),
  });

  //copy form form name
  copyFlatOwner: FormGroup = new FormGroup({
    copyFrom: new FormControl<String>('', [Validators.maxLength(20)]),
  });

  bankBranchForm: FormGroup = new FormGroup({
    bankBranchcoycode: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchcoyname: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchcode: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchadr1: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchadr2: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchadr3: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchadr4: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchcity: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchstate: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchcountry: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchpincode: new FormControl<String>('', [Validators.maxLength(20)]),
    bankBranchnation: new FormControl<String>('', [Validators.maxLength(20)]),
  });

  bookingForm: FormGroup = new FormGroup({
    bookingtype: new FormControl<String | null>({ value: 'C', disabled: true }),
    flatpark: new FormControl<String>('', [Validators.maxLength(6)]),
    unittype: new FormControl<String | null>({ value: 'F', disabled: true }),
    company: new FormControl<String | null>({ value: '', disabled: true }),
    ownercompany: new FormControl<String | null>({ value: '', disabled: true }),
    custtype: new FormControl<String>('', [Validators.maxLength(5)]),
    //bookdate: new FormControl(new Date(), [Validators.required]),
    bookdate: new FormControl<Date | null>(null),
    aggrementprize: new FormControl<String>(''),
    ownerbldgprice: new FormControl<String>(''),
    registrationno: new FormControl<String>('', [Validators.maxLength(20)]),
    registrationprize: new FormControl<String>(''),
    registrationfee: new FormControl<String>(''),
    customertype: new FormControl<String>('', [Validators.maxLength(5)]),
    shedulepossession: new FormControl<String>('', [Validators.maxLength(30)]),
    leaddate: new FormControl(new Date(), [Validators.required]),
    firstvisitExecutive: new FormControl<String>('', [
      Validators.maxLength(20),
    ]),
    //firstvisitdate: new FormControl(new Date(), [Validators.required]),
    firstvisitdate: new FormControl<Date | null>(null),
    soi: new FormControl<String>('', [Validators.maxLength(5)]),
    bookby: new FormControl<String>('', [Validators.maxLength(15)]),
    inlineRadioOptions: new FormControl(''),
    inlineRadioOptions1: new FormControl(''),

    broker: new FormControl<String>('', [Validators.maxLength(6)]),
    brokerent: new FormControl<String>(''),
    community: new FormControl<String>('', [Validators.maxLength(10)]),
    Customercompany: new FormControl<String>('', [Validators.maxLength(50)]),
    designation: new FormControl<String>('', [Validators.maxLength(50)]),
    jobprofile: new FormControl<String>('', [Validators.maxLength(10)]),
    powerofattorney: new FormControl<String>('', [Validators.maxLength(30)]),
    powerofattorneyContact: new FormControl<String>('', [
      Validators.maxLength(15),
    ]),
    powerofattorneyAddress: new FormControl<String>('', [
      Validators.maxLength(100),
    ]),
    remarks: new FormControl<String>('', [Validators.maxLength(100)]),

    nrinat: new FormControl<String>('', [Validators.maxLength(5)]),
    nripass: new FormControl<String>('', [Validators.maxLength(15)]),
    nriIssuedOn: new FormControl<String>(''),
    //nrippidate: new FormControl<String>(''),
    nrippidate: new FormControl<Date | null>(null),
    nriprof: new FormControl<String>('', [Validators.maxLength(10)]),
    //nripedate: new FormControl<String>(''),
    nripedate: new FormControl<Date | null>(null),
    nriNREAcno: new FormControl<String>('', [Validators.maxLength(15)]),
    nrebank: new FormControl<String>('', [Validators.maxLength(10)]),
    nroacnum: new FormControl<String>('', [Validators.maxLength(15)]),
    nrobank: new FormControl<String>('', [Validators.maxLength(10)]),
    nriteloff: new FormControl<String>('', [Validators.maxLength(15)]),
    nritelres: new FormControl<String>('', [Validators.maxLength(10)]),
    //nripassiss: new FormControl<String>('', [Validators.maxLength(10)]),
    nripassiss: new FormControl<Date | null>(null),
  });
  ownerjointownerForm: FormGroup = new FormGroup({
    Permanenetaddress: new FormGroup({
      flatnofr: new FormControl<String>('', [Validators.maxLength(3)]),
      buildingname: new FormControl<String>('', [Validators.maxLength(5)]),
      complex: new FormControl<String>('', [Validators.maxLength(30)]),
      road: new FormControl<String>('', [Validators.maxLength(30)]),
      landmark: new FormControl<String>('', [Validators.maxLength(30)]),
      town: new FormControl<String>('', [Validators.maxLength(5)]),
      city: new FormControl<String>('', [Validators.maxLength(5)]),
      pincode: new FormControl<String>('', [Validators.maxLength(10)]),
      state: new FormControl<String>('', [Validators.maxLength(5)]),
      country: new FormControl<String>('', [Validators.maxLength(5)]),
      telres: new FormControl<String>('', [Validators.maxLength(30)]),
      teloffice: new FormControl<String>('', [Validators.maxLength(30)]),
      fax: new FormControl<String>('', [Validators.maxLength(30)]),
      emailid: new FormControl<String>('', [Validators.maxLength(50)]),
      mobile: new FormControl<String>('', [Validators.maxLength(15)]),
    }),
    mailingaddress: new FormGroup({
      mailflatnofr: new FormControl<String>('', [Validators.maxLength(3)]),
      mailbuildingname: new FormControl<String>('', [Validators.maxLength(5)]),
      mailcomplex: new FormControl<String>('', [Validators.maxLength(30)]),
      mailroad: new FormControl<String>('', [Validators.maxLength(30)]),
      maillandmark: new FormControl<String>('', [Validators.maxLength(30)]),
      mailtown: new FormControl<String>('', [Validators.maxLength(5)]),
      mailcity: new FormControl<String>('', [Validators.maxLength(5)]),
      mailpincode: new FormControl<String>('', [Validators.maxLength(10)]),
      mailstate: new FormControl<String>('', [Validators.maxLength(5)]),
      mailcountry: new FormControl<String>('', [Validators.maxLength(5)]),
      mailtelres: new FormControl<String>('', [Validators.maxLength(30)]),
      mailteloffice: new FormControl<String>('', [Validators.maxLength(30)]),
      mailfax: new FormControl<String>('', [Validators.maxLength(30)]),
      mailemailid: new FormControl<String>('', [Validators.maxLength(50)]),
      mailmobile: new FormControl<String>('', [Validators.maxLength(15)]),
    }),
    ownerdetailArr: new FormGroup({
      itemDetailBreakUp: new FormArray([this.itemDetailInitRows()]),
      itemDetailDeleteBreakUp: new FormArray([]),
    }),
  });

  paymentsheduleForm: FormGroup = new FormGroup({
    ourBldgBookamt: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),
    ourBldgDueamt: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),
    ourBldgBalace: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),

    otherBldgBookamt: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),
    otherBldgDueamt: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),
    otherBldgBalace: new FormControl<String | null>({
      value: '0',
      disabled: true,
    }),

    loanDetails: new FormGroup({
      financialCoy: new FormControl<String>('', [Validators.maxLength(5)]),
      financialBranch: new FormControl<String>('', [Validators.maxLength(5)]),
      loanno: new FormControl<String>('', [Validators.maxLength(5)]),
      loanamount: new FormControl<String>('0'),
      //loannocdate: new FormControl<String>(''),
      loannocdate: new FormControl<Date | null>(null),
      //loanclosedate: new FormControl<String>(''),
      loanclosedate: new FormControl<Date | null>(null),
    }),

    itemDetailOurBuildingArr: new FormGroup({
      itemDetailOurBuildingBreakUp: new FormArray([
        this.itemDetailOurInitRows(),
      ]),
      itemDetailDeleteBreakUp: new FormArray([]),
    }),
    itemDetailOtherBuildingArr: new FormGroup({
      itemDetailOtherBuildingBreakUp: new FormArray([
        this.itemDetailOtherInitRows(),
      ]),
      itemDetailDeleteBreakUp: new FormArray([]),
    }),
    loanDetailHistryArr: new FormGroup({
      loanDetailHistryBreakUp: new FormArray([this.loanDetailHistryInitRows()]),
      loanDetailHistryDeleteBreakUp: new FormArray([]),
    }),
  });

  itemDetailOurInitRows() {
    return this.fb.group({
      srno: new FormControl<string | null>({ value: '', disabled: true }),
      duedate: new FormControl<Date | null>(null),
      //duedate: moment(v.dcdate, ' DD/MM/YYYY'),
      narrative: new FormControl<string>('', [Validators.maxLength(50)]),
      ourbldgPaymtTypeDesc: new FormControl<string>('N', [
        Validators.maxLength(15),
      ]),
      dueamount: new FormControl<string>('0', [Validators.maxLength(15)]),
    });
  }
  itemDetailOtherInitRows() {
    return this.fb.group({
      srno: new FormControl<string | null>({ value: '', disabled: true }),
      otherbldgDueDate: new FormControl<Date | null>(null),
      //otherbldgDueDate: new FormControl(),
      otherbldgnarrative: new FormControl(),
      otherbldgPaymtType: new FormControl<string>('', [
        Validators.maxLength(50),
      ]),

      otherbldgPaymtTypeDesc: new FormControl<string>('N', [
        Validators.maxLength(15),
      ]),
      otherbldgdueamount: new FormControl<string>('0', [
        Validators.maxLength(15),
        Validators.required,
      ]),
    });
  }
  loanDetailHistryInitRows() {
    return this.fb.group({
      srno: new FormControl<string | null>({ value: '', disabled: true }),
      loanHistComapny: new FormControl<string>('', [
        Validators.maxLength(15),
        Validators.required,
      ]),
      loanHistNo: new FormControl<string>('', [Validators.maxLength(50)]),
      loanHistAmt: new FormControl<string>('0', [Validators.maxLength(15)]),
      loanHistBranch: new FormControl<string>('', [Validators.maxLength(15)]),
      loanNocHistDate: new FormControl<Date | null>(null),
      loanHistCloseDate: new FormControl<Date | null>(null),
      //loanNocHistDate: new FormControl(new Date(), [Validators.required]),
      //loanHistCloseDate: new FormControl(new Date(), [Validators.required]),
    });
  }

  itemDetailInitRows() {
    return this.fb.group({
      srno: new FormControl<string | null>({ value: '', disabled: true }),
      title: new FormControl<string>('', [
        Validators.maxLength(5),
        Validators.required,
      ]),
      name: new FormControl<string>('', [Validators.maxLength(50)]),
      panno: new FormControl<string>('N', [Validators.maxLength(15)]),
      gstno: new FormControl<string>('N', [Validators.maxLength(15)]),
      aadharno: new FormControl<string>('N', [Validators.maxLength(15)]),
      relation: new FormControl<string>('N', [Validators.maxLength(15)]),
    });
  }

  //func for owner details table for add row
  get itemBreakUpFormArr() {
    return this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.get('itemDetailBreakUp') as FormArray;
  }
  get itemBreakupDeleteFormArr() {
    return this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.get('itemDetailDeleteBreakUp') as FormArray;
  }

  //func for our building/other building/loan detail for add row
  get itemBreakupForOurBldgArr() {
    return this.paymentsheduleForm
      .get('itemDetailOurBuildingArr')
      ?.get('itemDetailOurBuildingBreakUp') as FormArray;
  }

  get itemBreakupForOtherBldgArr() {
    return this.paymentsheduleForm
      .get('itemDetailOtherBuildingArr')
      ?.get('itemDetailOtherBuildingBreakUp') as FormArray;
  }
  get itemBreakupForLoandetailHistArr() {
    return this.paymentsheduleForm
      .get('loanDetailHistryArr')
      ?.get('loanDetailHistryBreakUp') as FormArray;
  }

  // finc to select tab index
  onTabChanged(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
  }
  chosenMonthHandler(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>,
    dateCtrl: any
  ) {
    if (!dateCtrl?.valid) {
      this.bookingSelection.patchValue({
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

  // filter condition for flat
  FuncFilterFlat() {
    this.bookingSelection.get('buildingCode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.flat = res[0][0];
        }
      },
    });
    this.bookingSelection.get('wing')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          this.wing = res[0][0].trim();

          if (this.wing == '') {
            console.log('inside wing');
            this.wing = ' ';
          }
        }
      },
    });
    if (this.wing == '') {
      //console.log('inside wing');
      this.wing = ' ';
    }
    //console.log('log', this.wing);
    this.buidlingwingwiseFilter_condition = `FLAT_bldgcode = '${this.flat}' AND FLAT_wing ='${this.wing}'`;
    // console.log(
    //   'this.buidlingwingwiseFilter_condition',
    //   this.buidlingwingwiseFilter_condition
    // );

    return this.buidlingwingwiseFilter_condition;
  }
  //insert row in perticulatr tab control grid table
  //addrow(rowIndex: any,formArrayList:any,gridname:any)
  addrow(rowIndex: any, gridname: any) {
    //console.log(this.selectedIndex);
    // console.log(formArrayList);
    //item is formArrayList from html

    if (this.selectedIndex == 1) {
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      //formArrayList.push(this.itemDetailInitRows());
      //formArrayList.push(formArrayList.control);
      //formArrayList.push();
      //console.log("before add",formArrayList.length);
      //formArrayList.push(formArrayList.controls);
      //console.log("after add",formArrayList.length);
      //console.log(this.itemBreakUpFormArr.length);
    } else if (this.selectedIndex == 2) {
      if (gridname == 'ourBuilding') {
        console.log(gridname);
        this.itemBreakupForOurBldgArr.push(this.itemDetailOurInitRows());
      } else if (gridname == 'otherBuilding') {
        this.itemBreakupForOtherBldgArr.push(this.itemDetailOtherInitRows());
      } else if (gridname == 'loanHist') {
        this.itemBreakupForLoandetailHistArr.push(
          this.loanDetailHistryInitRows()
        );
      }
    }
  }

  //Delete row in perticulatr tab control grid table
  deleterow(rowIndex: any, gridname: any) {
    if (this.selectedIndex == 1) {
      for (let i = 1; i < this.itemBreakUpFormArr.length; i++) {
        if (rowIndex == i) {
          //this.itemBreakupDeleteFormArr.push(this.itemBreakUpFormArr.at(i));
          // this.itemBreakUpFormArr.controls[i]
          //   .get('insertUpdateMode')
          //   ?.setValue('D');
          this.itemBreakUpFormArr.removeAt(i);
        }
      }
    } else if (this.selectedIndex == 2) {
      if (gridname == 'ourBuilding') {
        for (let i = 1; i < this.itemBreakupForOurBldgArr.length; i++) {
          if (rowIndex == i) {
            //this.itemBreakupDeleteFormArr.push(this.itemBreakUpFormArr.at(i));
            this.itemBreakupForOurBldgArr.removeAt(i);
          }
        }
      } else if (gridname == 'otherBuilding') {
        for (let i = 1; i < this.itemBreakupForOtherBldgArr.length; i++) {
          if (rowIndex == i) {
            //this.itemBreakupDeleteFormArr.push(this.itemBreakUpFormArr.at(i));
            this.itemBreakupForOtherBldgArr.removeAt(i);
          }
        }
      } else if (gridname == 'loanHist') {
        for (let i = 1; i < this.itemBreakupForLoandetailHistArr.length; i++) {
          if (rowIndex == i) {
            //this.itemBreakupDeleteFormArr.push(this.itemBreakUpFormArr.at(i));
            this.itemBreakupForLoandetailHistArr.removeAt(i);
          }
        }
      }
    }
  }
  callMyFunction(e: any) {
    this.onSubmitForm();
  }
  onSubmitForm() {
    this.service.setFocusField(
      this.bookingSelection.controls,
      this.el.nativeElement
    );
  }
  // patch all booking form
  patchbookingData(res: any) {
    console.log('inside patch');
    console.log('inside PAtch res', res);
    console.log(res?.data?.accomtype);
    console.log('res?.Extrdata[3]', res?.extraData[3]);

    this.bookingForm.patchValue({
      //bookingtype: res?.ohdhconno,
      //flatpark: res?.ohdhconno,
      unittype: res?.data?.accomtype,
      company: res?.extraData[3],
      ownercompany: res?.extraData[4],
      ownerbldgprice: res?.extraData[1],
      custtype: res?.data?.custtype,
      //bookdate: moment(res?.data?.date, ' DD/MM/YYYY'),
      bookdate: moment(res?.data?.date, 'DD/MM/YYYY').format('DD/MM/YYYY'),

      aggrementprize: res?.data?.agprice,
      community: res?.data?.community,
      registrationno: res?.data?.regno,
      registrationprize: res?.data?.regprice,
      registrationfee: res?.data?.regfees,
      shedulepossession: res?.data?.scheduledpossession,
      firstvisitExecutive: res?.data?.firstvisitexec,
      //firstvisitdate: moment(res?.data?.firstvisitdate, ' DD/MM/YYYY'),
      bookfirstvisitdatedate: moment(
        res?.data?.firstvisitdate,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),

      //leaddate: moment(res?.data?.leaddate, ' DD/MM/YYYY'),
      leaddate: moment(res?.data?.leaddate, 'DD/MM/YYYY').format('DD/MM/YYYY'),

      soi: res?.data?.soi,
      bookby: res?.data?.bookedby,
      //inlineRadioOptions: res?.ohdhconno,
      broker: res?.bookBrokos,
      brokerent: res?.data?.bookBrokent,
      Customercompany: res?.data?.customercoy,
      designation: res?.bookDesignation,
      jobprofile: res?.data?.jobprofile,
      powerofattorney: res?.data?.poaname,
      remarks: res?.data?.bookRemarks,
      StrPriOwnerId: res?.data?.ownerid,
      StrPriOutSideOwnerId: res?.extraData[0],
      //powerofattorneyContact: res?.ohdhconno,
      //powerofattorneyAddress: res?.ohdhconno,
    });
  }
  //pathch NRI details
  patchNRIData(res: any) {
    console.log('nripass', res?.data?.flatownerResponseBean[0]?.nripass);

    this.bookingForm.patchValue({
      nrinat: res?.data?.flatownerResponseBean[0]?.nrinat,
      nripass: res?.data?.flatownerResponseBean[0]?.nripass,
      fromdate: res.data[0]?.fromdate
        ? moment(res.data[0]?.fromdate, 'DD/MM/YYYY')
        : null,

      nripassiss: res?.data?.flatownerResponseBean[0]?.nripassiss
        ? moment(
            res?.data?.flatownerResponseBean[0]?.nripassiss,
            'DD/MM/YYYY'
          ).format('DD/MM/YYYY')
        : null,

      // nripassiss:moment(
      //   res?.data?.flatownerResponseBean[0]?.nripassiss,
      //   'DD/MM/YYYY'
      // ).format('DD/MM/YYYY'),

      nripedate: res?.data?.flatownerResponseBean[0]?.nripedate
        ? moment(
            res?.data?.flatownerResponseBean[0]?.nripedate,
            'DD/MM/YYYY'
          ).format('DD/MM/YYYY')
        : null,

      // nripedate: moment(
      //   res?.data?.flatownerResponseBean[0]?.nripedate,
      //   'DD/MM/YYYY'
      // ).format('DD/MM/YYYY'),

      nrippidate: moment(
        res?.data?.flatownerResponseBean[0]?.nrippidate,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),

      nriprof: res?.data?.flatownerResponseBean[0]?.nriprof,
      nrebank: res?.data?.flatownerResponseBean[0]?.nrebank,
      nroacnum: res?.data?.flatownerResponseBean[0]?.nroacnum,
      nrobank: res?.data?.flatownerResponseBean[0]?.nrobank,
      nriteloff: res?.data?.flatownerResponseBean[0]?.nriteloff,
      nritelres: res?.data?.flatownerResponseBean[0]?.nritelres,
    });
  }
  //patch address
  patchAddresData(res: any) {
    console.log('inside addres', res?.data?.addresspmtResponseBean?.adline1);

    this.ownerjointownerForm.patchValue({
      Permanenetaddress: {
        flatnofr: res?.data?.addresspmtResponseBean?.adline1,
        buildingname: res?.data?.addresspmtResponseBean?.adline2,
        complex: res?.data?.addresspmtResponseBean?.adline3,
        road: res?.data?.addresspmtResponseBean?.adline4,
        landmark: res?.data?.addresspmtResponseBean?.adline5,
        town: res?.data?.addresspmtResponseBean?.township,
        city: res?.data?.addresspmtResponseBean?.city,
        pincode: res?.data?.addresspmtResponseBean?.pincode,
        state: res?.data?.addresspmtResponseBean?.state,
        country: res?.data?.addresspmtResponseBean?.country,
        telres: res?.data?.addresspmtResponseBean?.phoneres,
        teloffice: res?.data?.addresspmtResponseBean?.phoneoff,
        fax: res?.data?.addresspmtResponseBean?.fax,
        emailid: res?.data?.addresspmtResponseBean?.email,
        mobile: res?.data?.addresspmtResponseBean?.phonemobile,
      },
      mailingaddress: {
        mailflatnofr: res?.data?.addressmailResponseBean?.adline1,
        mailbuildingname: res?.data?.addressmailResponseBean?.adline2,
        mailcomplex: res?.data?.addressmailResponseBean?.adline3,
        mailroad: res?.data?.addressmailResponseBean?.adline4,
        maillandmark: res?.data?.addressmailResponseBean?.adline5,
        mailtown: res?.data?.addressmailResponseBean?.township,
        mailcity: res?.data?.addressmailResponseBean?.city,
        mailpincode: res?.data?.addressmailResponseBean?.pincode,
        mailstate: res?.data?.addressmailResponseBean?.state,
        mailcountry: res?.data?.addressmailResponseBean?.country,
        mailtelres: res?.data?.addressmailResponseBean?.phoneres,
        mailteloffice: res?.data?.addressmailResponseBean?.phoneoff,
        mailfax: res?.data?.addressmailResponseBean?.fax,
        mailemailid: res?.data?.addressmailResponseBean?.email,
        mailmobile: res?.data?.addressmailResponseBean?.phonemobile,
      },
    });
  }
  //patch Owner Details
  patchOwnerDetails(res: any) {
    console.log(res.data.flatownerResponseBean?.length);

    if (res.data) {
      for (var i = 0; i < res.data.flatownerResponseBean?.length; i++) {
        res.data.flatownerResponseBean?.length - 1 == i
          ? ''
          : this.itemBreakUpFormArr.push(this.itemDetailInitRows());

        this.ownerjointownerForm.patchValue({
          ownerdetailArr: {
            itemDetailBreakUp: res?.data?.flatownerResponseBean,
          },
        });
      }
    } else {
      this.toastr.error('Record Not  Found ');
    }
  }
  //Patch Item Details
  patchItemDetailOurBuildingFpay(res: any) {
    console.log(res.data.flatpayResponseBean?.length);
    console.log(res.data.flatpayResponseBean);
    if (res.data) {
      for (var i = 0; i < res.data.flatpayResponseBean?.length; i++) {
        // res.data.flatpayResponseBean?.length - 1 == i
        //   ? ''
        //   : this.itemBreakupForOurBldgArr.push(this.itemDetailOurInitRows());

        // this.paymentsheduleForm.patchValue({
        //   itemDetailOurBuildingArr: {
        //     itemDetailOurBuildingBreakUp: res?.data?.flatpayResponseBean,
        //   },
        // });
        this.itemBreakupForOurBldgArr.clear();
        res?.data?.flatpayResponseBean?.forEach((v: any) =>
          this.itemBreakupForOurBldgArr.push(
            this.fb.group({
              narrative: v?.narrative,
              ourbldgPaymtTypeDesc: v?.ourbldgPaymtTypeDesc,
              dueamount: v?.dueamount,
              //duedate: moment(v.duedate, ' DD/MM/YYYY'),
              duedate: moment(v.duedate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            })
          )
        );
      }
    } else {
      this.toastr.error('Record Not  Found ');
    }
  }
  //Patch Item Other Building
  patchItemDetailOtherBuilding(res: any) {
    console.log(res.data.flatpayOtherBldgResponseBean?.length);

    if (res.data) {
      for (var i = 0; i < res.data.flatpayOtherBldgResponseBean?.length; i++) {
        // res.data.flatpayOtherBldgResponseBean?.length - 1 == i
        //   ? ''
        //   : this.itemBreakupForOtherBldgArr.push(this.itemDetailOurInitRows());
        // console.log("res?.data?.flatpayOtherBldgResponseBean",res?.data?.flatpayOtherBldgResponseBean);

        // this.paymentsheduleForm.patchValue({
        //   itemDetailOtherBuildingArr: {
        //     itemDetailOtherBuildingBreakUp:
        //       res?.data?.flatpayOtherBldgResponseBean,
        //   },
        // });

        this.itemBreakupForOtherBldgArr.clear();
        res?.data?.flatpayOtherBldgResponseBean?.forEach((v: any) =>
          this.itemBreakupForOtherBldgArr.push(
            this.fb.group({
              otherbldgnarrative: v?.otherbldgnarrative,
              otherbldgPaymtTypeDesc: v?.ourbldgPaymtTypeDesc,
              otherbldgdueamount: v?.otherbldgdueamount,
              //otherbldgDueDate: moment(v.otherbldgDueDate, ' DD/MM/YYYY'),
              otherbldgDueDate: moment(v.otherbldgDueDate, 'DD/MM/YYYY').format(
                'DD/MM/YYYY'
              ),
            })
          )
        );
      }
    } else {
      this.toastr.error('Record Not  Found ');
    }
  }
  patchLoanDetails(res: any) {}
  //Patch Loan Histry
  PatchLoanHistry(res: any) {
    console.log(res.data.flatpayOtherBldgResponseBean?.length);

    if (res.data) {
      for (var i = 0; i < res.data.loanhistoryResponseBean?.length; i++) {
        this.itemBreakupForLoandetailHistArr.clear();
        res?.data?.loanhistoryResponseBean?.forEach((v: any) =>
          this.itemBreakupForLoandetailHistArr.push(
            this.fb.group({
              loanHistComapny: v?.loanco,
              loanHistNo: v?.loannum,
              loanHistAmt: v?.loanamt,
              loanHistBranch: v?.loanbranch,
              //loanNocHistDate: moment(v.nocdt, ' DD/MM/YYYY'),
              loanNocHistDate: moment(v.nocdt, 'DD/MM/YYYY').format(
                'DD/MM/YYYY'
              ),

              loanHistCloseDate: moment(v.loanclosedate, 'DD/MM/YYYY').format(
                'DD/MM/YYYY'
              ),
              //loanHistCloseDate: moment(v.loanclosedate, ' DD/MM/YYYY'),
            })
          )
        );
      }
    } else {
      this.toastr.error('Record Not  Found ');
    }
  }
  //end patch

  /* CURD Operation function */
  
  RetriveBookingDetailsWithOwnerIdAndIndex() {
    let tabindex = this.selectedIndex! + 1;
    console.log('this.selectedIndex', this.selectedIndex);

    this.StrCopyFromOwnerId = this.fetchFirstelementvaluefromObject(
      this.copyFlatOwner.get('copyFrom')?.value,
      0,
      0
    );
    //this.selectedIndex
    this.bookingservice
      .getBookingDetailsOtherOwneridAccourdingTabIndex(
        this.StrCopyFromOwnerId,
        tabindex
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            if (tabindex == 1) {
              console.log('data for retrive', res);
              (this.StrAltBldgCode = res?.extraData[5]),
                (this.StrPriAltOwnerId = res?.extraData[0]),
                (this.StrFlatFloor = res?.data?.flatsResponseBean?.floor),
                (this.Strbunitarea = res?.data?.flatsResponseBean?.bunitarea),
                this.patchbookingData(res);
              this.patchNRIData(res);
            } else if (tabindex == 2) {
              console.log('data for retrive', res);
              (this.StrAltBldgCode = res?.extraData[5]),
                (this.StrPriAltOwnerId = res?.extraData[0]),
                (this.StrFlatFloor = res?.data?.flatsResponseBean?.floor),
                (this.Strbunitarea = res?.data?.flatsResponseBean?.bunitarea),
                this.patchAddresData(res);
              this.patchOwnerDetails(res);
            } else if (tabindex == 3) {
              console.log('data for retrive', res);
              (this.StrAltBldgCode = res?.extraData[5]),
                (this.StrPriAltOwnerId = res?.extraData[0]),
                (this.StrFlatFloor = res?.data?.flatsResponseBean?.floor),
                (this.Strbunitarea = res?.data?.flatsResponseBean?.bunitarea),
                this.patchItemDetailOurBuildingFpay(res);
              this.patchItemDetailOtherBuilding(res);
              this.PatchLoanHistry(res);
              this.patchLoanDetails(res);
            }
          }
        },
      });
  }
  //retrive all booking data
  retriveBookingDetails() {
    console.log('inside retrive');

    this.tranMode = 'R';
    this.actionDisabledEnabledButtons(true, true, true, false, false);
    this.visibleformcontrol = true;

    this.strbuilding = this.fetchFirstelementvaluefromObject(
      this.bookingSelection.get('buildingCode')?.value,
      0,
      0
    );

    this.strwing = this.fetchFirstelementvaluefromObject(
      this.bookingSelection.get('wing')?.value,
      0,
      0
    ).trim();
    this.strflat = this.fetchFirstelementvaluefromObject(
      this.bookingSelection.get('flatnum')?.value,
      0,
      0
    );
    if (this.strwing == '') {
      this.strwing = ' ';
    }
    console.log(this.strbuilding);
    console.log(this.strwing);
    console.log(this.strflat);

    this.strownerid = this.strbuilding + this.strwing + this.strflat;
    console.log(this.strownerid);

    //this.actionService.getReterieveClickedFlagUpdatedValue(true);
    this.bookingservice
      .getBookingDetailsBybldgcodewingflatnumownerid(
        this.strbuilding,
        this.strwing,
        this.strflat,
        this.strownerid
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            console.log('data for retrive', res);
            (this.StrAltBldgCode = res?.extraData[5]),
              (this.StrPriAltOwnerId = res?.extraData[0]),
              (this.StrFlatFloor = res?.data?.flatsResponseBean?.floor),
              (this.Strbunitarea = res?.data?.flatsResponseBean?.bunitarea),
              this.patchbookingData(res);
            this.patchNRIData(res);
            this.patchAddresData(res);
            this.patchOwnerDetails(res);
            this.patchItemDetailOurBuildingFpay(res);
            this.patchItemDetailOtherBuilding(res);
            this.PatchLoanHistry(res);
            // this.patchLoanDetails(res);
          }
        },
      });
  }
  // end of retrive all booking

  //Add booking Detail
  addBookingDetail() {
    this.tranMode = 'A';
    this.actionDisabledEnabledButtons(true, true, true, false, false);
    this.visibleformcontrol = true;
  }

  back() {
    this.actionDisabledEnabledButtons(false, false, false, true, true);
    this.visibleformcontrol = false;
  }

  // Function Retrive First Owner Id From Ownerdetail form
  funcRetriveOwnerDetailFromGrid(ownerIndex: any) {
    this.ownersrno = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].srno;
    this.ownertitle = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].title;
    this.ownername = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].name;
    this.ownerpanno = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].panno;
    this.ownergstno = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].gstno;
    this.owneraadharno = this.ownerjointownerForm
      .get('ownerdetailArr')
      ?.getRawValue().itemDetailBreakUp[ownerIndex].aadharno;
    this.ownerrelation = this.fetchFirstelementvaluefromObject(
      //this.ownerjointownerForm.get('Permanenetaddress')?.get('city')?.value,
      this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
        .itemDetailBreakUp[ownerIndex].relation,
      0,
      0
    )?.trim();
  }
  funcBookingRequestBean(
    CommonRequestBean: any,
    StrPrmOwnerId: String = '',
    StrPrmBldgCode: String = ''
  ) {
    CommonRequestBean = {
      ownerid: StrPrmOwnerId,
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),

      bldgcode: StrPrmBldgCode,
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
      floor: this.StrFlatFloor, // came from Flat
      area: this.Strbunitarea, // came from Flat
      overon: '',
      ho2owner: '',
      agprice: this.bookingForm.get('aggrementprize')?.value,
      contracton: '',
      amtrec: 0, /// ask gopal
      amtos: this.bookingForm.get('aggrementprize')?.value,
      //leasedto: this.bookingForm.get('ohdhbldgcode')?.value,
      //leaseref: this.bookingForm.get('ohdhbldgcode')?.value,
      accomtype: this.bookingForm.get('unittype')?.value,
      salestatus: '',
      custtype: this.fetchFirstelementvaluefromObject(
        this.bookingForm.get('custtype')?.value,
        0,
        0
      )?.trim(),
      saletype: this.bookingForm.get('bookingtype')?.value,
      poacode: '',
      poaname: this.bookingForm.get('powerofattorney')?.value,
      maintrate: 0,
      mpaidyymm: '',
      //mpaidref: this.bookingForm.get('ohdhbldgcode')?.value,
      //mpaiddate: this.bookingForm.get('ohdhbldgcode')?.value,
      broker: this.bookingForm.get('broker')?.value,
      bookedby: this.bookingForm.get('bookby')?.value,
      ledby: '', //this.bookingForm.get('firstvisitExecutive')?.value,
      //cancelled: this.bookingForm.get('ohdhbldgcode')?.value,
      //validtill: this.bookingForm.get('ohdhbldgcode')?.value,
      //serialnum: this.bookingForm.get('ohdhbldgcode')?.value,
      brokent: this.bookingForm.get('brokerent')?.value,
      brokpaid: 0,
      brokos: this.bookingForm.get('brokerent')?.value,
      //date: this.bookingForm.get('bookdate')?.value,
      date: moment(
        this.bookingForm.get('bookdate')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),

      remarks: this.bookingForm.get('remarks')?.value,
      customercoy: this.bookingForm.get('Customercompany')?.value,
      designation: this.bookingForm.get('designation')?.value,
      broktdsper: 0,
      broktdsamd: 0,
      discount: 0,
      broktdsamt: 0,
      panum: this.ownerpanno, //this.itemBreakUpFormArr.controls[0].get('panno')?.value,
      community: this.fetchFirstelementvaluefromObject(
        this.bookingForm.get('community')?.value,
        0,
        0
      )?.trim(),

      jobprofile: this.bookingForm.get('jobprofile')?.value,
      scheduledpossession: this.bookingForm.get('shedulepossession')?.value,
      firstvisitexec: this.bookingForm.get('firstvisitExecutive')?.value,
      firstvisitdate: moment(
        this.bookingForm.get('firstvisitdate')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),
      //broktranser: this.bookingForm.get('ohdhbldgcode')?.value,
      regprice: 0, //tobb set for other building
      gstno: '',
      regfees: this.bookingForm.get('registrationfee')?.value, //to be set for other bulding
      regno: this.bookingForm.get('registrationno')?.value,
      soi: this.bookingForm.get('soi')?.value,
      leaddate: moment(
        this.bookingForm.get('firstvisitdate')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),
      aadharno: this.owneraadharno, //this.itemBreakUpFormArr.controls[0].get('aadharno')?.value,
    };
    return CommonRequestBean;
  }

  funcPartyRequestBean(CommonRequestBean: any, StrPrmPartyCode: String = '') {
    this.funcRetriveOwnerDetailFromGrid(0);
    CommonRequestBean = {
      aadharno: this.owneraadharno,
      cino: '',
      city: this.fetchFirstelementvaluefromObject(
        this.ownerjointownerForm.get('Permanenetaddress')?.get('city')?.value,
        0,
        0
      )?.trim(),

      //closedate: '01/01/2050',
      constt: '',
      esicno: '',
      gstno: this.ownergstno,
      //insupd: '',
      //lastintpaid: '',
      //ltdcoyn: '',
      //oldrefdate: '',
      opendate: moment(
        this.bookingForm.get('bookdate')?.value,
        'DD/MM/YYYY'
      ).format('DD/MM/YYYY'),

      ostaxregncen: '',
      ostaxregnst: '',
      pannum1: this.ownerpanno,
      partycode: StrPrmPartyCode,
      partyname: this.ownername,
      partytype: 'F',
      //payeeBranch1: '',
      //payeeBranch2: '',
      //payeeIfsc1: '',
      //payeeIfsc2: '',
      //payeeacNum1: '',
      //payeeacNum2: '',
      //payeebankcode1: '',
      //payeebankcode2: '',
      //payeebankname1: '',
      //payeebankname2: '',
      //pfNo: '',
      pmtacnum: this.ownerpanno,
      //professionTaxno: '',
      //rcnum: '',
      //servicetaxnum: '',
      //staxregncen: '',
      //staxregnst: '',
      //supptype: '',
      //tanNo: '',
      //tinnum: '',
      title: this.fetchFirstelementvaluefromObject(
        this.itemBreakUpFormArr.controls[0].get('title')?.value,
        0,
        0
      )?.trim(),
      validminor: 'Y',
      validparty: 'Y',
      //vatEffectiveFrom: '',
      //vatcanceldt: '',
      //vatnum: '',
    };
    return CommonRequestBean;
  }
  funcLoanHistoryRequestBean(CommonRequestBean: any) {
    let newLoanHistArr = [];
    const totalRows = (
      this.paymentsheduleForm
        ?.get('loanDetailHistryArr')
        ?.get('loanDetailHistryBreakUp') as FormArray
    ).length;

    console.log('total Owner', totalRows);
    for (let i = 0; i < totalRows; i++) {
      let loanHistryitem = this.paymentsheduleForm
        ?.get('loanDetailHistryArr')
        ?.get('loanDetailHistryBreakUp')?.value[i];
      if (loanHistryitem) {
        newLoanHistArr.push({
          ...loanHistryitem,
        });
      }
    }
    console.log('newLoanHistArr', newLoanHistArr);
    CommonRequestBean = JSON.parse(JSON.stringify(newLoanHistArr));
    console.log('CommonRequestBean for loan hist', CommonRequestBean);
    return CommonRequestBean;
  }
  funcFlatRequestBean() {
    this.flatsRequestBean = {
      accomtype: '',
      agprice: 0,
      amtos: 0,
      amtrec: 0,
      bamenarea: 0,
      bldgcode: '',
      bparkarea: 0,
      broker: '',
      bteraarea: 0,
      bunitarea: 0,
      camenarea: 0,
      config: '',
      contracton: '',
      coy: '',
      cparkarea: 0,
      cteraarea: 0,
      cunitarea: 0,
      curera: 0,
      custid: '',
      custtype: '',
      dboperation: '',
      discount: 0,
      enclbalcrera: 0,
      flatnum: '',
      flatpark: '',
      floor: '',
      ho2owner: '',
      intrate: 0,
      isUpdate: true,
      leasedto: '',
      leaseref: '',
      loanamt: 0,
      loanbranch: '',
      loanclosedate: '',
      loanco: '',
      loannum: '',
      loanpaid: 0,
      loanyn: '',
      maintrate: 0,
      mflatbldg: '',
      mflatno: '',
      mflatwing: '',
      mpaiddate: '',
      mpaidref: '',
      mpaidyymm: '',
      nocdt: '',
      nocrcvddate: '',
      noctype: '',
      occupdate: '',
      oldflatnum: '',
      oldwing: '',
      origcoy: '',
      overon: '',
      ownerid: '',
      poacode: '',
      poaname: '',
      proptax: 0,
      psind: '',
      ratesft: 0,
      rebaterfnd: 0,
      refunddate: '',
      remarks: '',
      salestatus: '',
      saletype: '',
      soldyn: '',
      stampduty: 0,
      ufdiscount: '',
      wing: '',
      xtradate: '',
      xtrarfnd: 0,
    };
    return this.flatsRequestBean;
  }

  funcFlatPayAltBldgRequestBean(CommonRequestBean: any, Ownerid: String = '') {
    let newPaymentsheduleArr = [];
    const totalRows = (
      this.paymentsheduleForm
        ?.get('itemDetailOtherBuildingArr')
        ?.get('itemDetailOtherBuildingBreakUp') as FormArray
    ).length;

    console.log('total Owner', totalRows);
    for (let i = 0; i < totalRows; i++) {
      let paymentsheduleitem = this.paymentsheduleForm
        ?.get('itemDetailOtherBuildingArr')
        ?.get('itemDetailOtherBuildingBreakUp')?.value[i];
      if (paymentsheduleitem) {
        newPaymentsheduleArr.push({
          ...paymentsheduleitem,
          ownerid: Ownerid,
        });
      }
    }
    console.log('newPaymentsheduleArr', newPaymentsheduleArr);
    CommonRequestBean = JSON.parse(JSON.stringify(newPaymentsheduleArr));
    console.log('CommonRequestBean', CommonRequestBean);
    return CommonRequestBean;
  }

  funcFlatPayRequestBean(CommonRequestBean: any, Ownerid: String = '') {
    let newPaymentsheduleArr = [];
    const totalRows = (
      this.paymentsheduleForm
        ?.get('itemDetailOurBuildingArr')
        ?.get('itemDetailOurBuildingBreakUp') as FormArray
    ).length;

    console.log('total Owner', totalRows);
    for (let i = 0; i < totalRows; i++) {
      let paymentsheduleitem = this.paymentsheduleForm
        ?.get('itemDetailOurBuildingArr')
        ?.get('itemDetailOurBuildingBreakUp')?.value[i];
      if (paymentsheduleitem) {
        newPaymentsheduleArr.push({
          ...paymentsheduleitem,
          ownerid: Ownerid,
        });
      }
    }
    console.log('newPaymentsheduleArr', newPaymentsheduleArr);
    CommonRequestBean = JSON.parse(JSON.stringify(newPaymentsheduleArr));
    console.log('CommonRequestBean', CommonRequestBean);
    return CommonRequestBean;
  }
  //cross verify with gopal
  funcBldgWingMapRequestBean() {
    this.bldgwingmapRequestBean = {
      altbldgcode: '',
      altwing: '',
      bldgcode: '',
      bldgwing: '',
      infrabldgcode: '',
      infrawing: '',
      isUpdate: '',
      maintbldgcode: '',
      maintwing: '',
    };
    return this.bldgwingmapRequestBean;
  }

  funcFlatOwnerRequestBean(
    CommonRequestBean: any,
    buildingCode: any,
    OwnerId: any
  ) {
    let newArr = [];
    const totalRows = (
      this.ownerjointownerForm
        ?.get('ownerdetailArr')
        ?.get('itemDetailBreakUp') as FormArray
    ).length;

    console.log('total Owner', totalRows);
    for (let i = 0; i < totalRows; i++) {
      let item = this.ownerjointownerForm
        ?.get('ownerdetailArr')
        ?.get('itemDetailBreakUp')?.value[i];
      if (item) {
        newArr.push({
          //...item,
          title: this.fetchFirstelementvaluefromObject(
            this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
              .itemDetailBreakUp[i].title,
            0,
            0
          )?.trim(),
          name: this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
            .itemDetailBreakUp[i].name,
          panno: this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
            .itemDetailBreakUp[i].panno,
          gstno: this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
            .itemDetailBreakUp[i].gstno,
          aadharno: this.ownerjointownerForm
            .get('ownerdetailArr')
            ?.getRawValue().itemDetailBreakUp[i].aadharno,
          relation: this.fetchFirstelementvaluefromObject(
            this.ownerjointownerForm.get('ownerdetailArr')?.getRawValue()
              .itemDetailBreakUp[i].relation,
            0,
            0
          )?.trim(),

          flatnum: this.fetchFirstelementvaluefromObject(
            this.bookingSelection.get('flatnum')?.value,
            0,
            0
          )?.trim(),
          ownertype: '', //chk
          city: this.fetchFirstelementvaluefromObject(
            this.ownerjointownerForm.get('Permanenetaddress')?.get('city')
              ?.value,
            0,
            0
          )?.trim(),
          custtype: this.fetchFirstelementvaluefromObject(
            this.bookingSelection.get('custtype')?.value,
            0,
            0
          )?.trim(),
          floor: this.StrFlatFloor,
          infradmin: 0,
          inframonths: 0,
          infrrate: 0,
          elect: 0, //y
          maintrate: 0,
          nreacnum: '',
          nrebank: '',
          nriipi7: '',
          nrinat: '',
          nripass: this.bookingSelection.get('nripass')?.value,

          nripassiss: this.bookingSelection.get('nriIssuedOn')?.value
            ? moment(
                this.bookingSelection.get('nriIssuedOn')?.value,
                'DD/MM/YYYY'
              ).format('DD/MM/YYYY')
            : null,

          nripedate: this.bookingSelection.get('nripedate')?.value
            ? moment(
                this.bookingSelection.get('nripedate')?.value,
                'DD/MM/YYYY'
              ).format('DD/MM/YYYY')
            : null,

          nripnat: this.fetchFirstelementvaluefromObject(
            this.bookingSelection.get('nrinat')?.value,
            0,
            0
          )?.trim(),

          nrippidate: this.bookingSelection.get('nrippidate')?.value
            ? moment(
                this.bookingSelection.get('nrippidate')?.value,
                'DD/MM/YYYY'
              ).format('DD/MM/YYYY')
            : null,

          nriprof: this.bookingSelection.get('nriprof')?.value,
          nriteloff: this.bookingSelection.get('nriteloff')?.value,
          nritelres: this.bookingSelection.get('nritelres')?.value,
          nroacnum: this.bookingSelection.get('nroacnum')?.value,
          nrobank: this.bookingSelection.get('nrobank')?.value,
          ogendmm: '',
          ogintpaid: 0,
          ogmonths: 0,
          ogstartmm: '',
          ownerid: OwnerId,
          //panno: '',
          poanat: '',
          poapass: '',
          poapassiss: '',
          poappidate: '',
          poaprof: '',
          //relation: '',
          //title: '',
          township: this.fetchFirstelementvaluefromObject(
            this.ownerjointownerForm.get('Permanenetaddress')?.get('town')
              ?.value,
            0,
            0
          )?.trim(),
          vipyn: '',
          water: 0,
          wing: this.fetchFirstelementvaluefromObject(
            this.bookingSelection.get('wing')?.value,
            0,
            0
          ),
          //aadharno: '',
          adminrate: '',
          auxiadmin: '',
          auximonths: '',
          //auxirate: '',
          billmode: 'Q',
          bldgcode: buildingCode,
          cencard: '',
          //gstno: '',
        });
      }
    }
    console.log('newArr', newArr);
    CommonRequestBean = JSON.parse(JSON.stringify(newArr));
    //console.log("CommonRequestBean",CommonRequestBean);
    return CommonRequestBean;
  }

  FuncFlatCharRequestBean(CommonRequestBean: any) {
    this.CommonAmtPaidRequestBean = {
      accomtype: 'F',
      amtdue: this.bookingForm.get('aggrementprize')?.value,
      amtpaid: 0,
      bldgcode: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('bldgcode')?.value,
        0,
        0
      )?.trim(),
      chargecode: 'COST',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: 'Y',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };
    this.CommonSTAMDUTYRequestBean = {
      accomtype: 'F',
      amtdue: this.IntPriStampduty, //call API to cal STAMP Duty
      amtpaid: 0,
      bldgcode: '',
      chargecode: 'STAM',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: '',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };
    this.CommonTDSRequestBean = {
      accomtype: 'F',
      amtdue: this.IntPriTDSAmt,
      amtpaid: 0,
      bldgcode: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('bldgcode')?.value,
        0,
        0
      )?.trim(),
      chargecode: 'TDSD',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: '',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };

    CommonRequestBean = [
      this.CommonAmtPaidRequestBean,
      this.CommonSTAMDUTYRequestBean,
      this.CommonTDSRequestBean,
    ];

    return CommonRequestBean;
  }
  FuncFlatCharAltBldgRequestBean(CommonRequestBean: any) {
    this.CommonAmtPaidRequestBean = {
      accomtype: 'F',
      amtdue: this.bookingForm.get('ownerbldgprice')?.value,
      amtpaid: 0,
      bldgcode: this.StrAltBldgCode,
      chargecode: 'COST',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: 'Y',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };
    this.CommonSTAMDUTYRequestBean = {
      accomtype: 'F',
      amtdue: 0,
      amtpaid: 0,
      bldgcode: this.StrAltBldgCode,
      chargecode: 'STAM',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: '',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };

    this.CommonTDSRequestBean = {
      accomtype: 'F',
      amtdue: this.IntPriTDSAmt,
      amtpaid: 0,
      bldgcode: this.StrAltBldgCode,
      chargecode: 'TDSD',
      flatnum: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('flatnum')?.value,
        0,
        0
      )?.trim(),
      sqftwiseyn: '',
      wing: this.fetchFirstelementvaluefromObject(
        this.bookingSelection.get('wing')?.value,
        0,
        0
      ),
    };

    CommonRequestBean = [
      this.CommonAmtPaidRequestBean,
      this.CommonSTAMDUTYRequestBean,
      this.CommonTDSRequestBean,
    ];

    return CommonRequestBean;
  }

  funcBindAddresRequestBean(
    CommonRequestBean: any,
    addressTypeRequestBeanName: any,
    OwnerId: any,
    AddType: any
  ) {
    //console.log("addres",addressType);
    CommonRequestBean = {
      adr1: addressTypeRequestBeanName.get('flatnofr')?.value,
      ad2: addressTypeRequestBeanName.get('buildingname')?.value,
      ad3: addressTypeRequestBeanName.get('complex')?.value,
      ad4: addressTypeRequestBeanName.get('road')?.value,
      ad5: addressTypeRequestBeanName.get('landmark')?.value,
      adsegment: 'PARTY',
      adtype: AddType,
      town: this.fetchFirstelementvaluefromObject(
        addressTypeRequestBeanName.get('town')?.value,
        0,
        0
      )?.trim(),

      city: this.fetchFirstelementvaluefromObject(
        addressTypeRequestBeanName.get('city')?.value,
        0,
        0
      )?.trim(),

      country: this.fetchFirstelementvaluefromObject(
        addressTypeRequestBeanName.get('country')?.value,
        0,
        0
      )?.trim(),

      email: addressTypeRequestBeanName.get('emailid')?.value,
      fax: addressTypeRequestBeanName.get('fax')?.value,
      fname: this.StrPrifistOwnerName,
      //insupd: addressType.get('flatnofr')?.value,
      //lname: '', //addressType.get('flatnofr')?.value, from 0 owner id
      //mname: '', //addressType.get('flatnofr')?.value,
      owner: OwnerId, //addressType.get('flatnofr')?.value, value chk
      phonemobile: addressTypeRequestBeanName.get('mobile')?.value,
      phoneoff: addressTypeRequestBeanName.get('teloffice')?.value,
      phoneres: addressTypeRequestBeanName.get('telres')?.value,
      pincode: addressTypeRequestBeanName.get('pincode')?.value,
      //rcnum: addressTypeRequestBeanName.get('flatnofr')?.value,
      //ser: addressTypeRequestBeanName.get('flatnofr')?.value,
      site: this.fetchFirstelementvaluefromObject(
        addressTypeRequestBeanName.get('site')?.value,
        0,
        0
      )?.trim(),

      state: this.fetchFirstelementvaluefromObject(
        addressTypeRequestBeanName.get('state')?.value,
        0,
        0
      )?.trim(),

      title: this.fetchFirstelementvaluefromObject(
        this.itemBreakUpFormArr.controls[0].get('title')?.value,
        0,
        0
      )?.trim(),
    };

    console.log('commmn req', CommonRequestBean);

    return CommonRequestBean;
  }

  fetchFirstelementvaluefromObject(
    prameterValue: any,
    paramIndex: number,
    positionparamIndex: number
  ) {
    //console.log("prameterValue",prameterValue);

    if (typeof prameterValue == 'undefined' || prameterValue == '') {
      return '';
    } else {
      this.fetchvalueArray = prameterValue;
      return this.fetchvalueArray[paramIndex][positionparamIndex];
    }
  }

  //save booking details
  saveBookingDetails() {
    // console.log(
    //   'inside save',
    //   this.itemBreakUpFormArr.controls[0].get('name')?.value
    // );
    //let newArr = [];
    // newArr.push(
    //   firstval
    // );
    // console.log("push value",newArr);
    //console.log("ownerName",this.ownerjointownerForm.controls.itemDetailBreakUp.getRawValue()[0][0]);
    this.StrPrifistOwnerName = this.ownername;

    //this.itemBreakUpFormArr.controls[0].get('name')?.value;
    this.bookingRequestBean1 = this.funcBookingRequestBean(
      'bookingRequestBean',
      this.StrPriOwnerId,
      this.strbuilding
    );

    this.addressmailRequestBean1 = this.funcBindAddresRequestBean(
      'addressmailRequestBean',
      this.ownerjointownerForm.controls['mailingaddress'],
      this.StrPriOwnerId,
      'MAIL'
    );

    this.addresspmtRequestBean1 = this.funcBindAddresRequestBean(
      'addresspmtRequestBean',
      this.ownerjointownerForm.controls['Permanenetaddress'],
      this.StrPriOwnerId,
      'PMT'
    );
    this.bldgwingmapRequestBean1 = this.funcBldgWingMapRequestBean();

    //for flatchar
    this.flatcharRequestBean1 = this.FuncFlatCharRequestBean(
      'flatcharRequestBean'
    );
    //for flatowner
    this.flatownerRequestBean1 = this.funcFlatOwnerRequestBean(
      'flatownerRequestBean',
      this.bookingSelection.get('ohdhbldgcode')?.value,
      this.StrPriOwnerId
    );

    // Flat Pay
    this.flatpayRequestBean1 = this.funcFlatPayRequestBean(
      'flatpayRequestBean',
      this.StrPriOwnerId
    );

    //Loan histry
    this.loanhistoryRequestBean1 = this.funcLoanHistoryRequestBean(
      'loanhistoryRequestBean'
    );

    //Party
    this.partyRequestBean1 = this.funcPartyRequestBean(
      'partyRequestBean',
      this.StrLocPartyCode
    );

    const bookingRequestBean = Object.assign({
      bookingRequestBean: this.bookingRequestBean1,
    });

    bookingRequestBean.bookingRequestBean['addressmailRequestBean'] =
      this.addressmailRequestBean1;

    bookingRequestBean.bookingRequestBean['addresspmtRequestBean'] =
      this.addresspmtRequestBean1;
    bookingRequestBean.bookingRequestBean['bldgwingmapRequestBean'] =
      this.bldgwingmapRequestBean1;
    bookingRequestBean.bookingRequestBean['flatcharRequestBean'] =
      this.flatcharRequestBean1;
    bookingRequestBean.bookingRequestBean['flatownerRequestBean'] =
      this.flatownerRequestBean1;
    // bookingRequestBean.bookingRequestBean['flatpayOtherBldgRequestBean'] =
    //   this.flatpayOtherBldgRequestBean1;
    bookingRequestBean.bookingRequestBean['flatpayRequestBean'] =
      this.flatpayRequestBean1;
    // bookingRequestBean.bookingRequestBean['flatsRequestBean'] =
    //   this.flatsRequestBean1;
    bookingRequestBean.bookingRequestBean['loanhistoryRequestBean'] =
      this.loanhistoryRequestBean1;
    bookingRequestBean.bookingRequestBean['partyRequestBean'] =
      this.partyRequestBean1;

    //const bookingRequestBean = Object.assign({}, this.bookingRequestBean1, this.addressmailRequestBean1);
    console.log('mergedObject', bookingRequestBean);

    let savePayload = {
      ...bookingRequestBean,
    };
    //payload for alternet building
    this.bookingAltBldgRequestBean1 = this.funcBookingRequestBean(
      'bookingAltBldgRequestBean',
      this.StrPriAltOwnerId,
      this.StrAltBldgCode
    );

    //for address
    this.addressmailAltBldgRequestBean1 = this.funcBindAddresRequestBean(
      'addressmailAltBldgRequestBean',
      this.ownerjointownerForm.controls['mailingaddress'],
      this.StrPriAltOwnerId,
      'MAIL'
    );

    this.addresspmtAltBldgRequestBean1 = this.funcBindAddresRequestBean(
      'addresspmtAltBldgRequestBean',
      this.ownerjointownerForm.controls['Permanenetaddress'],
      this.StrPriAltOwnerId,
      'PMT'
    );

    //Building Wing Map
    (this.bldgwingmapRequestBean1 = this.funcBldgWingMapRequestBean()),
      //for flatchar
      (this.flatcharAltBldgRequestBean1 = this.FuncFlatCharAltBldgRequestBean(
        'flatcharAltBldgRequestBean'
      ));

    //for flatowner
    this.flatownerAltBldgRequestBean1 = this.funcFlatOwnerRequestBean(
      'flatownerAltBldgRequestBean',
      this.StrAltBldgCode,
      this.StrPriAltOwnerId
    );

    // Flat Pay
    this.flatpayAltBldgRequestBean1 = this.funcFlatPayRequestBean(
      'flatpayAltBldgRequestBean',
      this.StrPriAltOwnerId
    );

    //diss and then do later
    //bldgwingmap table
    // flatpayAltBldgRequestBean: this.funcFlatPayAltBldgRequestBean(
    //   'flatpayAltBldgRequestBean',
    //   this.StrPriOutSideOwnerId
    // ),

    //Loan histry
    this.loanhistoryAltBldgRequestBean1 = this.funcLoanHistoryRequestBean(
      'loanhistoryAltBldgRequestBean'
    );

    //Party
    this.partyAltBldgRequestBean1 = this.funcPartyRequestBean(
      'partyAltBldgRequestBean',
      this.StrLocAltPartyCode
    );

    const bookingAltBldgRequestBean = Object.assign({
      bookingAltBldgRequestBean: this.bookingAltBldgRequestBean1,
    });
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'addressmailAltBldgRequestBean'
    ] = this.addressmailAltBldgRequestBean1;

    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'addresspmtAltBldgRequestBean'
    ] = this.addresspmtAltBldgRequestBean1;

    // bookingAltBldgRequestBean.bookingAltBldgRequestBean[
    //   'bldgwingmapRequestBean'
    // ] = this.bldgwingmapRequestBean1;
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'flatcharAltBldgRequestBean'
    ] = this.flatcharAltBldgRequestBean1;
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'flatownerAltBldgRequestBean'
    ] = this.flatownerAltBldgRequestBean1;
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'flatpayAltBldgRequestBean'
    ] = this.flatpayAltBldgRequestBean1;
    // bookingAltBldgRequestBean.bookingAltBldgRequestBean['flatsRequestBean'] =
    //   this.flatsRequestBean1;
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'loanhistoryAltBldgRequestBean'
    ] = this.loanhistoryAltBldgRequestBean1;
    bookingAltBldgRequestBean.bookingAltBldgRequestBean[
      'partyAltBldgRequestBean'
    ] = this.partyAltBldgRequestBean1;

    let savePayload1 = {
      ...bookingAltBldgRequestBean,
    };

    //let savePayload1 = {};
    //savePayload1 = JSON.parse(JSON.stringify(savePayload1));

    //console.log('PayLod', savePayload);

    if (this.tranMode == 'A') {
      //for add new booking data
    } else if ((this.tranMode = 'R')) {
      console.log('inside Rerive save', this.tranMode);
      this.loaderToggle = true;
      console.log('PayLod', savePayload);
      this.bookingservice.updatebooking(savePayload, savePayload1).subscribe({
        //this.bookingservice.updatebooking(savePayload).subscribe({
        next: (res) => {
          //console.log('save res', res);
          this.loaderToggle = false;
          if (res.status) {
            Swal.fire({
              title: 'Booking Details',
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
}
