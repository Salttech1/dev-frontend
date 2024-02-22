import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { buttonsList } from 'src/app/shared/interface/common';
import { auxiQueryString, cheques } from 'src/app/shared/interface/sales';
import { api_url } from 'src/constants/constant';
import { DynaPopConstant } from 'src/constants/dyna-pop-constant';

@Component({
  selector: 'app-auxiliary-receipt',
  templateUrl: './auxiliary-receipt.component.html',
  styleUrls: ['./auxiliary-receipt.component.css'],
})
export class AuxiliaryReceiptComponent implements OnInit, OnDestroy {
  // declaration all varibales, constants
  customerDetails = this.initiliseForm();
  // dynomo query string for relational data
  queryString: auxiQueryString = {
    bldCode: '',
    wingCode: '',
    finalString: '',
    getFlatNumber: '',
    getWing: '',
    getReceiptNum: '',
  };

  buttonsList: Array<buttonsList> = [];

  config: any = {
    isProccesed: false,
    currentDate: new Date(),
    url: '',
    isAllocation: false,
    isLoading: false,
  };
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private commonService: CommonService,
    private router: Router,
    private modalService: ModalService,
    private dialog: MatDialog,

    private renderer: Renderer2
  ) {}

  navigate(e: KeyboardEvent, i: number, name: String) {
    let nextRow: any = i;

    e.key == 'ArrowDown'
      ? nextRow++
      : e.key == 'ArrowUp' && nextRow > 0
      ? nextRow--
      : '';

    let nextElId = name + '_' + nextRow;
    // Get the parent element
    const parentElement = document.getElementById(nextElId);
    this.renderer.selectRootElement(parentElement)?.focus();
  }

  //life cycle
  ngOnInit(): void {
    this.init();
    this.tdsMatchWithCheque();
  }

  ngOnDestroy(): void {
    // this.customerDetails
  }

  //initial function which is required for accessing value of input field and other required details
  init() {
    this.buttonsList = this.commonService.getButtonsByIds([
      'add',
      'retrieve',
      'delete',
      'process',
      'confirm',

      'save',
      'print_rec',
      'print_vouch',
      'back',
      'exit',
    ]);

    // this.commonService.changeButtonName(
    //   'confirm',
    //   { name: 'Process', key: 'process' },
    //   this.buttonsList
    // );

    this.commonService.enableDisableButtonsByIds(
      ['confirm'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['process'],
      this.buttonsList,
      false
    );
    this.config.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];
    this.customerDetails.get('flatno')?.valueChanges.subscribe((val: any) => {
      val
        ? this.getFlatOwnerDetails(this.commonService.convertArryaToString(val))
        : '';
    });
    //disabled default buttons
    this.commonService.enableDisableButtonsByIds(
      [
        'retrieve',
        'delete',
        'confirm',
        'process',
        'save',
        'print_rec',
        'print_vouch',
      ],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add'],
      this.buttonsList,
      false
    );
    this.getChargeCode();
    this.customerDetails.controls.incomingChequeDetails.statusChanges.subscribe(
      (status) => {
        const myArrayControl =
          this.customerDetails.controls.incomingChequeDetails.get(
            'chequeDetails'
          ) as FormArray;
        if (status === 'VALID' && myArrayControl.length != 0) {
          // The FormGroup is now valid, perform your action here
          this.commonService.enableDisableButtonsByIds(
            ['process'],
            this.buttonsList,
            false
          );
        }
      }
    );

    this.customerDetails.controls.allocationDetails
      .get('tdsAdjAmt')
      ?.valueChanges.subscribe((val: any) => {
        const tdsAdjAMt=Number(
          this.customerDetails.controls.allocationDetails.get('tdsAdjAmt')?.value
        );

        const tdsAMt=  Number(
          this.customerDetails.controls.incomingChequeDetails.get('tdsAmount')
            ?.value
        )
        var balanceAmt=0
        if(tdsAMt>tdsAdjAMt)
        {
           balanceAmt =tdsAMt-tdsAdjAMt

        }else{
           balanceAmt =tdsAdjAMt-tdsAMt
        }

        this.customerDetails.controls.allocationDetails
          .get('BalanceTdsAmt')
          ?.setValue(balanceAmt);
      });
  }

  initiliseForm() {
    return this.formBuilder.group({
      chargeCode: [''],
      billType: [''],
      bldgcode: ['', Validators.required],
      blgdName: <any>[{ value: '', disabled: true }],
      wing: [''],
      flatno: ['', Validators.required],
      flatowner: <any>[{ value: '', disabled: true }],
      receiptdate: [new Date(), Validators.required], // Example: '2023-05-24'
      receiptNum: <any>[{ value: '', disabled: true }],
      narrative: [''],
      startMonth: <any>[{ value: '', disabled: true }],
      incomingChequeDetails: this.formBuilder.group({
        chqAmount: <any>[{ value: '0', disabled: true }],
        tdsAmount: <any>[0, [Validators.required]],
        totalAmount: <any>[{ value: 0, disabled: true }],
        receiptAmount: <any>[{ value: 0, disabled: true }],
        chequeDetails: this.formBuilder.array([]),
      }),
      allocationDetails: this.formBuilder.group(
        {
          outInfraDetailsBreakUp: this.formBuilder.array([]),
          tdsAmount: [0],
          total_og: [{ value: 0, disabled: true }],
          admin: [{ value: 0, disabled: true }],
          int: [{ value: 0, disabled: true }],
          total_cgst: [{ value: 0, disabled: true }],
          total_sgst: [{ value: 0, disabled: true }],
          total_igst: [{ value: 0, disabled: true }],
          startMonth: <any>[{ value: '', disabled: true }],
          endMonth: <any>[{ value: '', disabled: true }],
          totalmonth: <any>[{ value: '', disabled: true }],
          receiptAmt: <any>[{ value: 0, disabled: true }],
          adjAmount: <any>[{ value: 0, disabled: true }],
          balanceAmount: [{ value: 0, disabled: true }],
          tdsAmt: <any>[{ value: 0, disabled: true }],
          tdsAdjAmt: <any>[{ value: 0, disabled: true }],
          BalanceTdsAmt: [{ value: 0, disabled: true }],
        },
        { validator: this.tdsMatchValidator }
      ),
    });
  }

  tdsMatchWithCheque() {
    const tdsAmountControl: any = this.customerDetails.get(
      'incomingChequeDetails.tdsAmount'
    );
    const totalAmountControl: any = this.customerDetails.get(
      'incomingChequeDetails.chqAmount'
    );

    if (tdsAmountControl && totalAmountControl) {
      tdsAmountControl.valueChanges.subscribe(() => {
        if (Number(tdsAmountControl.value) > Number(totalAmountControl.value)) {
          tdsAmountControl.setErrors({ tdsGreaterThanTotal: true });
          this.commonService.enableDisableButtonsByIds(
            ['process'],
            this.buttonsList,
            true
          );
        } else {
          tdsAmountControl.setErrors(null);

          this.commonService.enableDisableButtonsByIds(
            ['process'],
            this.buttonsList,
            false
          );
        }
      });

      totalAmountControl.valueChanges.subscribe(() => {
        if (Number(tdsAmountControl.value) > Number(totalAmountControl.value)) {
          tdsAmountControl.setErrors({ tdsGreaterThanTotal: true });
        } else {
          tdsAmountControl.setErrors(null);
        }
      });
    }
  }

  tdsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const tdsAmt = Number(control.get('tdsAmt')?.value);
    const tdsAdjAmt =Number( control.get('tdsAdjAmt')?.value);

    if (tdsAmt != tdsAdjAmt) {
      return { tdsDoNotMatch: true };
    }

    return null; // No validation error
  }
  // change charg code using routed
  getChargeCode() {
    if (
      this.config.url === 'auxiliaryreceiptentryeditgstfirst' ||
      this.config.url === 'auxiliaryreceiptentryeditgstnormal'
    ) {
      this.customerDetails.get('chargeCode')?.setValue('AUXI');
    } else {
      this.customerDetails.get('chargeCode')?.setValue('INAP');
    }

    if (
      this.config.url === 'auxiliaryreceiptentryeditgstnormal' ||
      this.config.url === 'infrareceiptentryeditgstnormal' ||
      this.config.url === 'infrareceiptentryeditnormal'
    ) {
      this.customerDetails.get('billType')?.setValue('N');
    } else {
      this.customerDetails.get('billType')?.setValue('F');
    }
  }

  //event lister
  buttonAction(event: string) {
    console.log('form data', this.customerDetails);
    console.log('form data raw ', this.customerDetails.getRawValue());

    if (event == 'save') {
      this.saveData();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    } else if (event == 'back') {
      this.resetForm();
    } else if (event == 'add') {
      this.onClickAdd();
    } else if (event == 'process') {
      this.onClickProccess(event);
    } else if (event == 'confirm') {
      this.onClickConfirm(event);
    }
  }

  // reset form and page
  resetForm() {
    this.customerDetails.patchValue({
      chargeCode: '',
      billType: '',
      bldgcode: '',
      blgdName: '',
      wing: '',
      flatno: '',
      flatowner: '',
      receiptdate: new Date(),
      receiptNum: '',
      narrative: '',
      startMonth: '',
      incomingChequeDetails: {
        chqAmount: '',
        tdsAmount: 0,
        totalAmount: 0,
        receiptAmount: 0,
        chequeDetails: [],
      },
      allocationDetails: {
        outInfraDetailsBreakUp: [],
        tdsAmount: 0,
        total_og: 0,
        admin: 0,
        int: 0,
        total_cgst: 0,
        total_sgst: 0,
        total_igst: 0,
        startMonth: '',
        endMonth: '',
        totalmonth: 0,
        receiptAmt: 0,
        adjAmount: 0,
        balanceAmount: 0,
        tdsAmt: 0,
        tdsAdjAmt: 0,
        BalanceTdsAmt: 0,
      },
    });
    this.customerDetails.get('bldgcode')?.enable();
    this.customerDetails.get('flatno')?.enable();
    this.customerDetails.get('wing')?.enable();
    this.customerDetails.controls.incomingChequeDetails
      .get('tdsAmount')
      ?.enable();

    while (
      this.customerDetails.controls.incomingChequeDetails
        .get('chequeDetails')
        ?.getRawValue().length !== 0
    ) {
      this.removeChequeDetails(0);
    }
    while (
      this.customerDetails.controls.allocationDetails
        .get('outInfraDetailsBreakUp')
        ?.getRawValue().length !== 0
    ) {
      this.removeOutInfraDetails(0);
    }
    this.commonService.enableDisableButtonsByIds(
      ['add'],
      this.buttonsList,
      false
    );

    // this.commonService.changeButtonName(
    //   'confirm',
    //   { name: 'Process', key: 'process' },
    //   this.buttonsList
    // );

    this.commonService.enableDisableButtonsByIds(
      ['confirm'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['process'],
      this.buttonsList,
      false
    );

    this.commonService.enableDisableButtonsByIds(
      ['retrieve', 'delete', 'process', 'save', 'print_rec', 'print_vouch'],
      this.buttonsList,
      true
    );

    this.getChargeCode();

    this.config.isProccesed = false;
    this.config.isAllocation = false;

    var inputElement: any = document.getElementById('bldgcode');

    // Set focus to the input element
    inputElement.focus();

    this.queryString = {
      bldCode: '',
      wingCode: '',
      finalString: '',
      getFlatNumber: '',
      getWing: '',
      getReceiptNum: '',
    };
  }

  // ///////////////////////////////
  // all cheque details
  // ///////////////////////////////
  createCheckDetails(): FormGroup | any {
    return this.formBuilder.group({
      bank: ['', Validators.required],
      outstat: ['N', Validators.required],
      fund: [['1 '], Validators.required],
      actype: [['1 '], Validators.required],
      date: [new Date()],
      num: ['', [Validators.required, this.uniqueNumValidatorForFormArray()]],
      amount: ['', Validators.required],
    });
  }

  uniqueNumValidatorForFormArray(): ValidatorFn {
    return (control: AbstractControl | any): { [key: string]: any } | null => {
      // Get the values of all the other `num` controls in the form array.
      const otherNumValues: AbstractControl[] =
        this.customerDetails.controls.incomingChequeDetails.controls.chequeDetails.controls?.filter(
          (c: any) => c.controls.num.value != 0
        );

      for (const numControl of otherNumValues) {
        const numValue = numControl.value.num;
        if (numValue.includes(control.value as AbstractControl)) {
          return { uniqueNum: true };
        }
      }
      return null;
    };
  }
  addChequeDetails() {
    const chequeDetailsArray: any =
      this.customerDetails.controls.incomingChequeDetails?.get(
        'chequeDetails'
      ) as FormArray;

    chequeDetailsArray.push(this.createCheckDetails());

    setTimeout(() => {
      var elements = document.getElementsByClassName('bankName');

      // Check if any elements were found
      if (elements.length > 0) {
        // Get the last element in the array (the one with the highest index)
        var lastElement: any = elements[elements.length - 1];

        // Apply the focus method to the last element
        lastElement.focus();
      }
    }, 100);
  }

  removeChequeDetails(index: number) {
    const chequeDetailsArray = this.customerDetails
      .get('incomingChequeDetails')
      ?.get('chequeDetails') as FormArray;
    chequeDetailsArray.removeAt(index);
    chequeDetailsArray.length === 0
      ? this.commonService.enableDisableButtonsByIds(
          ['add'],
          this.buttonsList,
          false
        )
      : '';
  }
  //////////////////////////////////
  // Allocation section_
  //////////////////////////////////
  createOutInfraItemDetails(data?: any) {
    return this.formBuilder.group({
      monthName: [
        { value: data?.monthName ? data.monthName : '', disabled: true },
      ],
      narrationCode: [
        {
          value: data?.narrationCode ? data.narrationCode : 'F',
          disabled: false,
        },
      ],
      narration: [
        { value: data?.narration ? data.narration : '', disabled: true },
      ],
      auxiPaid: [{ value: data?.auxiPaid ? data.auxiPaid : 0, disabled: true }],
      intPaid: [{ value: data?.intPaid ? data.intPaid : 0, disabled: false }],
      admin: [{ value: data?.admin ? data.admin : 0, disabled: true }],
      cgst: [{ value: data?.cgst ? data.cgst : 0, disabled: true }],
      sgst: [{ value: data?.sgst ? data.sgst : 0, disabled: true }],
      igst: [{ value: data?.igst ? data.igst : 0, disabled: true }],
      cgstPercent: [
        { value: data?.cgstPercent ? data.cgstPercent : 0, disabled: true },
      ],
      sgstPercent: [
        { value: data?.sgstPercent ? data.sgstPercent : 0, disabled: true },
      ],
      igstPercent: [
        { value: data?.igstPercent ? data.igstPercent : 0, disabled: true },
      ],
      tds: [{ value: data?.tds ? data.tds : 0, disabled: false }],
    });
  }
  addOutInfraDetails(data?: any) {
    const array = this.customerDetails
      .get('allocationDetails')
      ?.get('outInfraDetailsBreakUp') as FormArray;
    array.push(this.createOutInfraItemDetails(data));

    this.setValuesAfterAllocation();
  }
  removeOutInfraDetails(index: number) {
    const array = this.customerDetails
      .get('allocationDetails')
      ?.get('outInfraDetailsBreakUp') as FormArray;
    array.removeAt(index);
  }

  onTDSValueChange(event: any, item: any, fieldName?: string) {
    if (fieldName) {
      if (!event.target.value) {
        item.get(fieldName).setValue(0);
      }
      this.customerDetails.controls.allocationDetails
        .get('int')
        ?.setValue(this.calculateTotalAmmount(fieldName));
    } else {
      if (!event.target.value) {
        item.get('tds').setValue(0);
      }
      this.customerDetails.controls.allocationDetails
        .get('tdsAdjAmt')
        ?.setValue(this.calculateTotalAmmount('tds'));
    }
  }

  setValuesAfterAllocation() {
    this.customerDetails.controls.allocationDetails
      .get('total_og')
      ?.setValue(this.calculateTotalAmmount('auxiPaid'));
    this.customerDetails.controls.allocationDetails
      .get('admin')
      ?.setValue(this.calculateTotalAmmount('admin'));
    this.customerDetails.controls.allocationDetails
      .get('total_cgst')
      ?.setValue(this.calculateTotalAmmount('cgst'));
    this.customerDetails.controls.allocationDetails
      .get('total_sgst')
      ?.setValue(this.calculateTotalAmmount('sgst'));
    this.customerDetails.controls.allocationDetails
      .get('total_igst')
      ?.setValue(this.calculateTotalAmmount('igst'));
  }

  //on flat number enter fille the basic details eg- flat owner name and start month
  getFlatOwnerDetails(flatNumber: string) {
    let params = {
      bldgcode: this.commonService.convertArryaToString(
        this.customerDetails.get('bldgcode')?.value
      ),
      flatnum: this.commonService.convertArryaToString(flatNumber),
      wing: this.commonService.convertArryaToString(
        this.customerDetails.get('wing')?.value
      ),
    };

    this.http
      .request('get', api_url.getAuxiFlatOwnerData, null, params)
      .subscribe((res: any) => {
        this.customerDetails.get('flatowner')?.setValue(res.data);
      });

    let params2 = {
      bldgcode: this.commonService.convertArryaToString(
        this.customerDetails.get('bldgcode')?.value
      ),
      flatno: this.commonService.convertArryaToString(flatNumber),
      wing: this.commonService.convertArryaToString(
        this.customerDetails.get('wing')?.value != ''
          ? this.customerDetails.get('wing')?.value
          : ' '
      ),
      billtype: this.customerDetails.get('billType')?.value,
    };

    this.http
      .request('get', api_url.getAuxiStartDate, null, params2)
      .subscribe((res: any) => {
        this.customerDetails.get('startMonth')?.setValue(res.data);
      });
  }

  ////////////////////////////////
  // on building code input leave funtion (get wings list based on building code)
  ////////////////////////////////
  onLeaveBuildingCode(val: any) {
    this.queryString.bldCode = DynaPopConstant.BldCode + "'" + val + "'";
    this.queryString.getWing = this.queryString.bldCode;
  }
  onLeaveWingCode(val: any) {
    if (val) {
      this.queryString.wingCode =
        DynaPopConstant.and + DynaPopConstant.wingCode + "'" + val + "'";
      this.queryString.getFlatNumber =
        this.queryString.bldCode + this.queryString.wingCode;
    }
  }

  onTDSAmtChange(event: any) {
    if (event.target.value == '') {
      this.customerDetails.get('incomingChequeDetails.tdsAmount')?.setValue(0);
    }
    this.incomingChequeDetailsTDSCalculation(false);
  }

  onChequeNumberChange(event: any) {
    this.incomingChequeDetailsTDSCalculation(false);
  }

  // front end logic for incoming cheque details
  incomingChequeDetailsTDSCalculation(isAPI: boolean) {
    this.tdsMatchWithCheque();

    const totalAmmount = this.calculateTotalChequeAmmount();

    // Receipt Amt calculation
    const tdsAmt =
      this.customerDetails.controls.incomingChequeDetails.get(
        'tdsAmount'
      )?.value;

    isAPI
      ? this.customerDetails.controls.incomingChequeDetails
          .get('tdsAmount')
          ?.disable()
      : '';
    const receiptAmt = totalAmmount + Number(tdsAmt);
    this.customerDetails.controls.incomingChequeDetails
      .get('chqAmount')
      ?.setValue(totalAmmount.toFixed(2));
    this.customerDetails.controls.incomingChequeDetails
      .get('receiptAmount')
      ?.setValue(receiptAmt.toFixed(2));
    this.customerDetails.controls.incomingChequeDetails
      .get('totalAmount')
      ?.setValue(receiptAmt.toFixed(2));

    isAPI ? this.getAllocationDetails(receiptAmt, tdsAmt) : '';
  }

  // get allocation details
  getAllocationDetails(receiptAmt: any, tdsAmt: any) {
    this.config.isLoading = true;
    const wing = this.commonService
      .convertArryaToString(this.customerDetails.get('wing')?.value)
      ?.trimEnd();

    let payload = {
      chargeCode: this.customerDetails.get('chargeCode')?.value,
      narration: this.customerDetails.get('narrative')?.value,
      billType: this.customerDetails.get('billType')?.value,
      buildingCode: this.commonService.convertArryaToString(
        this.customerDetails.get('bldgcode')?.value
      ),
      wing:
        this.customerDetails.get('wing')?.value != ''
          ? wing
            ? wing
            : ' '
          : ' ',
      flatNum: this.commonService.convertArryaToString(
        this.customerDetails.get('flatno')?.value
      ),
      // inputDate: moment(this.customerDetails.get('receiptdate')?.value).format('DD/MM/YYYY'),
      date: moment(this.customerDetails.get('receiptdate')?.value).format(
        'DD/MM/YYYY'
      ),
      // inputDate: moment(this.customerDetails.get('receiptdate')?.value),
      totalAmt:
        this.customerDetails.controls.incomingChequeDetails.get('totalAmount')
          ?.value,
      receiptAmtTds:
        this.customerDetails.controls.incomingChequeDetails.get('tdsAmount')
          ?.value,
    };

const tdsAdjAMt=Number(
  this.customerDetails.controls.allocationDetails.get('tdsAdjAmt')?.value
);

const tdsAMt=  Number(
  this.customerDetails.controls.incomingChequeDetails.get('tdsAmount')
    ?.value
)
var balanceAmt=0
if(tdsAMt>tdsAdjAMt)
{
   balanceAmt =tdsAMt-tdsAdjAMt

}else{
   balanceAmt =tdsAdjAMt-tdsAMt
}


    this.customerDetails.controls.allocationDetails
      .get('BalanceTdsAmt')
      ?.setValue(balanceAmt);

    this.http
      .request('post', api_url.getAllocationDetails, payload, null)
      .subscribe({
        next: (res: any) => {
          if (res.result != 'failed') {
            // this.commonService.changeButtonName(
            //   'process',
            //   { name: 'Confirm', key: 'confirm' },
            //   this.buttonsList
            // );
            this.commonService.enableDisableButtonsByIds(
              ['confirm'],
              this.buttonsList,
              false
            );
            this.commonService.enableDisableButtonsByIds(
              ['process'],
              this.buttonsList,
              true
            );

            this.customerDetails.controls.allocationDetails.patchValue({
              startMonth: res.startMonth,
              endMonth: res.endMonth,
              totalmonth: res.totalMonth,
            });

            const keysList = [
              'admin',
              'auxiPaid',
              'cgst',
              'sgst',
              'igst',
              'cgstPercent',
              'igstPercent',
              'sgstPercent',
              'intPaid',
            ];

            var formattedData = this.commonService.formatKeysToTwoDecimalPlaces(
              res.data,
              keysList
            );

            formattedData.map((item: any) => {
              if (this.config.url.includes('first')) {
                const length = Number(res.data.length);
                const tds: any =
                  this.customerDetails.getRawValue().incomingChequeDetails
                    .tdsAmount;
                tdsAmt = tds / length;
                item.tds = parseFloat(tdsAmt.toFixed(2));
              }

              this.addOutInfraDetails(item);
            });

            this.config.isAllocation = true;

            this.customerDetails.controls.allocationDetails
              .get('receiptAmt')
              ?.setValue(receiptAmt.toString());
            this.customerDetails.controls.allocationDetails
              .get('adjAmount')
              ?.setValue(receiptAmt.toString());
            this.customerDetails.controls.allocationDetails
              .get('tdsAmt')
              ?.setValue(tdsAMt);

            this.customerDetails.controls.incomingChequeDetails.controls.chequeDetails.controls.forEach(
              (control) => {
                control.disable();
              }
            );
          } else {
            this.toastr.error(res.message);
          }
          this.config.isLoading = false;
        },
        error: (error: any) => {
          this.config.isLoading = false;
        },
      });
  }

  calculateTotalChequeAmmount(): number {
    const formArray = this.customerDetails.controls.incomingChequeDetails.get(
      'chequeDetails'
    ) as FormArray;

    let total = 0;
    formArray.controls.forEach((control) => {
      const amount = control.get('amount')?.value;
      if (!isNaN(amount)) {
        total += parseFloat(amount);
      }
    });

    return total;
  }
  calculateTotalAmmount(fieldName: string): any {
    const formArray = this.customerDetails.controls.allocationDetails.get(
      'outInfraDetailsBreakUp'
    ) as FormArray;

    let total = 0;
    formArray.controls.forEach((control) => {
      let amount :any = Number(control.get(fieldName)?.value);
      amount ? amount : (amount = 0);

      if (!isNaN(amount)) {
        total += parseFloat(amount);
      }
    });

    return total.toFixed(2);
  }

  //Insert the data
  saveData() {
    this.config.isLoading = true;
    const cheques = this.customerDetails
      .getRawValue()
      .incomingChequeDetails?.chequeDetails?.map((item: any) => ({
        bank: item.bank,
        outstat: item.outstat,
        acType: this.commonService.convertArryaToString(item.actype),
        cheqDate: moment(item.date).format('DD/MM/YYYY'),
        // chequeDate: moment(item.date) ,
        chequeNumber: item.num,
        chequeAmount: item.amount,
        fundSource: this.commonService.convertArryaToString(item.fund),
      }));

    let gridRequest =
      this.customerDetails.getRawValue().allocationDetails[
        'outInfraDetailsBreakUp'
      ];

    gridRequest.map((item: any) => {
      item['narrationCode'] = this.commonService.convertArryaToString(
        item.narrationCode
      );
    });

    let payload = {
      recDate: moment(this.customerDetails.getRawValue().receiptdate).format(
        'DD/MM/YYYY'
      ),
      // receiptDate:moment(this.customerDetails.getRawValue().receiptdate),
      cheques: cheques,
      gridRequest: gridRequest,
      cgstAmt:
        this.customerDetails.controls.allocationDetails.get('total_cgst')
          ?.value,
      sgstAmt:
        this.customerDetails.controls.allocationDetails.get('total_sgst')
          ?.value,
      igstAmt:
        this.customerDetails.controls.allocationDetails.get('total_igst')
          ?.value,
      tdsAmt:
        this.customerDetails.controls.allocationDetails.get('tdsAmt')?.value,
      transactionAmt:
        this.customerDetails.controls.allocationDetails.get('receiptAmt')
          ?.value,
      ogAmt:
        this.customerDetails.controls.allocationDetails.get('total_og')?.value,
      admin:
        this.customerDetails.controls.allocationDetails.get('admin')?.value,
      intPaid:
        this.customerDetails.controls.allocationDetails.get('int')?.value,
      igst: this.customerDetails.controls.allocationDetails.get('total_igst')
        ?.value,
      startMonth:
        this.customerDetails.getRawValue().allocationDetails['startMonth'],
      endMonth:
        this.customerDetails.getRawValue().allocationDetails['endMonth'],
      totalMonth:
        this.customerDetails.getRawValue().allocationDetails['totalmonth'],
    };
    const wing = this.commonService
      .convertArryaToString(this.customerDetails.get('wing')?.value)
      ?.trimEnd();

    let params = {
      buildingCode: this.commonService.convertArryaToString(
        this.customerDetails.getRawValue().bldgcode
      ),
      wing: this.commonService.convertArryaToString(
        this.customerDetails.getRawValue().wing != ''
          ? wing
            ? wing
            : ' '
          : ' '
      ),
      flatNumber: this.commonService.convertArryaToString(
        this.customerDetails.getRawValue().flatno
      ),
      chargeCode: this.customerDetails.getRawValue().chargeCode,
      billType: this.customerDetails.getRawValue().billType,
      // userId: sessionStorage.getItem('userName'),
    };

    this.http
      .request(
        'post',
        api_url.saveAuxiliaryReceiptEntryDetails,
        payload,
        params
      )
      .subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (res.result == 'success') {
            const dialogRef = this.dialog.open(ModalComponent, {
              disableClose: true,
              data: {
                isF1Pressed: false,
                title: 'K-Raheja ERP',
                message:
                  'Data Saved succesfully into Receipt no -' + res.receptNumber,
                template: '',
                type: 'info',
              },
            });
            dialogRef.afterOpened().subscribe(() => {});
            dialogRef.afterClosed().subscribe((result: any) => {
              const reportPayload = {
                bldgcode: params.buildingCode,
                blgdName: this.customerDetails.getRawValue().blgdName,
                wing: params.wing != '' ? params.wing : '',
                flatNum: params.flatNumber,
                ownerName: this.customerDetails.getRawValue().flatowner,
                recnum: res.receptNumber,
              };

              localStorage.setItem(
                'reportPayload',
                JSON.stringify(reportPayload)
              );

              if (this.config.url.includes('auxi')) {
                if (this.customerDetails.value.billType === 'F') {
                  this.router.navigate([
                    '/sales/auxiliary/reports/auxiliaryreceiptreportfirst',
                  ]);
                } else {
                  this.router.navigate([
                    '/sales/auxiliary/reports/auxiliaryreceiptreportnormal',
                  ]);
                }
              } else {
                if (this.customerDetails.value.billType === 'F') {
                  this.router.navigate([
                    '/sales/infra/reports/infrareceiptreprintfirst',
                  ]);
                } else {
                  this.router.navigate([
                    '/sales/infra/reports/infrareceiptreprintnormal',
                  ]);
                }
              }
            });
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (error: any) => {
          this.config.isLoading = false;
        },
      });
  }

  ///////////////////////////////////////
  // on click action button methods
  ///////////////////////////////////////
  onClickAdd() {
    if (
      this.customerDetails.get('bldgcode')?.value != '' &&
      this.customerDetails.get('flatno')?.value != '' &&
      this.customerDetails.valid
    ) {
      this.addChequeDetails();
      this.customerDetails.get('bldgcode')?.disable();
      this.customerDetails.get('flatno')?.disable();
      this.customerDetails.get('wing')?.disable();
      this.commonService.enableDisableButtonsByIds(
        ['add'],
        this.buttonsList,
        true
      );
    } else {
      this.toastr.error('Please complete all the required fields.');
    }
  }

  onClickProccess(btnName: string) {
    if (this.customerDetails.valid) {
      this.config.isProccesed = true;
      this.incomingChequeDetailsTDSCalculation(true);
    } else {
      const totalTdsControl: any = this.customerDetails.get(
        'incomingChequeDetails.tdsAmount'
      );
      this.toastr.error('Please complete all the required fields.');
    }
  }

  onClickConfirm(btnName: string) {
    if (!this.customerDetails.valid) {
      this.modalService.showErrorDialog(
        'Allocation section',
        'TDS Receipt Amount Is Not equal to Adjusted Amount.',
        'error'
      );
    } else {
      this.commonService.enableDisableButtonsByIds(
        ['confirm'],
        this.buttonsList,
        true
      );
      this.commonService.enableDisableButtonsByIds(
        ['save'],
        this.buttonsList,
        false
      );
    }
  }

  onInputFocus(event: any, fieldName?: string, item?: any) {
    event.target.select();
    // if (fieldName == 'tds') {
    //   item.get(fieldName).setValue('')

    // } else if (fieldName == 'tdsAmount') {
    //   this.customerDetails.get('incomingChequeDetails.tdsAmount')?.setValue('')
    // } else if (fieldName == 'amount') {
    //   item.get('amount')?.setValue('')
    // } else if (fieldName == 'intPaid') {
    //   item.get('intPaid')?.setValue('')
    // }

    // event.target.value = ''
  }

  dateCheck(event: any) {
    const inputDate = new Date(event.value);
    const today = new Date();
    // Set the time part of both dates to midnight
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Use getTime() to compare the dates as numbers
    const isDateLessThanToday = inputDate.getTime() < today.getTime();
    isDateLessThanToday
      ? this.showConfirmation3(
          'K-Raheja ERp',
          'Receipt Date is less than today',
          'error'
        )
      : '';
  }

  showConfirmation3(titleVal: any, message: string, type: string) {
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
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      document.getElementById('auxi_narrative')?.focus();
    });
  }
}
