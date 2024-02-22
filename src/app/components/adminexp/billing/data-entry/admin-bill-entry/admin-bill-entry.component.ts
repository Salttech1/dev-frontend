import { Moment } from 'moment';
// Developed By  - 	Atul
// Mode  - Data Entry
// Class Name - AdminBillEntryComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Enter admin bill details
// ' Reports Used -

// ' Modification Details
// '=======================================================================================================================================================
// ' Date		Author  Version User    Reason
// '=======================================================================================================================================================
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { ServiceService } from 'src/app/services/service.service';

import { take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as moment from 'moment';
import { error } from 'jquery';

@Component({
  selector: 'app-admin-bill-entry',
  templateUrl: './admin-bill-entry.component.html',
  styleUrls: ['./admin-bill-entry.component.css'],
})
export class AdminBillEntryComponent implements OnInit {
  initialMode: Boolean = false; // use for form hide and show
  maxDate = new Date(); // use for future date disabled
  isBackClicked: boolean = false; // use for back button
  tranMode: String = '';
  loaderToggle: boolean = false; // use for loader
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`; // use for party type filter
  filter_suppType = `TRIM(ENT_ID) in ('M','S')`;
  filter_billType = `TRIM(ENT_ID) in ('T', 'B')`;
  filter_minType = '';
  filter_acminor = '';
  filter_expId = '';

  config: any = {
    isLoading: false,
    url: '',
    isBillEntryShow: false,
    gstnFlagList: [
      { id: 'Y', name: 'GST' },
      { id: 'N', name: 'Without GST' },
    ],
    gstnFlag: 'N',
    isAdd: true,
    printSerialNumber: '',
    isSales: false,
    isFormValid: false,
    calculatedTaxAmt: 0,
    selfEnteredTaxAmt: 0,
  };

  filters: any = {
    getCoy: '',
    getBldg: '',
    partyCode: '',
    getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",
    getPartyType: "par_partytype='Z'",
    getRefPartyType: "par_partytype='Z'",
    getSerial: '',
    getBgldCode: '',
    getSerialDefaultValue: " Nvl(adblh_status,'1') = '1'",
    getInvoiceByFilter: '',
    getSerialNumByFilter: '',
  };
  renderer: any;

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'save',
    'reset',
    'print',
    'back',
    'exit',
  ]);

  /////////////////////////////////////////// atul
  //// initialising form [by- ATUL]
  /////////////////////////////////////////// atul

  billEntryForm: FormGroup = this.fb.group(
    {
      isPartyLimited: [false],
      gstrevchgyn: ['N'],
      isLegal: [false],
      isSecurity: [false],
      coyCode: ['', Validators.required], // unregister ALAN
      partyType: ['Z', Validators.required],
      partyCode: ['', Validators.required], //KDEV
      partyName: [{ value: '', disabled: true }],
      bldgCode: ['', Validators.required], //GODS
      bldgName: [{ value: '', disabled: true }],
      suppBillNo: ['', Validators.required],
      serNo: [''], // old entry BO00076817
      partyGstNo: [{ value: '', disabled: true }],
      companyGstNo: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      stateName: [{ value: '', disabled: true }],
      orderBy: [''],
      refPartyType: [''],
      refPartyCode: [''],
      refPartyName: [{ value: '', disabled: true }],
      exptype: [''],
      billType: [''],
      suppbilldt: new FormControl(),
      invoiceAmt: [''],
      acmajor: [''],
      minType: [''],
      acMinor: [''],
      expClass: [''],
      expId: [''],
      period: this.fb.group({
        fromdate: [''], //fromdate: ['', [checkDate()]],
        uptodate: [''],
      }),
      tdsAcMajor: [''],
      tdsPerc: [''],
      tdsAmount: [{ value: '', disabled: false }],
      narration: [''],
      paidAdvn: [{ value: '', disabled: true }],
      adjustedAdvn: [{ value: '', disabled: true }],
      balAdvn: [{ value: 100, disabled: true }],
      adjustAdvn: [''],
      otherCharg: [''],
      admbillList: this.fb.array([]),
      totalTaxableAmmt: [0],
      totalWithGSTAmmt: [0],
    },
    { validator: this.adjustAdvnValidator }
  );

  adjustAdvnValidator(control: any): { [key: string]: boolean } | null {
    // first  add validation
    // const balAdvn = control.get('balAdvn');
    const balAdvn = control.get('paidAdvn');
    const adjustAdvn = control.get('adjustAdvn');
    if (Number(balAdvn?.value) < Number(adjustAdvn?.value)) {
      return { invalidAdjustAdvn: true };
    }
    return null;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private commonService: CommonService,
    private router: Router,
    private dailog: MatDialog,
    private service: ServiceService,
    private modalService: ModalService,

    private commonReport: CommonReportsService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.config.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];

    this.config.isSales = this.config.url.includes('billentrysales');

    //disabled default buttons
    this.commonService.enableDisableButtonsByIds(
      ['save', 'print'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'back', 'back', 'exit'],
      this.buttonsList,
      false
    );
  }

  buttonAction(event: string) {
    console.log('form value', this.billEntryForm);

    this.setValueOnLeaveInputFiled();
    if (event == 'add') {
      this.updateValidators(true);
      this.removeValidationForInvoiceNumber();
      this.onClickAdd();
    } else if (event == 'retrieve') {
      this.updateValidators(false);
      this.onClickRetrive();
    } else if (event == 'save') {
      this.invocieAmtValidation();
    } else if (event == 'print') {
      this.getPrint(true);
    } else if (event == 'reset') {
      this.onClickReset();
      this.filters.getSerial = '';
      for (const key in this.filters) {
        if (this.filters.hasOwnProperty(key)) {
          if (
            key != 'getPartyCodeUsingPartyType' &&
            key != 'getSerialDefaultValue'
          )
            this.filters[key] = null; // You can use undefined or '' (empty string) as well
        }
      }
      this.updateValidators(true);
    } else if (event == 'back') {
      this.resetForm();
      this.updateValidators(true);
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  onClickReset() {
    if (this.billEntryForm.getRawValue().partyGstNo) {
      this.config.calculatedTaxAmt = 0;
      const formArray = this.billEntryForm.get('admbillList') as FormArray;
      formArray.clear();
      this.addBillEntryList();
      this.billEntryForm.patchValue({
        orderBy: '',
        refPartyType: '',
        refPartyCode: '',
        refPartyName: '',
        exptype: '',
        billType: '',
        suppbilldt: '',
        invoiceAmt: '',
        acmajor: '',
        minType: '',
        acMinor: '',
        expClass: '',
        expId: '',
        period: {
          fromdate: '',
          uptodate: '',
        },
        tdsAcMajor: '',
        tdsPerc: '',
        tdsAmount: '',
        adjustAdvn: '',
        narration: '',
        otherCharg: '',
      });
    } else {
      this.billEntryForm.reset();
    }

    this.billEntryForm.get('minType')?.enable();
    this.billEntryForm.get('acMinor')?.enable();
  }

  onClickAdd() {
    if (this.billEntryForm.valid) {
      this.fetchGstAndBasicDetails();
    } else {
      this.showErroPopup();
    }
  }
  onClickRetrive() {
    if (this.billEntryForm.valid) {
      this.config.isLoading = true;

      let parms = {
        ser: this.commonService.convertArryaToString(
          this.billEntryForm.get('serNo')?.value
        ),
      };

      this.http
        .request('get', api_url.getAdminDetailsBySerNo, null, parms)
        .subscribe({
          next: (res: any) => {
            this.config.isLoading = false;
            if (res.success) {
              if (res.data.admbillh.adblhStatus) {
                this.showErrorFieldDialog(
                  'K-Raheja ERP',
                  "You can't modify this bill. This bill is already passed / paid",
                  'error'
                );
              } else {
                this.config.isBillEntryShow = true;
                this.config.isLoading = false;
                this.config.isAdd = false;

                this.billEntryForm.patchValue({
                  coyCode: res.data.admbillh.adblhCoy,
                  partyType: res.data.admbillh.adblhPartytype,
                  partyCode: res.data.admbillh.adblhPartycode,
                  bldgCode: res.data.admbillh.adblhBldgcode,
                  suppBillNo: res.data.admbillh.adblhSuppbillno,
                  partyGstNo: res.data.gstNo,
                  state: res.data.stateCode,
                  stateName: res.data.stateName,
                  orderBy: res.data.admbillh.adblhOrderedby,
                  refPartyType: res.data.docParType,
                  refPartyCode: res.data.docParCode,
                  refPartyName: res.data.refPartyDesc,
                  exptype: res.data.admbillh.adblhExptype,
                  billType: res.data.admbillh.adblhBilltype,
                  suppbilldt: res.data.admbillh.adblhSuppbilldt,
                  invoiceAmt: res.data.admbillh.adblhBillamount,
                  acmajor: res.data.admbillh.adblhAcmajor,
                  minType: res.data.admbillh.adblhMintype,
                  acMinor: res.data.admbillh.adblhAcminor,
                  expClass: res.data.admbillh.adblhSunclass,
                  expId: res.data.admbillh.adblhSunid?.trimEnd(),
                  period: {
                    fromdate: res.data.admbillh.adblhFromdate,
                    uptodate: res.data.admbillh.adblhTodate,
                  },
                  tdsAcMajor: res.data.admbillh.adblhTdsacmajor,
                  tdsPerc: res.data.admbillh.adblhTdsperc,
                  tdsAmount: res.data.admbillh.adblhTdsamount,
                  narration: res.data.admbillh.adblhNarration,
                  paidAdvn: res.data.totPaidAdvance,
                  adjustedAdvn: res.data.adjustedAdvn,
                  balAdvn: res.data.totPaidAdvance - res.data.adjustedAdvn,
                  adjustAdvn: res.data.admbillh.adblhAdvnadjust,
                  otherCharg: res.data.admbillh.adblhFotoamount,
                });

                this.config.selfEnteredTaxAmt =
                  res.data.admbillh.adblhTdsamount;
                this.onLeaveTDS(res.data.admbillh.adblhTdsperc, true);

                const disableFiledList = [
                  'coyCode',
                  'partyType',
                  'partyCode',
                  'bldgCode',
                  'suppBillNo',
                ];

                disableFiledList.map((item) => {
                  this.billEntryForm.get(item)?.disable();
                });

                res.data.admbilld.map((item: any) => {
                  this.addBillEntryList(item);
                });

                this.setValueOnLeaveInputFiled();

                this.filters.getPartyType =
                  "par_partytype='" + res.data.admbillh.adblhPartytype + "'";
                this.filter_expId =
                  `sun_class = '` + res.data.admbillh.adblhSunclass + `'`;
                this.filter_minType =
                  `vmin_acmajor = '` + res.data.admbillh.adblhAcmajor + `'`;

                this.onLeaveAcMajor(res.data.admbillh.adblhAcmajor, true);

                setTimeout(() => {
                  document.getElementById('id_orderBy')?.focus();
                }, 0);

                this.commonService.enableDisableButtonsByIds(
                  ['save', 'back', 'reset', 'print', 'exit'],
                  this.buttonsList,
                  false
                );
                this.commonService.enableDisableButtonsByIds(
                  ['add', 'retrieve'],
                  this.buttonsList,
                  true
                );
              }
            } else {
              this.toastr.error(res.message);
            }
          },
        });
    } else {
      this.showErroPopup();
    }
  }

  isAdvanceCheck() {
    this.removeValidationForInvoiceNumber();

    if (
      this.billEntryForm.getRawValue().adjustAdvn == '' ||
      this.billEntryForm.getRawValue().adjustAdvn == undefined ||
      this.billEntryForm.getRawValue().adjustAdvn == null
    ) {
      if (this.billEntryForm.valid) {
        const dialogRef = this.dailog.open(ModalComponent, {
          disableClose: true,
          data: {
            isF1Pressed: false,
            title: 'K-Raheja ERP',
            message:
              'Do you want to adjust the advance paid amount for this bill ?',
            template: '',
            type: 'info',
            confirmationDialog: true,
          },
        });
        dialogRef.afterOpened().subscribe(() => {});
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            document.getElementById('id_adjustAdvn')?.focus();
          } else {
            this.checkAmmountDiffrencePopup();
          }
        });
      } else {
        this.showErroPopup();
      }
    } else {
    }
  }

  checkTDSCalculation() {
    const tdsAmt = this.billEntryForm.getRawValue().tdsAmount;
    if (
      Number(this.config.calculatedTaxAmt) ==
        Number(this.config.selfEnteredTaxAmt) ||
      Number(this.config.selfEnteredTaxAmt) == 0
    ) {
      this.isAdvanceCheck();
    } else {
      const dialogRef = this.dailog.open(ModalComponent, {
        disableClose: true,
        data: {
          isF1Pressed: false,
          title: 'K-Raheja ERP',
          message:
            ' TDS Amount not calculated as per TDS%. Do you want to recalculate?',
          template: '',
          type: 'info',
          confirmationDialog: true,
        },
      });
      dialogRef.afterOpened().subscribe(() => {});
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.onLeaveTDS(this.billEntryForm.getRawValue().tdsPerc);
          document.getElementById('id_tdsAmount')?.focus();
        } else {
          this.isAdvanceCheck();
        }
      });
    }
  }

  AddUpdateData() {
    if (this.config.isAdd) {
      if (this.billEntryForm.valid) {
        this.saveData();
      } else {
        this.showErroPopup();
      }
    } else {
      if (this.billEntryForm.valid) {
        this.saveData();
      } else {
        this.showErroPopup();
      }
    }
  }

  // invocie ammount validation
  invocieAmtValidation() {
    // tax amount self enter check
    if (this.config.selfEnteredTaxAmt == 0) {
      this.billEntryForm.getRawValue().tdsPerc
        ? this.onLeaveTDS(this.billEntryForm.getRawValue().tdsPerc)
        : '';
    } else {
      this.billEntryForm
        .get('tdsAmount')
        ?.setValue(this.tdsAmtRoundOfAmt(this.config.selfEnteredTaxAmt));
    }

    // check exap class and exp id
    if (
      (this.billEntryForm.getRawValue().expId &&
        !this.billEntryForm.getRawValue().expClass) ||
      (!this.billEntryForm.getRawValue().expId &&
        this.billEntryForm.getRawValue().expClass)
    ) {
      this.onLeaveExpID(this.billEntryForm.getRawValue().expId);
    } else if (
      (this.billEntryForm.getRawValue().tdsAcMajor &&
        !this.billEntryForm.getRawValue().tdsPerc) ||
      (!this.billEntryForm.getRawValue().tdsAcMajor &&
        this.billEntryForm.getRawValue().tdsPerc)
    ) {
      if (this.config.selfEnteredTaxAmt == 0) {
        this.billEntryForm.getRawValue().tdsPerc
          ? this.onLeaveTDS(this.billEntryForm.getRawValue().tdsPerc)
          : '';
      } else {
        this.billEntryForm
          .get('tdsAmount')
          ?.setValue(this.tdsAmtRoundOfAmt(this.config.selfEnteredTaxAmt));
      }
    } else if (this.billEntryForm.valid) {
      if (
        this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().acmajor)
          ?.trimEnd() == '40502247' && !this.billEntryForm.getRawValue().serNo
      ) {
        this.onLeavePeriod();
      } else {
        this.checkTDSCalculation();
      }
    } else {
      this.showErroPopup();
    }
  }

  // on save reverse change mechanisam logic implemented
  rcmOnSaveValidation() {
    const invoiceAmt = Number(this.billEntryForm.get('invoiceAmt')?.value);
    const totalTaxableAmmt = Number(
      this.billEntryForm.get('totalTaxableAmmt')?.value
    );
    const totalWithGSTAmmt = Number(
      this.billEntryForm.get('totalWithGSTAmmt')?.value
    );

    var partyLimited = this.billEntryForm.getRawValue().isPartyLimited;
    var partyRegister = this.billEntryForm.getRawValue().partyGstNo?.trimEnd();
    var companyGst = this.billEntryForm.getRawValue().companyGstNo?.trimEnd();
    var isLegal = this.billEntryForm.getRawValue().isLegal;
    var isSecurity = this.billEntryForm.getRawValue().isSecurity;

    // if party is not register and company also dont have gst number
    if (!partyRegister && !companyGst) {
      //  logic no 1 -- ac is not isLegal and ac is not security
      if (!isLegal && !isSecurity) {
        console.log('logic 1');

        if (invoiceAmt == totalTaxableAmmt) {
          this.makeGSTValuezero();
          //  make all gst make all gst 0 (zero)) -- pending
          return true;
        } else {
          return false;
        }
      }
      // logic no 2
      else if (isLegal || isSecurity) {
        console.log('logic 2');
        if (isLegal) {
          if (invoiceAmt == totalTaxableAmmt) {
            //  make all gst make all gst 0 (zero)) -- pending
            this.makeGSTValuezero();
            return true;
          } else {
            return false;
          }
        } else if (isSecurity) {
          if (invoiceAmt == totalWithGSTAmmt) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    // logic no 3 if party is register and company doest not have GST
    else if (partyRegister && !companyGst) {
      console.log('logic 3');
      if (invoiceAmt == totalWithGSTAmmt) {
        return true;
      } else {
        return false;
      }
    }
    // company have gst but party is not register
    else if (companyGst && !partyRegister) {
      // logic 4
      if (isLegal && !isSecurity && !isLegal && !isSecurity) {
        console.log('logic 4');
        if (invoiceAmt == totalTaxableAmmt) {
          //  make all gst make all gst 0 (zero)) -- pending
          this.makeGSTValuezero();
          return true;
        } else {
          return false;
        }
      }
      //  logic 5
      else if (!isLegal && isSecurity) {
        console.log('logic 5');
        if (invoiceAmt == totalWithGSTAmmt) {
          return true;
        } else {
          return false;
        }
      }
    }
    // company have gst and party is register
    else if (companyGst && partyRegister) {
      //logic 6
      if (!isLegal && isSecurity || !isLegal && !isSecurity) {
        console.log('logic 6');
        if (invoiceAmt == totalWithGSTAmmt) {
          return true;
        } else {
          return false;
        }
      } else if (isLegal && !isSecurity) {
        console.log('logic 7');
        if (invoiceAmt == totalWithGSTAmmt) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  makeGSTValuezero() {
    const detailsArray = this.billEntryForm.get('admbillList') as FormArray;

    console.log('detailsArray', detailsArray);

    // List of control names
    const controlNames = [
      'cgstperc',
      'cgstamt',
      'sgstperc',
      'sgstamt',
      'igstperc',
      'igstamt',
      'ugstperc',
      'ugstamt',
    ];

    // Set values to zero for the controls in the list
    controlNames.forEach((controlName) => {
      detailsArray.controls.find((c: any) => c.get(controlName)?.setValue(0));
    });
  }

  // after all pop validation check revchgn logic
  prepareDataAccordingCondition() {
    const invoiceAmt = this.billEntryForm.get('invoiceAmt')?.value;
    const totalTaxableAmmt = this.billEntryForm.get('totalTaxableAmmt')?.value;
    const totalWithGSTAmmt = this.billEntryForm.get('totalWithGSTAmmt')?.value;

    const balanceAmtWithoutGst = invoiceAmt - totalTaxableAmmt;
    const balanceAmtWitGst = invoiceAmt - totalWithGSTAmmt;
    if (this.billEntryForm.value.gstrevchgyn == 'Y') {
      if (Number(invoiceAmt) == Number(totalTaxableAmmt)) {
        this.billEntryForm.get('fotoamount')?.setValue(0);
        this.billEntryForm.get('otherCharg')?.setValue(0);

        this.checkTDSCalculation();
      } else {
        if (balanceAmtWithoutGst < 10 && balanceAmtWithoutGst > -10) {
          this.checkTDSCalculation();
        } else {
          this.config.isFormValid = false;
          this.showErrorFieldDialog(
            'K-Raheja ERP',
            'Invoice Amount in header and detail not matching..',
            'error'
          );
        }
      }
    } else {
      if (Number(invoiceAmt) == Number(totalWithGSTAmmt)) {
        this.billEntryForm.get('fotoamount')?.setValue(0);
        this.billEntryForm.get('otherCharg')?.setValue(0);

        this.checkTDSCalculation();
      } else {
        if (balanceAmtWitGst < 10 && balanceAmtWitGst > -10) {
          this.checkTDSCalculation();
        } else {
          this.config.isFormValid = false;
          this.showErrorFieldDialog(
            'K-Raheja ERP',
            'Invoice Amount in header and detail not matching..',
            'error'
          );
        }
      }
    }
  }

  // if ammount diffrence is less than -10 or 10
  checkAmmountDiffrencePopup() {
    const invoiceAmt = this.billEntryForm.get('invoiceAmt')?.value;
    const totalTaxableAmmt = this.billEntryForm.get('totalTaxableAmmt')?.value;
    const totalWithGSTAmmt = this.billEntryForm.get('totalWithGSTAmmt')?.value;

    const balanceAmtWithoutGst = invoiceAmt - totalTaxableAmmt;
    const balanceAmtWitGst = invoiceAmt - totalWithGSTAmmt;

    if (this.billEntryForm.value.gstrevchgyn == 'Y') {
      if (Number(invoiceAmt) == Number(totalTaxableAmmt)) {
        this.billEntryForm.get('fotoamount')?.setValue(0);
        this.billEntryForm.get('otherCharg')?.setValue(0);
        this.AddUpdateData();
      } else {
        this.config.isFormValid = false;
        this.showErrorFieldDialog(
          'K-Raheja ERP',
          'Invoice Amount in header and detail not matching..',
          'error'
        );
      }
    } else {
      if (this.rcmOnSaveValidation()) {
        this.billEntryForm.get('fotoamount')?.setValue(0);
        this.billEntryForm.get('otherCharg')?.setValue(0);
        this.AddUpdateData();
      } else {
        if (
          balanceAmtWitGst < 10 &&
          balanceAmtWitGst > -10 &&
          this.rcmOnSaveValidation()
        ) {
          this.AddUpdateData();
        } else {
          this.config.isFormValid = false;
          this.showErrorFieldDialog(
            'K-Raheja ERP',
            'Invoice Amount in header and detail not matching..',
            'error'
          );
        }
      }
    }
  }

  amountDiffrencPopup(balanceAmtWitGst: any) {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message:
          'Invoice Amount in header and detail not matching. Do you want to save ?',
        template: '',
        type: 'info',
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.billEntryForm
          .get('fotoamount')
          ?.setValue(balanceAmtWitGst.toFixed(2));
        this.billEntryForm
          .get('otherCharg')
          ?.setValue(balanceAmtWitGst.toFixed(2));

        this.config.isFormValid = true;

        this.AddUpdateData();
      } else {
        document.getElementById('id_invoiceAmt')?.focus();
      }
    });
  }

  saveData() {
    // if(Number(this.billEntryForm.getRawValue().tdsAmount) == Number){}

    let gridRequest = this.billEntryForm.getRawValue().admbillList;

    gridRequest.map((item: any) => {
      item['hsnsaccode'] = this.commonService.convertArryaToString(
        item.hsnsaccode
      );
      item['uom'] = this.commonService.convertArryaToString(item.uom);
    });

    let payload = {
      isUpdate: this.config.isAdd ? false : true,
      admbillhRequestBean: {
        acmajor: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().acmajor)
          ?.trimEnd(),
        acminor: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().acMinor)
          ?.trimEnd(),
        actranser: '',
        advnadjust: this.billEntryForm.getRawValue().adjustAdvn,
        billamount: this.billEntryForm.getRawValue().invoiceAmt,
        billtype: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().billType)
          ?.trimEnd(),
        bldgcode: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().bldgCode)
          ?.trimEnd(),
        clearacdate: '',
        clearacperson: '',
        coy: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().coyCode)
          ?.trimEnd(),
        debitamt: 0.0,
        exptype: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().exptype)
          ?.trimEnd(),
        fotoamount: this.billEntryForm.getRawValue().otherCharg,
        fromdate: this.billEntryForm.getRawValue().period.fromdate
          ? moment(this.billEntryForm.getRawValue().period.fromdate).format(
              'YYYY-MM-DD'
            )
          : '',
        gstrevchgyn: this.billEntryForm.getRawValue().gstrevchgyn,
        mintype: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().minType)
          ?.trimEnd(),
        narration: this.billEntryForm.getRawValue().narration,
        orderedby: this.billEntryForm.getRawValue().orderBy,
        origsite: '',
        origsys: '',
        paidamount: 0.0,
        paiddate: '',
        paidref: '',
        partycode: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().partyCode)
          ?.trimEnd(),
        partytype: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().partyType)
          ?.trimEnd(),
        passedon: '',
        project: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().bldgCode)
          ?.trimEnd(),
        rundate: '',
        ser: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().serNo)
          ?.trimEnd(),
        site: '',
        status: '',
        sunclass: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().expClass)
          ?.trimEnd(),
        sunid: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().expId)
          ?.trimEnd(),
        suppbilldt: moment(this.billEntryForm.getRawValue().suppbilldt).format(
          'YYYY-MM-DD'
        ),
        suppbillno: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().suppBillNo)
          ?.trimEnd(),
        tdsacmajor: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().tdsAcMajor)
          ?.trimEnd(),
        tdsamount: this.tdsAmtRoundOfAmt(
          this.billEntryForm.getRawValue().tdsAmount
        ),
        tdsperc: this.billEntryForm.getRawValue().tdsPerc
          ? this.billEntryForm.getRawValue().tdsPerc
          : 0,
        todate: this.billEntryForm.getRawValue().period.uptodate
          ? moment(this.billEntryForm.getRawValue().period.uptodate).format(
              'YYYY-MM-DD'
            )
          : '',
        today: '',
        userid: '',
        isUpdate: false,
      },
      admbilldRequestBean: gridRequest,
      refPartyType: this.commonService
        .convertArryaToString(this.billEntryForm.getRawValue().refPartyType)
        ?.trimEnd(),
      refPartyCode: this.commonService
        .convertArryaToString(this.billEntryForm.getRawValue().refPartyCode)
        ?.trimEnd(),
      gstNo: this.billEntryForm.getRawValue().partyGstNo,
    };
    this.config.isLoading = true;
    const objectWithNoNulls = this.replaceNullValues(payload);
    payload = objectWithNoNulls;
    console.log('new payload', payload);
    if (this.config.isAdd) {
      this.http
        .request('post', api_url.createBillEntry, payload, null)
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.config.printSerialNumber = res.data;
              this.billEntryForm.patchValue({
                serNo: res.data,
              });

              this.successPopup();
            } else {
              this.toastr.error(res.message);
            }

            this.config.isLoading = false;
          },
          error: () => {
            this.config.isLoading = false;
          },
        });
    } else {
      payload.isUpdate = true;
      this.http
        .request('put', api_url.updateBillEntry, payload, null)
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.successPopup();
            } else {
              this.toastr.error(res.message);
            }

            this.config.isLoading = false;
          },
          error: () => {
            this.config.isLoading = false;
          },
        });
    }
  }

  // tds amt will change if it is 0.5 then it will get increment changes
  tdsAmtRoundOfAmt(val: any) {
    if (val) {
      var amt = val.toString();
      if (amt.includes('.5')) {
        return Math.ceil(amt);
      } else {
        return Math.round(amt);
      }
    } else {
      return 0;
    }
  }

  replaceNullValues(obj: any, defaultValue: any = ''): any {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        obj[key] = defaultValue;
      } else if (typeof obj[key] === 'object') {
        obj[key] = this.replaceNullValues(obj[key], defaultValue);
      }
    }
    return obj;
  }

  successPopup() {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'Transaction saved succesfully..',
        template: '',
        type: 'info',
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      this.printVoucherPopup();
    });
  }

  printVoucherPopup() {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'Do you want to print Voucher details?(Y/N)',
        template: '',
        type: 'info',
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getPrint(true);
      } else {
        this.back();
      }
    });
  }

  onRateQuntityChange(item: any) {
    const qty = Number(item.get('dbqty').value);
    const rate = Number(item.get('rate').value);
    const getAmt = qty * rate;
    item.get('amount')?.setValue(getAmt);

    this.calculatedBillDetails(item);
  }

  // on click add button get basic details of company
  fetchGstAndBasicDetails() {
    let data = {
      companyCode: this.commonService
        .convertArryaToString(this.billEntryForm.get('coyCode')?.value)
        ?.trimEnd(),
      partyType: this.commonService
        .convertArryaToString(this.billEntryForm.get('partyType')?.value)
        ?.trimEnd(),
      partyCode: this.commonService
        .convertArryaToString(this.billEntryForm.get('partyCode')?.value)
        ?.trimEnd(),
      buildingCode: this.commonService
        .convertArryaToString(this.billEntryForm.get('bldgCode')?.value)
        ?.trimEnd(),
      suppBillNo: this.commonService
        .convertArryaToString(this.billEntryForm.get('suppBillNo')?.value)
        ?.trimEnd(),
    };
    this.http
      .request('post', api_url.getAdminBillGstAndBasicDetails, data, null)
      .subscribe((res: any) => {
        if (res.success) {
          this.markFormGroupAndArrayAsTouched(this.billEntryForm, true);

          this.addMandatoryFiledValidation();

          const balanceAmt = res.data.totPaidAdvance - res.data.adjustedAdvn;
          this.config.isBillEntryShow = true;
          this.config.isAdd = true;
          this.billEntryForm.patchValue({
            partyGstNo: res.data.partyGstNumber,
            companyGstNo: res.data.companyGstNo,
            state: res.data.stateCode,
            stateName: res.data.stateName,
            paidAdvn: res.data.totPaidAdvance,
            adjustedAdvn: res.data.adjustedAdvn,
            balAdvn: balanceAmt,
            isPartyLimited: res.data.isPartyLimited,
            refPartyType: this.commonService.convertArryaToString(
              this.billEntryForm.get('partyType')?.value
            ),
            refPartyCode: this.commonService.convertArryaToString(
              this.billEntryForm.get('partyCode')?.value
            ),
            refPartyName: this.billEntryForm.getRawValue().partyName,
          });

          this.billEntryForm.get('coyCode')?.disable();
          this.billEntryForm.get('partyType')?.disable();
          this.billEntryForm.get('partyCode')?.disable();
          this.billEntryForm.get('bldgCode')?.disable();
          this.billEntryForm.get('suppBillNo')?.disable();
          this.billEntryForm.get('serNo')?.disable();

          this.setValueOnLeaveInputFiled();
          setTimeout(() => {
            document.getElementById('id_orderBy')?.focus();
          }, 0);

          this.commonService.enableDisableButtonsByIds(
            ['save', 'back', 'reset', 'exit'],
            this.buttonsList,
            false
          );
          this.commonService.enableDisableButtonsByIds(
            ['add', 'retrieve'],
            this.buttonsList,
            true
          );
        } else {
          if (res.message == 'Invoice Number already exists.') {
            this.showErrorFieldDialog(
              'K-Raheja ERP',
              'Bill is already entered for this party',
              'error'
            );
          } else {
            this.toastr.error(res.message);
          }
        }
      });
  }

  ////////////////////////////////////
  // form array
  ////////////////////////////////////

  createBillEntryDetails(data?: any): FormGroup | any {
    return this.fb.group({
      hsnsaccode: [data ? data.adbldHsnsaccode : '', Validators.required],
      itemdesc: [
        { value: data ? data.adbldItemdesc : '', disabled: true },
        Validators.required,
      ],
      uom: [data ? data.adbldUom : ''],
      dbqty: [data?.adbldDbqty ? data.adbldDbqty : 0],
      rate: [data ? data.adbldRate : ''],
      amount: [data ? data.adbldAmount : '', Validators.required],
      dbamt: [data?.adbldDbamt ? data.adbldDbamt : 0, Validators.required],
      discountamt: [data ? data.adbldDiscountamt : ''],
      taxableamt: [data ? data.adbldTaxableamt : '', Validators.required],
      cgstperc: [data ? data.adbldCgstperc : ''],
      cgstamt: [data ? data.adbldCgstamt : ''],
      sgstperc: [data ? data.adbldSgstperc : ''],
      sgstamt: [data ? data.adbldSgstamt : ''],
      igstperc: [data ? data.adbldIgstperc : ''],
      igstamt: [data ? data.adbldIgstamt : ''],
      ugstperc: [data ? data.adbldUgstperc : ''],
      ugstamt: [data ? data.adbldUgstamt : ''],
      lineno: [this.billEntryForm.getRawValue().admbillList.length + 1],
      origsite: [data ? data.adbldOrigsite : ''],
      site: [data ? data.adbldSite : ''],
      today: [data ? data.adbldToday : ''],
      userid: [data ? data.adbldUserid : ''],
      isAdd: [''],
      isUpdate: [false],
      ser: [
        data
          ? data.admbilldCK.adbldSer
          : this.commonService
              .convertArryaToString(this.billEntryForm.getRawValue().serNo)
              ?.trimEnd(),
      ],
      grnadTotalGstAmt: [''],
    });
  }

  addBillEntryList(data?: any) {
    const invoiceBreakupDetailsArray = this.billEntryForm.get(
      'admbillList'
    ) as FormArray;

    invoiceBreakupDetailsArray.push(this.createBillEntryDetails(data));

    setTimeout(() => {
      this.updateChangeDetection(data);
    }, 0);
  }

  updateChangeDetection(data?: any) {
    const array: any = this.billEntryForm.get('admbillList') as FormArray;

    array.controls.map((item: any) => {
      this.calculatedBillDetails(item);
    });

    const index = Number(array.length) - 1;
    const id = 'hsnCode' + index;
    if (!data && index != 0) {
      var inputElement: any = document.getElementById(id);
      inputElement.focus();
    }
  }

  removeBillEntryList(index: number, item: any) {
    const invoiceBreakupDetailsArray = this.billEntryForm.get(
      'admbillList'
    ) as FormArray;
    invoiceBreakupDetailsArray.removeAt(index);

    invoiceBreakupDetailsArray.controls.map((item: any) => {
      this.calculatedBillDetails(item);
    });
    // this.invoiceBreakupCalculation(item)
  }

  /////////////////////////////////////////
  // add flow
  /////////////////////////////////////////
  addMandatoryFiledValidation() {
    Object.keys(this.billEntryForm.controls).forEach((controlName) => {
      const control = this.billEntryForm.get(controlName);

      if (control) {
        const mandatoryField = [
          'exptype',
          'billType',
          'suppbilldt',
          'acmajor',
          'invoiceAmt',
        ];
        mandatoryField.map((item) => {
          if (controlName == item) {
            control.setValidators([Validators.required]);
          }
        });
        control.updateValueAndValidity();
      }
    });
    this.addBillEntryList();
  }

  ///////////////////////////////////////////////
  /// error handling
  ///////////////////////////////////////////////
  showErroPopup() {
    this.markFormGroupAndArrayAsTouched(this.billEntryForm);

    // Check if any form control is invalid
    if (this.billEntryForm.invalid) {
      const errorList = this.errorHandling();
      var customeErrorMsg = '';
      var commonMsg = 'Please fill the mandatory field/s.';
      errorList.map((item) => {
        if (item == 'invalidAdjustAdvn') {
          customeErrorMsg =
            'Adjust advance is not greater than balance amount.';
        }
      });

      this.showErrorFieldDialog(
        'K-Raheja ERP',
        customeErrorMsg ? customeErrorMsg : commonMsg,
        'error'
      );
    }
  }
  markFormGroupAndArrayAsTouched(
    formGroup: FormGroup | FormArray,
    isUntouch?: boolean
  ): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupAndArrayAsTouched(control);
      } else {
        if (isUntouch) {
          control.markAsUntouched();
        } else {
          control.markAsTouched();
        }
      }
    });
  }

  //////////////////////////////////
  // validation dyanmically
  //////////////////////////////////
  // Function to remove 'required' validation from all controls

  // Helper function to update validators for all controls
  updateValidators(isAdd: boolean): void {
    Object.keys(this.billEntryForm.controls).forEach((controlName) => {
      const control = this.billEntryForm.get(controlName);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity(); // Trigger update to remove validation
      }
    });

    const fromdate = this.billEntryForm.get('period.fromdate');
    fromdate?.setValidators(null);
    fromdate?.setValue('');
    fromdate?.updateValueAndValidity();
    const uptodate = this.billEntryForm.get('period.uptodate');
    uptodate?.setValidators(null);
    uptodate?.setValue('');
    uptodate?.updateValueAndValidity();

    if (isAdd) {
      const control: any = this.billEntryForm.get('serNo');
      control.setValidators(null);
      control.updateValueAndValidity();
      const requiredFieldList = [
        'coyCode',
        'partyType',
        'partyCode',
        'bldgCode',
        'suppBillNo',
      ];
      requiredFieldList.map((item) => {
        const control: any = this.billEntryForm.get(item);
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      });
    } else {
      const control: any = this.billEntryForm.get('serNo');
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
      const requiredFieldList = [
        'coyCode',
        'partyType',
        'partyCode',
        'bldgCode',
        'suppBillNo',
      ];
      requiredFieldList.map((item) => {
        const control: any = this.billEntryForm.get(item);
        control.setValidators(null);
        control.updateValueAndValidity();
      });
    }
  }

  updateValidatorsForACMajorSelection(isRequired: boolean): void {
    Object.keys(this.billEntryForm.controls).forEach((controlName) => {
      const control = this.billEntryForm.get(controlName);
      const requiredFieldList = ['minType', 'acMinor'];
      if (control) {
        if (isRequired) {
          requiredFieldList.map((item) => {
            if (controlName == item) {
              control.setValidators([Validators.required]);
            }
          });
        } else {
          requiredFieldList.map((item) => {
            if (controlName == item) {
              control.setValidators(null);
            }
          });
        }
        control.updateValueAndValidity();
      }
    });
  }

  removeValidationForInvoiceNumber() {
    // Assuming this is within the component where your form is defined
    const suppBillNoControl = this.billEntryForm.get('suppBillNo');

    // Check if the 'notFound' error exists before removing it
    if (suppBillNoControl?.hasError('notFound')) {
      const currentErrors = { ...suppBillNoControl.errors };

      // Remove the 'notFound' error
      delete currentErrors['notFound'];

      // Set the updated errors back to the form control
      suppBillNoControl.setErrors(
        Object.keys(currentErrors).length > 0 ? currentErrors : null
      );
    }
  }

  errorHandling() {
    // Assuming this is within the component where your form is defined
    const formControls = this.billEntryForm.controls;
    const errorNames: string[] = [];

    // Check each form control for errors
    Object.keys(formControls).forEach((controlName) => {
      const control = formControls[controlName];

      if (control.errors) {
        // Collect error names
        errorNames.push(...Object.keys(control.errors));
      }
    });

    // Check the form group itself for errors
    if (this.billEntryForm.errors) {
      // Collect error names
      errorNames.push(...Object.keys(this.billEntryForm.errors));
    }
    return errorNames;
  }

  // validate data
  validateData(isSave: boolean) {
    if (this.billEntryForm.valid) {
      const advanAmt = Number(this.billEntryForm.value.advanceamt);
      const basicamt = Number(this.billEntryForm.value.basicamt);
      const gstamt = Number(this.billEntryForm.get('gstamt')?.value);

      const isValidAmt = basicamt + gstamt === advanAmt ? true : false;

      const remainingAmt = advanAmt - basicamt + gstamt;

      if (!isValidAmt) {
        this.billEntryForm.get('fotoamount')?.setValue(remainingAmt);
        this.modalService.showErrorDialog(
          'Admin Advance Payment',
          'There is difference between AdvanceAmt and BasicAmt including GST.',
          'error'
        );
      } else {
        this.billEntryForm.get('fotoamount')?.setValue(0);
        isSave ? this.saveData() : '';
      }
    }
  }

  // get print report
  getPrint(print: boolean) {
    if (true) {
      if (this.service.printExcelChk(print, 'PDF')) {
        this.config.isLoading = true;
        const billNumber = this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().serNo)
          ?.trimEnd();
        let payload = {
          name: 'AdminBillVch.rpt',
          isPrint: false,
          seqId: 1,
          exportType: 'PDF',
          reportParameters: {
            prmBillNum:
              "'" + billNumber
                ? billNumber
                : this.config.printSerialNumber + "'",
            AdvancePaidAmt: this.billEntryForm.getRawValue().adjustAdvn
              ? this.billEntryForm.getRawValue().adjustAdvn
              : 0,
          },
        };

        this.back();

        this.commonReport
          .getParameterizedReport(payload)
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(true, res);

              this.config.isLoading = false;
            },
          });
      }
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this.commonReport.getReportName();
    this.config.isLoading = false;
    this.service.exportReport(print, res, 'PDF', filename);
  }

  showErrorFieldDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (message == 'Bill is already entered for this party') {
        var inputElement: any = document.getElementById('invoice_Num');

        // Set focus to the input element
        inputElement.focus();
      } else {
        var inputElement: any = document.getElementById('id_CoyCode');

        // Set focus to the input element
        inputElement.focus();
      }
    });
  }

  // confirm dailog box
  showConfirmation(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean
  ) {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
        confirmationDialog: confirmationDialog,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.getPrint(true);
        this.back();

        this.config.isBillEntryShow = false;

        this.commonService.enableDisableButtonsByIds(
          ['save', 'print'],
          this.buttonsList,
          true
        );
        this.commonService.enableDisableButtonsByIds(
          ['add', 'retrieve', 'back', 'exit'],
          this.buttonsList,
          false
        );
        if (this.isBackClicked) {
          this.back();
        }
      } else {
        this.back();
      }
    });
  }

  ///////////////////////////////////
  // reset data funtionality
  ///////////////////////////////////
  back() {
    this.isBackClicked = false;
    this.initialMode = false;
    this.billEntryForm.reset();
    this.billEntryForm.enable();

    this.billEntryForm.get('partyName')?.disable();
    this.billEntryForm.get('bldgName')?.disable();
    this.billEntryForm.get('partyGstNo')?.disable();
    this.billEntryForm.get('stateName')?.disable();
    this.billEntryForm.get('state')?.disable();
    this.billEntryForm.get('paidAdvn')?.disable();
    this.billEntryForm.get('adjustedAdvn')?.disable();
    this.billEntryForm.get('balAdvn')?.disable();
    this.billEntryForm.get('refPartyName')?.disable();

    this.billEntryForm.get('coyCode')?.enable();
    this.billEntryForm.get('partyType')?.enable();
    this.billEntryForm.get('partyCode')?.enable();
    this.billEntryForm.get('bldgCode')?.enable();
    this.billEntryForm.get('suppBillNo')?.enable();
    this.billEntryForm.get('serNo')?.enable();

    this.config.isBillEntryShow = false;
    this.config.calculatedTaxAmt = 0;
    const formArray = this.billEntryForm.get('admbillList') as FormArray;
    formArray.clear();

    this.commonService.enableDisableButtonsByIds(
      ['save', 'print'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'back', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );

    document.getElementById('id_CoyCode')?.focus();

    this.billEntryForm.patchValue({
      partyType: 'Z',
    });
  }
  // back to admin advance payment form
  resetForm() {
    this.isBackClicked = true;
    if (this.billEntryForm.dirty) {
      this.showConfirmation(
        constant.ErrorDialog_Title,
        'Do you want to ignore the changes done?',
        'question',
        true
      );
    } else {
      this.back();
    }
  }

  ///////////////////////////////////////
  /// on leave value bind funtions list
  ///////////////////////////////////////
  setValueOnLeaveInputFiled() {
    if (!this.billEntryForm.getRawValue().refPartyType) {
      this.billEntryForm.patchValue({
        refPartyCode: '',
        refPartyName: '',
      });
    }
    this.filters = {
      getCoy: '',
      getBldg: '',
      partyCode: '',
      getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",
      getPartyType: "par_partytype=''",
      getRefPartyType: "par_partytype=''",
      getSerial: '',
      getBgldCode: '',
      getSerialDefaultValue: " Nvl(adblh_status,'1') = '1'",
      getInvoiceByFilter: '',
      getSerialNumByFilter: '',
    };

    const company = this.commonService.convertArryaToString(
      this.billEntryForm.get('coyCode')?.value
    );
    const partyType = this.commonService.convertArryaToString(
      this.billEntryForm.get('partyType')?.value
    );
    const refPartyType = this.commonService.convertArryaToString(
      this.billEntryForm.get('refPartyType')?.value
    );
    const partyCode = this.commonService.convertArryaToString(
      this.billEntryForm.get('partyCode')?.value
    );
    const bldgCode = this.commonService.convertArryaToString(
      this.billEntryForm.get('bldgCode')?.value
    );
    const invoiceNumber = this.commonService.convertArryaToString(
      this.billEntryForm.get('suppBillNo')?.value
    );

    this.filters.getInvoiceByFilter = '';
    this.filters.getSerialNumByFilter = '';

    if (company) {
      this.filters.getBldg = "bldg_coy='" + company + "'";
      this.filters.getInvoiceByFilter += "adblh_coy = '" + company + "' AND ";
    }
    if (partyType) {
      this.filters.getPartyType = "par_partytype='" + partyType + "'";
      this.filters.getInvoiceByFilter +=
        "adblh_partytype = '" + partyType + "' AND ";
    }
    if (refPartyType) {
      this.filters.getRefPartyType = "par_partytype='" + refPartyType + "'";
    }
    if (partyCode) {
      this.filters.getInvoiceByFilter +=
        "adblh_partycode = '" + partyCode + "' AND ";
    }
    if (bldgCode) {
      this.filters.getInvoiceByFilter +=
        "adblh_bldgcode = '" + bldgCode + "' AND ";
    }

    if (invoiceNumber) {
      this.filters.getSerialNumByFilter +=
        "adblh_suppbillno = '" + invoiceNumber + "' AND ";
    }
    this.filters.getSerialNumByFilter += this.filters.getInvoiceByFilter;

    this.filters.getInvoiceByFilter = this.removeLastAND(
      this.filters.getInvoiceByFilter
    );
    this.filters.getSerialNumByFilter = this.removeLastAND(
      this.filters.getSerialNumByFilter
    );

    if (this.filters.getInvoiceByFilter) {
      this.filters.getInvoiceByFilter += " AND Nvl(adblh_status,'1') = '1'";
    }
    if (this.filters.getSerialNumByFilter) {
      this.filters.getSerialNumByFilter += " AND Nvl(adblh_status,'1') = '1'";
    }
  }

  calculatedBillDetails(item: any) {
    // first logic calculation
    const ammount = Number(item.value.amount);
    const discAmt = Number(item.value.discountamt);

    const taxAmt = ammount - discAmt;
    item.get('taxableamt').setValue(taxAmt.toFixed(2));
    const taxableAmt = Number(item.value.taxableamt);

    // secound logic calculation
    const cgst = Number(item.get('cgstperc').value);
    const sgst = Number(item.get('sgstperc').value);
    const igst = Number(item.get('igstperc').value);
    const ugst = Number(item.get('ugstperc').value);

    const cgstAmt = (cgst / 100) * taxableAmt;
    const sgstAmt = (sgst / 100) * taxableAmt;
    const igstAmt = (igst / 100) * taxableAmt;
    const ugstAmt = (ugst / 100) * taxableAmt;

    item.get('cgstamt').setValue(cgstAmt.toFixed(2));
    item.get('sgstamt').setValue(sgstAmt.toFixed(2));
    item.get('igstamt').setValue(igstAmt.toFixed(2));
    item.get('ugstamt').setValue(ugstAmt.toFixed(2));

    const grandWithGSTToatl =
      cgstAmt + sgstAmt + igstAmt + ugstAmt + taxableAmt;

    item.get('grnadTotalGstAmt').setValue(grandWithGSTToatl);
    this.billEntryForm
      .get('totalTaxableAmmt')
      ?.setValue(this.calculateTotalAmmount('taxableamt'));
    this.billEntryForm
      .get('totalWithGSTAmmt')
      ?.setValue(this.calculateTotalAmmount('grnadTotalGstAmt'));
  }

  partyTypeKeyPress(val: any, type: string) {
    if (type == 'ref') {
      this.billEntryForm.patchValue({
        refPartyCode: '',
        refPartyName: '',
      });
    } else {
      this.billEntryForm.patchValue({
        partyCode: '',
        partyName: '',
      });
    }
  }

  getGSTPercentage(val: any, item: any) {
    if (val) {
      if (this.billEntryForm.getRawValue().suppbilldt) {
        let parms = {
          hsnCode: val,
          suppbillDate: moment(this.billEntryForm.value.suppbilldt).format(
            'DD-MM-YY'
          ),
          partyCode: this.commonService.convertArryaToString(
            this.billEntryForm.getRawValue().partyCode
          ),
          stateCode: this.commonService.convertArryaToString(
            this.billEntryForm.getRawValue().state
          ),
          buildingCode: this.commonService.convertArryaToString(
            this.billEntryForm.getRawValue().bldgCode
          ),
        };

        this.http
          .request('get', api_url.getGstPercentage, null, parms)
          .subscribe((res: any) => {
            console.log('res', res);

            item.get('sgstperc').setValue(res.data.sgstPerc);
            item.get('cgstperc').setValue(res.data.cgstPerc);
            item.get('igstperc').setValue(res.data.igstPerc);
            item.get('ugstperc').setValue(res.data.ugstPerc);

            // this.calculatedBillDetails(item)
          });
      } else {
        this.modalService.showErrorDialog(
          'Bill Entry',
          'Invoice Date is not selected.',
          'error'
        );

        document.getElementById('invoiceDate')?.focus();
      }
    }
  }

  calculateTotalAmmount(fieldName: string): any {
    const formArray = this.billEntryForm.get('admbillList') as FormArray;
    let total = 0;
    formArray.controls.forEach((control) => {
      let amount = control.get(fieldName)?.value;
      amount ? amount : (amount = 0);
      if (!isNaN(amount)) {
        total += parseFloat(amount);
      }
    });

    return total.toFixed(2);
  }

  // on leave tds ac major
  onLeaveTDSACMajor(val: any) {
    let body = {
      partyType: this.commonService
        .convertArryaToString(this.billEntryForm.getRawValue().partyType)
        ?.trimEnd(), //'E',
      partyCode: this.commonService
        .convertArryaToString(this.billEntryForm.getRawValue().partyCode)
        ?.trimEnd(),
      suppBillDate: moment(this.billEntryForm.getRawValue().suppbilldt).format(
        'YYYY-MM-DD'
      ), //'2024-02-15',
    };
    console.log('body', body);

    if (val) {
      this.http
        .request('post', api_url.getTDSPercentage, body, null)
        .subscribe({
          next: (res: any) => {
            console.log('res', res);

            if (res.success) {
              this.billEntryForm.patchValue({
                tdsPerc: res.data,
              });
            } else {
              this.billEntryForm.patchValue({
                tdsPerc: '',
              });
            }
          },
          error: (res: any) => {},
        });
    }
  }

  // tds calculation
  // TDS Calculation
  onLeaveTDS(percentage: number, isRetrive?: boolean) {
    const tdsACMajor = this.commonService
      .convertArryaToString(this.billEntryForm.getRawValue().tdsAcMajor)
      ?.trimEnd();
    // first case
    if (
      tdsACMajor != '' &&
      tdsACMajor != undefined &&
      (percentage == 0 || percentage == null)
    ) {
      const isDialogOpen = !!document.querySelector('app-modal');
      if (!isDialogOpen) {
        this.tdsPercentagePopUp();
      } else {
      }
    } else if (
      (tdsACMajor == '' || tdsACMajor == null || tdsACMajor == undefined) &&
      percentage != 0
    ) {
      document.getElementById('id_tdsAcMajor')?.focus();
      this.modalService.showErrorDialog(
        'Bill Entry',
        'TDS ACmajor not selected.',
        'error'
      );
    }

    if (percentage != null && percentage != 0) {
      const control = this.billEntryForm.get('tdsAcMajor');
      control?.setValidators([Validators.required]);
      control?.updateValueAndValidity();
      const tdsPercentage = this.billEntryForm.get('tdsPerc');
      tdsPercentage?.setValidators([Validators.required]);
      tdsPercentage?.updateValueAndValidity();
    } else if (percentage != null && tdsACMajor != null) {
      const control = this.billEntryForm.get('tdsAcMajor');
      control?.setValidators(null);
      control?.updateValueAndValidity();
      const tdsPercentage = this.billEntryForm.get('tdsPerc');
      tdsPercentage?.setValidators(null);
      tdsPercentage?.updateValueAndValidity();
    }

    const tdsAmt =
      (Number(
        Number(this.billEntryForm.value.totalTaxableAmmt) +
          Number(this.billEntryForm.value.otherCharg) -
          Number(this.billEntryForm.value.adjustAdvn)
      ) /
        100) *
      Number(percentage);

    if (!isRetrive) {
      this.billEntryForm
        .get('tdsAmount')
        ?.setValue(this.tdsAmtRoundOfAmt(tdsAmt));
    }
    this.config.calculatedTaxAmt = this.tdsAmtRoundOfAmt(tdsAmt);

    // this.onLeaveTDSAmt(tdsAmt);
  }
  onLeaveTDSAmt(percentage: any) {
    const number = Number(percentage);
    this.config.selfEnteredTaxAmt = this.tdsAmtRoundOfAmt(number);
  }

  // tds exp id class
  // TDS Calculation
  onLeaveExpID(expId: any, isFrontEnd?: boolean) {
    const expClass = this.billEntryForm.getRawValue().expClass;

    if (expId && !expClass) {
      const msg = 'Exp class is not entered, Do you want to enter class ?';
      isFrontEnd ? '' : this.showPopupForExpIdAndClass(msg, true, 1);
      this.expClassAndExpIdValidation(true);
    } else if (expClass && !expId) {
      const msg = 'Exp Id is not entered, Do you want to enter exp id ?';
      isFrontEnd ? '' : this.showPopupForExpIdAndClass(msg, true, 2);
      this.expClassAndExpIdValidation(true);
    }
    if (!expId && !expClass) {
      this.expClassAndExpIdValidation(false);
    }
  }

  showPopupForExpIdAndClass(msg: string, yesOrNo: boolean, condition?: number) {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: msg,
        template: '',
        type: 'info',
        confirmationDialog: yesOrNo,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.expClassAndExpIdValidation(true);
        if (condition == 2) {
          document.getElementById('id_expId')?.focus();
        } else if (condition == 1) {
          document.getElementById('id_expClass')?.focus();
        }
      } else {
        this.expClassAndExpIdValidation(false);
        if (condition == 2) {
          this.billEntryForm.get('expClass')?.setValue('');
        } else if (condition == 1) {
          this.billEntryForm.get('expId')?.setValue('');
        }
      }
    });
  }

  expClassAndExpIdValidation(isRequired: boolean) {
    if (isRequired) {
      const control = this.billEntryForm.get('expClass');
      control?.setValidators([Validators.required]);
      control?.updateValueAndValidity();
      const tdsPercentage = this.billEntryForm.get('expId');
      tdsPercentage?.setValidators([Validators.required]);
      tdsPercentage?.updateValueAndValidity();
    } else {
      const control = this.billEntryForm.get('expClass');
      control?.setValidators(null);
      control?.setValue('');
      control?.updateValueAndValidity();
      const tdsPercentage = this.billEntryForm.get('expId');
      tdsPercentage?.setValidators(null);
      tdsPercentage?.setValue('');
      tdsPercentage?.updateValueAndValidity();
      this.filter_expId = `sun_class = '` + '' + `'`;
    }
  }

  removeLastAND(str: string) {
    if (str.endsWith('AND ')) {
      // Remove the last 3 characters ("AND") if they exist
      return str.slice(0, -4);
    } else {
      // No "AND" at the end, return the original string
      return str;
    }
  }

  // tds percentage popup
  tdsPercentagePopUp() {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'TDS % is not entered, Do you want to enter percentage ?',
        template: '',
        type: 'info',
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        document.getElementById('id_tdsPerc')?.focus();
      } else {
        const control = this.billEntryForm.get('tdsAcMajor');
        control?.setValidators(null);
        control?.setValue('');
        control?.updateValueAndValidity();
        const tdsPercentage = this.billEntryForm.get('tdsPerc');
        tdsPercentage?.setValidators(null);
        tdsPercentage?.setValue('');
        tdsPercentage?.updateValueAndValidity();
      }
    });
  }

  //////////////////////////////////////////////////
  //old code
  onLeaveAcMajor(val: string, isRetrive: boolean) {
    this.filter_minType = `vmin_acmajor = '` + val + `'`;
    let parms = {
      acMajor: val,
    };
    if (val) {
      this.http
        .request('get', api_url.getAdminBillMinTypeIsDisabled, null, parms)
        .subscribe((res: any) => {
          if (res.data.expClass) {
            this.billEntryForm.get('expClass')?.setValue(res.data.expClass);
          }
          if (res.data.isDisabled) {
            this.billEntryForm.get('minType')?.disable();
            this.billEntryForm.get('acMinor')?.disable();
            this.billEntryForm.get('minType')?.setValue('');
            this.billEntryForm.get('acMinor')?.setValue('');
            document.getElementById('id_expClass')?.focus();
            this.updateValidatorsForACMajorSelection(false);
          } else {
            this.billEntryForm.get('minType')?.enable();
            this.billEntryForm.get('acMinor')?.enable();
            document.getElementById('id_minType')?.focus();
            this.updateValidatorsForACMajorSelection(true);
          }

          console.log('party info for ac major', res.data);

          this.billEntryForm.patchValue({
            isSecurity: res.data.isSecurity,
            isLegal: res.data.isLegal,
          });

          if (!isRetrive) {
            this.reverseChargeMechanisamHandel();
          }
        });

      if (val.includes('40502247')) {
        const control = this.billEntryForm.get('period.fromdate');
        control?.setValidators([Validators.required]);
        control?.updateValueAndValidity();
        const tdsPercentage = this.billEntryForm.get('period.uptodate');
        tdsPercentage?.setValidators([Validators.required]);
        tdsPercentage?.updateValueAndValidity();
      } else {
        const control = this.billEntryForm.get('period.fromdate');
        control?.setValidators(null);
        control?.setValue('');
        control?.updateValueAndValidity();
        const tdsPercentage = this.billEntryForm.get('period.uptodate');
        tdsPercentage?.setValidators(null);
        tdsPercentage?.setValue('');
        tdsPercentage?.updateValueAndValidity();
      }
    }
  }

  onLeavePeriod() {

    if (!this.billEntryForm.getRawValue().serNo) {
      const acMajor = this.commonService
        .convertArryaToString(this.billEntryForm.getRawValue().acmajor)
        ?.trimEnd();
      const fromDate = moment(
        this.billEntryForm.getRawValue().period.fromdate
      ).format('YYYY-MM-DD');
      const toDate = moment(
        this.billEntryForm.getRawValue().period.uptodate
      ).format('YYYY-MM-DD');

      let body = {
        companyCode: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().coyCode)
          ?.trimEnd(),
        partyType: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().partyType)
          ?.trimEnd(),
        partyCode: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().partyCode)
          ?.trimEnd(),
        buildingCode: this.commonService
          .convertArryaToString(this.billEntryForm.getRawValue().bldgCode)
          ?.trimEnd(),
        acMajor: acMajor,
        fromDate: fromDate,
        toDate: toDate,
      };

      this.http
        .request('post', api_url.getIsBillExist, body, null)
        .subscribe((res: any) => {
          console.log('is ', res);
          if (res.success) {
            if (res.data) {
              const dialogRef = this.dailog.open(ModalComponent, {
                disableClose: true,
                data: {
                  isF1Pressed: false,
                  title: 'K-Raheja ERP',
                  message:
                    'Bill has already created for this period. Do you want to continue with same period ?',
                  template: '',
                  type: 'info',
                  confirmationDialog: true,
                },
              });
              dialogRef.afterOpened().subscribe(() => {});
              dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {
                  this.checkTDSCalculation();
                } else {
                  document.getElementById('periodFrom')?.focus();
                }
              });
            }else
            {
              this.checkTDSCalculation();
            }
          }
        });
    }
  }

  gstFlagValidation() {
    // compny register logic
    if (this.billEntryForm.getRawValue().isPartyLimited) {
      // party is limited and ac major other than legal and security
      if (
        !this.billEntryForm.value.isSecurity &&
        !this.billEntryForm.value.isLegal
      ) {
        this.billEntryForm.patchValue({
          gstrevchgyn: 'N',
        });
      }
      // If party is registered and if a/c major is Legal then ask about applying RCM.
      else if (this.billEntryForm.value.isLegal) {
        document.getElementById('gstFlag')?.click();
      }
      //If party is registered and if a/c major is Security then by default set RCM = N
      else if (this.billEntryForm.value.isSecurity) {
        this.billEntryForm.patchValue({
          gstrevchgyn: 'N',
        });
      }
    } else {
      // compny not register logic
      this.billEntryForm.patchValue({
        gstrevchgyn: 'N',
      });
    }
  }

  // reverse charge mechanisam logic
  reverseChargeMechanisamHandel() {
    var partyLimited = this.billEntryForm.getRawValue().isPartyLimited;
    var partyGstNumber = this.billEntryForm.getRawValue().partyGstNo?.trimEnd();
    var companyGst = this.billEntryForm.getRawValue().companyGstNo?.trimEnd();
    var isLegal = this.billEntryForm.getRawValue().isLegal;
    var isSecurity = this.billEntryForm.getRawValue().isSecurity;

    // if party is not register and company also dont have gst number
    if (!partyGstNumber && !companyGst) {
      //  logic no 1 -- ac is not isLegal and ac is not security
      if (!isLegal && !isSecurity) {
        this.reversChargeMechanisPopup();
      }
      // logic no 2
      else if (isLegal || isSecurity) {
        this.billEntryForm.patchValue({
          gstrevchgyn: 'N',
        });
      }
    }
    // logic no 3 if party is register and company doest not have GST
    else if (partyGstNumber && !companyGst) {
      this.billEntryForm.patchValue({
        gstrevchgyn: 'N',
      });
    }
    // company have gst but party is not register
    else if (companyGst && !partyGstNumber) {
      // logic 4
      if ((isLegal && !isSecurity) || (!isLegal && !isSecurity)) {
        this.reversChargeMechanisPopup();
      }
      //  logic 5
      else if (!isLegal && isSecurity) {
        console.log("logic 5");
        if (partyLimited) {
          this.billEntryForm.patchValue({
            gstrevchgyn: 'N',
          });
        } else {
          this.billEntryForm.patchValue({
            gstrevchgyn: 'Y',
          });
        }
      }
    }
    // company have gst and party is register
    else if (companyGst && partyGstNumber) {
      //logic 6
      if (!isLegal && isSecurity || !isLegal && !isSecurity) {
        console.log("logic 6");

        this.billEntryForm.patchValue({
          gstrevchgyn: 'N',
        });
      } else if (isLegal && !isSecurity) {
        console.log("logic 7");
        this.reversChargeMechanisPopup();
      }
    }

    console.log('RCM logic', this.billEntryForm.getRawValue().gstrevchgyn);
  }

  // rever charge mechanisam popuop
  reversChargeMechanisPopup() {
    const dialogRef = this.dailog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'Reverse Charge mechanism applicable for this bill ?',
        template: '',
        type: 'info',
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.billEntryForm.patchValue({
          gstrevchgyn: 'Y',
        });
      } else {
        this.billEntryForm.patchValue({
          gstrevchgyn: 'N',
        });
      }
    });
  }

  setGSTFlag() {
    if (this.config.gstnFlag == 'Y') {
      this.billEntryForm.patchValue({
        gstrevchgyn: 'Y',
      });
    } else {
      this.billEntryForm.patchValue({
        gstrevchgyn: 'N',
      });
    }
  }
  onLeaveMinType(val: string) {
    this.filter_acminor = `min_minorstype = '` + val + `'`;
  }
  onLeaveExpClass(val: string) {
    if (val) {
      this.filter_expId = `sun_class = '` + val + `'`;
    } else {
      this.filter_expId = `sun_class = '` + val + `'`;
    }

    const expClass = this.billEntryForm.getRawValue().expId;

    if (!val && !expClass) {
      this.expClassAndExpIdValidation(false);
    }
  }
  //old code

  //////////////////////////////////////////////////s
}
