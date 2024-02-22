import { Component, OnInit, Renderer2 } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { api_url } from 'src/constants/constant';
import { take, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { ServiceService } from 'src/app/services/service.service';
import { CommonReportsService } from 'src/app/services/reports.service';
import { Location } from '@angular/common';
import { data, error } from 'jquery';
import * as moment from 'moment';
import { Item } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-admin-debit-note-entry',
  templateUrl: './admin-debit-note-entry.component.html',
  styleUrls: ['./admin-debit-note-entry.component.css'],
})
export class AdminDebitNoteEntryComponent implements OnInit {
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`; // use for party type filter
  initialMode: boolean = false;
  // maxDate = new Date(); // use for future date disabled
  disabledTable: boolean = false;
  tranMode: String = '';

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'save',
    'back',
    'exit',
  ]);

  config = {
    currentDate: new Date(),
    isLoading: false,
    isSave: false,
    isDebitNoteEntry: false,
  };

  filter: any = {
    getInvoice: '',
    getBldg: '',
    getCoy: '',
    getParPartyType: '',
  };
  debitNoteForm: any;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private renderer: Renderer2,
    private dailog: MatDialog,
    private service: ServiceService,
    private commonReport: CommonReportsService,
    private location: Location
  ) {}

  // Debit note form-1
  debitNote: FormGroup = this.fb.group({
    dbnoteser: ['', Validators.required],
    debitNoteDate: [new Date(), Validators.required],
  });

  // Debit note form-2
  debitNoteDetails: FormGroup = this.fb.group(
    {
      exportType: ['PDF'],
      partytype: ['Z', Validators.required],
      partytypename: [{ value: 'Miscellaneous Party', disabled: true }],
      invbillno: ['', Validators.required],
      serialNo: [{ value: '', disabled: true }],
      invbilldt: [{ value: '', disabled: true }],
      partycode: ['', Validators.required],
      partycodename: [{ value: '', disabled: true }],
      billtype: [{ value: '', disabled: true }],
      dnamount: [''],
      bldgcode: [{ value: '', disabled: true }],
      bldgcodename: [{ value: '', disabled: true }],
      tdsperc: [''],
      tdsamount: [''],
      coy: [{ value: '', disabled: true }],
      coyname: [{ value: '', disabled: true }],
      fotoamt: ['0'],
      description1: [''],
      narration: [''],

      debitNoteItemDetailList: this.fb.array([]),
    },
    { validators: this.validatePercentageSum }
  );

  ngOnInit(): void {
    this.init();
    this.setFocus('dabit_dabitnote');
  }

  init() {
    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'exit'],
      this.buttonsList,
      false
    );
  }

  createDebitNoteDetails(data?: any): FormGroup | any {
    return this.fb.group({
      saccode: [{ value: data ? data.ADBND_SACCODE : '', disabled: true }],
      sacdesc: [{ value: data ? data.ADBND_SACDESC : '', disabled: true }],
      quantity: [data ? data.ADBND_QUANTITY : ''],
      rate: [data ? data.ADBND_RATE : ''],
      amount: [data ? data.ADBND_AMOUNT : ''],
      discountamt: [data ? data.ADBND_DISCOUNTAMT : ''],
      taxableamt: [data ? data.ADBND_TAXABLEAMT : ''],
      cgstperc: [data ? data.ADBND_CGSTPERC : ''],
      cgstamt: [data ? data.ADBND_CGSTAMT : ''],
      sgstperc: [data ? data.ADBND_SGSTPERC : ''],
      sgstamt: [data ? data.ADBND_SGSTAMT : ''],
      igstperc: [data ? data.ADBND_IGSTPERC : ''],
      igstamt: [data ? data.ADBND_IGSTAMT : ''],
      ugstperc: [data ? data.ADBND_UGSTPERC : ''],
      ugstamt: [data ? data.ADBND_UGSTAMT : ''],
    });
  }

  validatePercentageSum(form: FormGroup) {
    const groupArray: any = form.get('debitNoteItemDetailList') as FormArray;

    if (groupArray.controls.length != 0) {
      groupArray.controls.map((group: any) => {
        const cgstperc = Number(group.get('cgstperc')?.value) || 0;
        const sgstperc = Number(group.get('sgstperc')?.value) || 0;
        const igstperc = Number(group.get('igstperc')?.value) || 0;
        const ugstperc = Number(group.get('ugstperc')?.value) || 0;

        const totalPercentage = cgstperc + sgstperc + igstperc + ugstperc;

        if (
          cgstperc > 100 ||
          sgstperc > 100 ||
          igstperc > 100 ||
          ugstperc > 100
        ) {
          if (cgstperc > 100) {
            group.get('cgstperc').setErrors({ invalidPercentage: true });
          } else {
            group.get('cgstperc').setErrors(null);
          }

          if (sgstperc > 100) {
            group.get('sgstperc').setErrors({ invalidPercentage: true });
          } else {
            group.get('sgstperc').setErrors(null);
          }

          if (igstperc > 100) {
            group.get('igstperc').setErrors({ invalidPercentage: true });
          } else {
            group.get('igstperc').setErrors(null);
          }

          if (ugstperc > 100) {
            group.get('ugstperc').setErrors({ invalidPercentage: true });
          } else {
            group.get('ugstperc').setErrors(null);
          }
        } else {
          group.get('cgstperc').setErrors(null);
          group.get('sgstperc').setErrors(null);
          group.get('igstperc').setErrors(null);
          group.get('ugstperc').setErrors(null);
        }
      });
    }

    return null;
  }

  addDebitNotDetails(data?: any) {
    const array = this.debitNoteDetails?.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    array.push(this.createDebitNoteDetails(data));
  }

  createDebitNoteDetails1(data?: any): FormGroup | any {
    return this.fb.group({
      saccode: [{ value: data ? data.adbldHsnsaccode : '', disabled: true }],
      sacdesc: [{ value: data ? data.adbldItemdesc : '', disabled: true }],
      quantity: ['0'],
      rate: ['0'],
      amount: ['0'],
      discountamt: ['0'],
      taxableamt: ['0'],
      cgstperc: [data ? (data.adbldCgstperc ? data.adbldCgstperc : '0') : '0'],
      cgstamt: ['0'],
      sgstperc: [data ? (data.adbldSgstperc ? data.adbldSgstperc : '0') : '0'],
      sgstamt: ['0'],
      igstperc: [data ? (data.adbldIgstperc ? data.adbldIgstperc : '0') : '0'],
      igstamt: ['0'],
      ugstperc: [data ? (data.adbldUgstperc ? data.adbldUgstperc : '0') : '0'],
      ugstamt: ['0'],
    });
  }

  addDebitNotesDetailsByInvoiceByNumber(data?: any) {
    const array = this.debitNoteDetails?.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    array.push(this.createDebitNoteDetails1(data));
  }

  removeChequeDetails(index: number) {
    const array = this.debitNoteDetails.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    array.removeAt(index);
  }

  buttonAction(event: string) {
    console.log('form details', this.debitNoteDetails);

    if (event == 'add') {
      // this.addDebitNote();
      this.debitNoteDetails.get('invbillno')?.enable();
      this.debitNoteDetails.get('partycode')?.enable();
      this.debitNoteDetails.get('partytype')?.enable();
      // this.debitNoteDetails.get('serialNo')?.enable();
      // this.debitNoteDetails.get('serialNo')?.enable();
      // this.debitNoteDetails.reset();

      this.onClickAdd();
    } else if (event == 'retrieve') {
      this.fetchDebitNoteEntry();
    } else if (event == 'save') {
      this.saveDebitNote();
    } else if (event == 'print') {
      this.getPrint(true);
    } else if (event == 'back') {
      this.resetDebitNoteCancellation();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // on click event
  onClickAdd() {
    if (
      (this.debitNote.value.dbnoteser == '' ||
        this.debitNote.value.dbnoteser == null) &&
      this.debitNote.value.debitNoteDate != null
    ) {
      if (this.debitNote.get('debitNoteDate')?.errors?.['matDatepickerMax']) {
        this.showConfirmation3(
          'K-Raheja ERP',
          'Please enter valid date.',
          'error'
        );
      } else {
        this.tranMode = 'A';
        this.initialMode = true;
        this.debitNote.disable();
        this.disabledTable = false;
        this.debitNoteDetails.get('partycode')?.enable();
        this.setFocus('dabit_partyType');

        this.commonService.enableDisableButtonsByIds(
          ['save', 'back', 'exit'],
          this.buttonsList,
          false
        );
        this.commonService.enableDisableButtonsByIds(
          ['add', 'retrieve', 'reset', 'delete', 'list'],
          this.buttonsList,
          true
        );
      }
    } else {
      this.http
        .request(
          'get',
          api_url.getDebitNoteEntry + '?ser=' + this.debitNote.value.dbnoteser,
          null,
          null
        )
        .subscribe((res: any) => {
          const getDate = res.data.adbnotehAttributes[0].ADBNH_DATE;
          this.debitNote.get('debitNoteDate')?.setValue(getDate);
        });
      this.commonService.enableDisableButtonsByIds(
        ['add', 'retrieve', 'exit'],
        this.buttonsList,
        false
      );
      this.commonService.enableDisableButtonsByIds(
        ['reset', 'delete', 'list'],
        this.buttonsList,
        true
      );
    }
  }

  onClickRetrive() {
    if (this.debitNote.valid && this.debitNote.dirty) {
      this.fetchDebitNoteEntry();
    } else {
      this.showErrorMsg();
    }
  }

  //show erro msg

  showErrorMsg() {
    this.toastr.error('Please fill all mandatory field');
  }

  // Get Debit Note Entry
  fetchDebitNoteEntry() {
    // this.debitNote.get('dbnoteser')?.dirty;
    if (this.debitNote.value.dbnoteser != '' && this.debitNote.valid) {
      let payload = {
        dbnoteser: this.commonService.convertArryaToString(
          this.debitNote.get('dbnoteser')?.value[0][0].trim()
        ),
      };

      this.http
        .request(
          'get',
          api_url.getDebitNoteEntry + '?ser=' + this.debitNote.value.dbnoteser,
          payload,
          null
        )
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.tranMode = 'R';

            if (res?.result == 'failed') {
              this.toastr.error(res.message);
            } else if (
              res.data.billStatus == '5' ||
              res.data.billStatus == '7'
            ) {
              this.initialMode = true;
              this.disabledTable = true;
              this.debitNote.disable();
              this.debitNoteDetails.disable();
              const getDate = res.data.adbnotehAttributes[0].ADBNH_DATE;
              this.debitNote.get('debitNoteDate')?.setValue(getDate);
              this.filter.getInvoice =
                "adblh_partycode='" +
                res.data.adbnotehAttributes[0].ADBNH_PARTYCODE?.trimEnd() +
                "'";

                this.filter.getParPartyType = "par_partytype='" + res.data.adbnotehAttributes[0].ADBNH_PARTYTYPE + "'";

              // Patch Value for input field
              this.debitNoteDetails.patchValue({
                partytype: res.data.adbnotehAttributes[0].ADBNH_PARTYTYPE,
                partytypename: res.data.adbnotehAttributes[0].partydesc,
                invbillno: res.data.adbnotehAttributes[0].ADBNH_INVBILLNO,
                invbilldt: res.data.adbnotehAttributes[0].ADBNH_INVBILLDT,
                partycode: res.data.adbnotehAttributes[0].ADBNH_PARTYCODE,
                partycodename: res.data.adbnotehAttributes[0].par_partyname,
                billtype: res.data.adbnotehAttributes[0].ADBNH_BILLTYPE,
                dnamount: res.data.adbnotehAttributes[0].ADBNH_AMOUNT,
                bldgcode: res.data.adbnotehAttributes[0].ADBNH_BLDGCODE,
                bldgcodename: res.data.adbnotehAttributes[0].bldg_name,
                tdsperc: res.data.adbnotehAttributes[0].ADBNH_TDSPERC,
                tdsamount: res.data.adbnotehAttributes[0].ADBNH_TDSAMOUNT,
                coy: res.data.adbnotehAttributes[0].ADBNH_COY,
                coyname: res.data.adbnotehAttributes[0].coy_name,
                fotoamt: res.data.adbnotehAttributes[0].ADBNH_FOTOAMT,
                description1:
                  res.data.adbnotehAttributes[0].ADBNH_DESCRIPTION1?.trimEnd(),
                narration:
                  res.data.adbnotehAttributes[0].ADBNH_NARRATION?.trimEnd(),
              });

              res.data.adbnotedAttributes.map((item: any) => {
                this.addDebitNotDetails(item);
              });

              const groupArray = this.debitNoteDetails.get(
                'debitNoteItemDetailList'
              ) as FormArray;

              for (let i = 0; i < groupArray.length; i++) {
                const control = groupArray.at(i);
                control.disable();
              }

              this.toastr.error('Admin bill has been passed or paid.');
              this.commonService.enableDisableButtonsByIds(
                ['back', 'exit'],
                this.buttonsList,
                false
              );
              this.commonService.enableDisableButtonsByIds(
                ['add', 'retrieve', 'save', 'reset', 'delete', 'list'],
                this.buttonsList,
                true
              );
            } else {
              this.initialMode = true;
              this.disabledTable = true;
              this.debitNote.disable();
              this.debitNoteDetails.get('partycode')?.disable();
              this.debitNoteDetails.get('invbillno')?.disable();
              this.debitNoteDetails.get('partytype')?.disable();
              const getDate = res.data.adbnotehAttributes[0].ADBNH_DATE;
              this.debitNote.get('debitNoteDate')?.setValue(getDate);
              this.filter.getInvoice =
                "adblh_partycode='" +
                res.data.adbnotehAttributes[0].ADBNH_PARTYCODE +
                "'";

              // Patch Value for input field
              this.debitNoteDetails.patchValue({
                partytype: res.data.adbnotehAttributes[0].ADBNH_PARTYTYPE,
                partytypename: res.data.adbnotehAttributes[0].partydesc,
                invbillno: res.data.adbnotehAttributes[0].ADBNH_INVBILLNO,
                invbilldt: res.data.adbnotehAttributes[0].ADBNH_INVBILLDT,
                partycode: res.data.adbnotehAttributes[0].ADBNH_PARTYCODE,
                partycodename: res.data.adbnotehAttributes[0].par_partyname,
                serialNo: res.data.adbnotehAttributes[0].ADBNH_DBNOTESER,
                billtype: res.data.adbnotehAttributes[0].ADBNH_BILLTYPE,
                dnamount: res.data.adbnotehAttributes[0].ADBNH_AMOUNT,
                bldgcode: res.data.adbnotehAttributes[0].ADBNH_BLDGCODE,
                bldgcodename: res.data.adbnotehAttributes[0].bldg_name,
                tdsperc: res.data.adbnotehAttributes[0].ADBNH_TDSPERC,
                tdsamount: res.data.adbnotehAttributes[0].ADBNH_TDSAMOUNT,
                coy: res.data.adbnotehAttributes[0].ADBNH_COY,
                coyname: res.data.adbnotehAttributes[0].coy_name,
                fotoamt: res.data.adbnotehAttributes[0].ADBNH_FOTOAMT,
                description1:
                  res.data.adbnotehAttributes[0].ADBNH_DESCRIPTION1?.trimEnd(),
                narration:
                  res.data.adbnotehAttributes[0].ADBNH_NARRATION?.trimEnd(),
              });

              res.data.adbnotedAttributes.map((item: any) => {
                this.addDebitNotDetails(item);
              });

              this.toastr.success(
                res.message ? res.message : 'Data fetched successfully',
                'Data fetched'
              );
              this.commonService.enableDisableButtonsByIds(
                ['save', 'back', 'exit'],
                this.buttonsList,
                false
              );
              this.commonService.enableDisableButtonsByIds(
                ['add', 'retrieve', 'reset', 'delete', 'list'],
                this.buttonsList,
                true
              );
            }
          },
        });
    } else {
      this.setFocus('dabit_dabitnote');
    }
  }

  // data fetch by invoice number
  getDataInvoiceNo() {
    let parms = {
      partyType: this.commonService
        .convertArryaToString(this.debitNoteDetails.get('partytype')?.value)
        ?.trimEnd(),
      partyCode: this.commonService
        .convertArryaToString(this.debitNoteDetails.get('partycode')?.value)
        ?.trimEnd(),
      invoiceNum: this.commonService
        .convertArryaToString(this.debitNoteDetails.get('invbillno')?.value)
        ?.trimEnd(),
    };

    const formArray = this.debitNoteDetails.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    formArray.clear();
    if (parms.invoiceNum != 0) {
      this.config.isLoading = true;
      this.http.request('get', api_url.getByInvoice, null, parms).subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (Number(res.data.AdmBillh.adblhDebitamt) != 0) {
            this.toastr.success(
              'Admin Debit Note of Rs. ' +
                Math.round(res.data.AdmBillh.adblhDebitamt) +
                ' already entered, Please check...'
            );
          }

          if (res.success == false) {
            this.toastr.error(res.message);
          } else if (res.success) {
            this.debitNoteDetails.patchValue({
              serialNo: res.data.AdmBillh.admbillhCK.adblhSer,
              invbilldt: res.data.AdmBillh.adblhSuppbilldt,
              billtype: res.data.AdmBillh.adblhBilltype,
              fotoamt: res.data.AdmBillh.adblhFotoamount,
              bldgcode: res.data.AdmBillh.adblhBldgcode,
              tdsperc: res.data.AdmBillh.adblhTdsperc,
              // tdsamount: res.data.AdmBillh.adblhTdsamount,
              tdsamount: this.debitNoteDetails.get('tdsamount')?.setValue(0),
              coy: res.data.AdmBillh.adblhCoy,
              // dnamount: res.data.AdmBillh.adblhBillamount,
              dnamount: this.debitNoteDetails.get('dnamount')?.setValue(0),
              // narration: res.data.AdmBillh.adblhNarration,
              narration: this.debitNoteDetails.get('narration')?.setValue(''),

              // form field
              saccode: res.data.AdmBilld[0].adbldHsnsaccode,
              sacdesc: res.data.AdmBilld[0].adbldItemdesc,
              quantity: res.data.AdmBilld[0].adbldQuantity,
              rate: res.data.AdmBilld[0].adbldRate,
              // amount: res.data.AdmBilld[0].adbldAmount,
              amount: this.debitNoteDetails.get('amount')?.setValue(0),
              discountamt: res.data.AdmBilld[0].adbldDiscountamt,
              // taxableamt: res.data.AdmBilld[0].adbldTaxableamt,
              taxableamt: this.debitNoteDetails.get('taxableamt')?.setValue(0),
              cgstperc: res.data.AdmBilld[0].adbldCgstperc,
              cgstamt: res.data.AdmBilld[0].adbldCgstamt,
              sgstperc: res.data.AdmBilld[0].adbldSgstperc,
              sgstamt: res.data.AdmBilld[0].adbldSgstamt,
              igstperc: res.data.AdmBilld[0].adbldIgstperc,
              igstamt: res.data.AdmBilld[0].adbldIgstamt,
              ugstperc: res.data.AdmBilld[0].adbldUgstperc,
              ugstamt: res.data.AdmBilld[0].adbldUgstamt,
            });

            res.data.AdmBilld.map((item: any) => {
              this.addDebitNotesDetailsByInvoiceByNumber(item);
            });

            // this.debitNoteDetailBreakupCal(item);

            this.setFocus('debit_dnamt');
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => {
          this.config.isLoading = false;
        },
      });
    }
  }

  // error dailog box
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
      this.debitNoteDetails.get('amount')?.setValue(0);
      // this.setFocus('debit_dnamt');
    });
  }

  validateData() {
    var flag = true;
    const gridValue =
      this.debitNoteDetails.get('taxableamt')?.value +
      this.debitNoteDetails.get('cgstamt')?.value +
      this.debitNoteDetails.get('sgstamt')?.value +
      this.debitNoteDetails.get('igstamt')?.value +
      this.debitNoteDetails.get('ugstamt')?.value;

    const getDnAmt = this.debitNoteDetails.get('dnamount')?.value;

    if (gridValue > getDnAmt) {
      this.showConfirmation3(
        'K-Raheja ERP',
        'Total of Taxable Amt + GST Amt in Tax Details Grid = ' +
          gridValue +
          ' not tallying with Main Admin Debit Note Amt = ' +
          getDnAmt +
          '..... please enter correct details.',
        'info'
      );
      flag = false;
    } else {
      flag = true;
    }

    return flag;
  }

  // Save Debit Note Entry
  saveDebitNote() {
    const isFlag = this.validateData();

    if (isFlag && this.debitNoteDetails.valid) {
      let detailsList = this.debitNoteDetails
        .getRawValue()
        .debitNoteItemDetailList.map((item: any, index: number) => {
          if (item.amount != 0 || item.amount != '0') {
            let obj = {
              saccode: item.saccode,
              sacdesc: item.sacdesc,
              quantity: item.quantity,
              rate: item.rate ? item.rate : 0,
              amount: item.amount,
              discountamt: item.discountamt,
              taxableamt: item.taxableamt,
              cgstperc: item.cgstperc,
              cgstamt: item.cgstamt,
              sgstperc: item.sgstperc,
              sgstamt: item.sgstamt,
              igstperc: item.igstperc,
              igstamt: item.igstamt,
              ugstperc: item.ugstperc,
              ugstamt: item.ugstamt,
              site: sessionStorage.getItem('site'),
              userid: sessionStorage.getItem('userName'),
              isUpdate: false,
              lineno: index + 1,
            };
            return obj;
          }

          return;
        });

      detailsList.map((item: any, index: any) => {
        if (item == null) {
          detailsList.splice(index, 1);
        }
      });

      let savePayload = {
        isUpdate: false,
        adbnotehRequestBean: {
          dbnoteser: this.commonService
            .convertArryaToString(this.debitNote.get('dbnoteser')?.value)
            ?.trimEnd(),
          partytype: this.commonService.convertArryaToString(
            this.debitNoteDetails.get('partytype')?.value
          ),
          invbillno: this.commonService
            .convertArryaToString(this.debitNoteDetails.get('invbillno')?.value)
            ?.trimEnd(),
          invbilldt: moment(
            this.debitNoteDetails.get('invbilldt')?.value
          ).format('YYYY-MM-DD'),
          partycode: this.commonService
            .convertArryaToString(this.debitNoteDetails.get('partycode')?.value)
            ?.trimEnd(),
          billtype: this.debitNoteDetails.get('billtype')?.value,
          amount: this.debitNoteDetails.get('dnamount')?.value
            ? this.debitNoteDetails.get('dnamount')?.value
            : 0,
          bldgcode: this.commonService
            .convertArryaToString(this.debitNoteDetails.get('bldgcode')?.value)
            ?.trimEnd(),
          tdsperc: this.debitNoteDetails.get('tdsperc')?.value,
          tdsamount: this.debitNoteDetails.get('tdsamount')?.value
            ? this.debitNoteDetails.get('tdsamount')?.value
            : 0,
          coy: this.commonService
            .convertArryaToString(this.debitNoteDetails.get('coy')?.value)
            ?.trimEnd(),
          fotoamt: this.debitNoteDetails.get('fotoamt')?.value,
          description1: this.debitNoteDetails
            .get('description1')
            ?.value?.trimEnd(),
          narration: (this.debitNoteDetails.get('narration')?.value
            ? this.debitNoteDetails.get('narration')?.value
            : ''
          )?.trimEnd(),
          passedby: '',
          prepby: '',
          project: '',
          prop: '',
          date: moment(this.debitNote.get('debitNoteDate')?.value).format(
            'YYYY-MM-DD'
          ),
          site: sessionStorage.getItem('site'),
          today: new Date(),
          userid: sessionStorage.getItem('userName'),
          isUpdate: false,
        },
        adbnotedRequestBean: detailsList,
      };

      if (this.tranMode == 'A') {
        if (this.debitNoteDetails.valid) {
          if (detailsList.length != 0) {
            this.http
              .request('post', api_url.createDebitNoteEntry, savePayload, null)
              .subscribe({
                next: (res: any) => {
                  console.log('res', res);

                  if (res.success == false) {
                    this.toastr.error(res.message);
                  } else {
                    this.config.isLoading = true;
                    this.toastr.success(
                      res.message ? res.message : 'Data saved successfully.',
                      'Data saved.'
                    );
                    this.debitNote.get('dbnoteser')?.setValue(res.data);
                    if (res.success == true) {
                      this.showConfirmation(
                        'K-Raheja ERP',
                        'Do you want to print debit note Voucher details?(Y/N)',
                        'info',
                        true
                      );
                    }
                    this.initialMode = false;

                    this.debitNoteDetails.reset();

                    this.commonService.enableDisableButtonsByIds(
                      ['save', 'reset', 'delete', 'list', 'back'],
                      this.buttonsList,
                      true
                    );
                    this.commonService.enableDisableButtonsByIds(
                      ['add', 'retrieve'],
                      this.buttonsList,
                      false
                    );
                  }
                },
                error: () => {
                  this.config.isLoading = false;
                },
              });
          } else {
            this.toastr.error('Debit Notes item Details ammount not be zero');
          }
        } else {
          this.toastr.error('Please fill in all required fields.');
        }
      } else if (this.tranMode == 'R') {
        savePayload.isUpdate = true;
this.config.isLoading=true
        if (detailsList.length != 0) {
        this.http
          .request('put', api_url.updateDebitNoteEntry, savePayload, null)
          .subscribe(
            {
            next:(res: any) => {
            this.config.isLoading=false
            if (res.success == false) {
              this.toastr.error(res.message);
            } else {
              this.toastr.success(
                res.message ? res.message : 'Data update successfully.'
              );
              this.debitNote.get('dbnoteser')?.setValue(res.data);
              if (res.success == true) {
                this.toastr.success(
                  res.message
                    ? res.data
                    : 'Successfully updated Admin Debit Note#',
                  'Successfully updated Admin Debit Note#'
                );
                this.showConfirmation(
                  'K-Raheja ERP',
                  'Do you want to print Voucher details?(Y/N)',
                  'info',
                  true
                );
              }
            }
          },
          error:()=>{
            this.config.isLoading=false
          }
        }
          );
        this.initialMode = false;
        this.debitNote.reset();
        this.debitNote.enable();
        this.debitNoteDetails.reset();
        }else{
          this.toastr.error('Debit Notes item Details ammount not be zero');
        }

        this.commonService.enableDisableButtonsByIds(
          ['add', 'retrieve', 'exit'],
          this.buttonsList,
          false
        );
        this.commonService.enableDisableButtonsByIds(
          ['save', 'back'],
          this.buttonsList,
          true
        );
      }
    } else {
      this.showErroPopup();
    }
  }

  showErroPopup() {
    this.markFormGroupAndArrayAsTouched(this.debitNoteDetails);

    // Check if any form control is invalid
    if (this.debitNoteDetails.invalid) {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  markFormGroupAndArrayAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupAndArrayAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Get Report Print
  getPrint(print: boolean) {
    if (true) {
      if (this.service.printExcelChk(print, 'PDF')) {
        this.config.isLoading = true;
        let payload = {
          name: 'AdminDebitNoteVch.rpt',
          isPrint: false,
          seqId: 1,
          exportType: 'PDF',
          reportParameters: {
            formname: "'Admin Debit Note Voucher'",
            PrmDebitNoteNo:
              "'" +
              this.commonService.convertArryaToString(
                this.debitNote.get('dbnoteser')?.value
              ) +
              "'",
          },
        };

        this.commonReport
          .getParameterizedReport(payload)
          .subscribe((res: any) => {
            this.commonPdfReport(true, res);
          });
      }
    }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this.commonReport.getReportName();
    this.config.isLoading = false;
    this.service.exportReport(
      print,
      res,
      this.debitNoteDetails.get('exportType')?.value,
      filename
    );
  }

  replaceNullsWithEmptyStrings(obj: any): any {
    const updatedObj: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        updatedObj[key] = obj[key] === null ? '' : obj[key];
      }
    }

    return updatedObj;
  }

  // Reset debit note cancellation
  resetDebitNoteCancellation() {
    this.showConfirmation2(
      'K-Raheja ERP',
      'Data not saved. Do you want to exit?',
      'info',
      true
    );
  }

  onLeavePartyCode(val: string) {
    this.filter.getInvoice = "adblh_partycode='" + val + "'";
    if (
      this.debitNoteDetails.getRawValue().invbillno == '' ||
      this.debitNoteDetails.getRawValue().invbillno == undefined ||
      this.debitNoteDetails.getRawValue().invbillno == null
    ) {
      // this.setFocus('debit_invoice')
    }

    this.debitNoteDetails.patchValue({
      invbillno: '',
      serialNo: '',
      invbilldt: '',

      billtype: '',
      dnamount: '',
      bldgcode: '',
      bldgcodename: '',
      tdsperc: '',
      tdsamount: '',
      coy: '',
      coyname: '',
      fotoamt: '',
      description1: '',
      narration: '',
      // debitNoteItemDetailList: this.fb.array([]),
    });

    const formArray = this.debitNoteDetails.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    formArray.clear();
  }

  onLeavePartyType(val: string) {
    this.filter.getParPartyType = "par_partytype='" + val + "'";

    this.debitNoteDetails.patchValue({
      partycode: '',
      partycodename: '',
      invbillno: '',
      serialNo: '',
      invbilldt: '',

      billtype: '',
      dnamount: '',
      bldgcode: '',
      bldgcodename: '',
      tdsperc: '',
      tdsamount: '',
      coy: '',
      coyname: '',
      fotoamt: '',
      description1: '',
      narration: '',
    });

    const formArray = this.debitNoteDetails.get(
      'debitNoteItemDetailList'
    ) as FormArray;
    formArray.clear();
  }

  onLeaveInvoice(val: String) {
    this.filter.getBldg = "bldg_coy='" + val + "'";
    // this.setFocus('debit_dnamt');
  }

  // Check DN Amount
  calDnAmt(amount: Number) {
    const DNAmt =
      this.debitNoteDetails.value.taxableamt +
      this.debitNoteDetails.value.cgstamt +
      this.debitNoteDetails.value.sgstamt;
    this.debitNoteDetails.get('dnamount')?.setValue(DNAmt);
  }

  // TDS Amount Calculation
  calTDSAmt(percentage: Number) {
    const TDSAmt = Math.round(
      (this.debitNoteDetails.value.dnamount *
        this.debitNoteDetails.value.tdsperc) /
        100
        ? (this.debitNoteDetails.value.dnamount *
            this.debitNoteDetails.value.tdsperc) /
            100
        : 0
    );
    this.debitNoteDetails.get('tdsamount')?.setValue(TDSAmt);
  }

  onRateQuntityChange(item: any) {
    const qty = Number(item.get('quantity').value);
    const rate = Number(item.get('rate').value);

    const getAmt = qty * rate;
    item.get('amount')?.setValue(getAmt);
  }

  debitNoteDetailBreakupCal(item: any) {
    const qty = Number(item.get('quantity').value);
    const rate = Number(item.get('rate').value);
    const amt = Number(item.get('amount').value);
    const disAmt = Number(item.get('discountamt').value);
    const taxAmt = Number(item.get('taxableamt').value);
    const cgstPer = Number(item.get('cgstperc').value);
    const sgstPer = Number(item.get('sgstperc').value);
    const igstPer = Number(item.get('igstperc').value);
    const ugstPer = Number(item.get('ugstperc').value);

    const getAmt = qty * rate;

    const getTaxableAmt = amt - disAmt;
    item.get('taxableamt')?.setValue(getAmt);
    item.get('taxableamt')?.setValue(getTaxableAmt);

    // cgst, sgst, igst, ugst calculation
    const getCGSTAmt = (amt * cgstPer) / 100;
    const getSGSTAmt = (amt * sgstPer) / 100;
    const getIGSTAmt = (amt * igstPer) / 100;
    const getUGSTAmt = (amt * ugstPer) / 100;
    // cgst, sgst, igst, ugst calculation set value
    item.get('cgstamt')?.setValue(getCGSTAmt);
    item.get('sgstamt')?.setValue(getSGSTAmt);
    item.get('igstamt')?.setValue(getIGSTAmt);
    item.get('ugstamt')?.setValue(getUGSTAmt);
  }

  onLeaveRate() {
    if (
      this.debitNoteDetails.get('amount')?.value >
      this.debitNoteDetails.get('dnamount')?.value
    ) {
      this.showConfirmation3(
        'K-Raheja ERp',
        'Enter item amount less than or equal to debit note amount.',
        'error'
      );
    }
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
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
        this.getPrint(true);
      }
      this.config.isLoading = false;
      this.initialMode = false;
      this.debitNote.reset();
      this.debitNoteDetails.reset();
      this.debitNote.enable();
      this.setFocus('dabit_dabitnote');
      this.debitNote.get('debitNoteDate')?.setValue(new Date());
      this.debitNoteDetails.get('partytype')?.setValue('Z')
      this.debitNoteDetails.get('partytypename')?.setValue('Miscellaneous Party')
      this.debitNoteDetails.get('exportType')?.setValue('PDF');

      const groupArray = this.debitNoteDetails.get(
        'debitNoteItemDetailList'
      ) as FormArray;

      groupArray.clear();

      this.commonService.enableDisableButtonsByIds(
        ['add', 'retrieve', 'exit'],
        this.buttonsList,
        false
      );
      this.commonService.enableDisableButtonsByIds(
        ['delete', 'list', 'save', 'back'],
        this.buttonsList,
        true
      );
    });
  }

  // confirm dailog box
  showConfirmation2(
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
        this.initialMode = false;
        this.debitNote.reset();
        this.debitNoteDetails.reset();
        this.debitNote.enable();
        this.setFocus('dabit_dabitnote');
        this.debitNote.get('debitNoteDate')?.setValue(new Date());
        this.debitNoteDetails.patchValue({
          partytype: 'Z',
          partytypename: 'Miscellaneous Party',
        });

        const control = this.debitNote.get('dbnoteser');
        control?.setValidators(null);
        control?.updateValueAndValidity();
        const groupArray = this.debitNoteDetails.get(
          'debitNoteItemDetailList'
        ) as FormArray;

        groupArray.clear();

        this.commonService.enableDisableButtonsByIds(
          ['add', 'retrieve', 'exit'],
          this.buttonsList,
          false
        );
        this.commonService.enableDisableButtonsByIds(
          ['delete', 'list', 'save', 'back'],
          this.buttonsList,
          true
        );
      }
    });
  }

  showConfirmation3(titleVal: any, message: string, type: string) {
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
      this.setFocus('debitDate');
    });
  }
}
