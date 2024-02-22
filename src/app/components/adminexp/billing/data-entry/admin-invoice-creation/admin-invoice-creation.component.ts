import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ToastrService } from 'ngx-toastr';
import { api_url } from 'src/constants/constant';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-admin-invoice-creation',
  templateUrl: './admin-invoice-creation.component.html',
  styleUrls: ['./admin-invoice-creation.component.css'],
})
export class AdminInvoiceCreationComponent implements OnInit {
  invoiceCreation: FormGroup = this.fb.group(
    {
      invoiceType: ['A', Validators.required],
      subtitle: [true],
      coy: ['', Validators.required],
      coyname: [{ value: null, disabled: true }],
      partytype: ['', Validators.required],
      partycode: ['', Validators.required],
      partyname: [{ value: '', disabled: true }],
      bldgcode: [''],
      bldgname: [{ value: '', disabled: true }],
      invoicenum: [''],
      invdate: [new Date(), Validators.required],
      invfromdate: [''],
      invtodate: [''],
      invamt: [{ value: 0, disabled: true }],
      transerno: [''],
      remark: [''],
      modelno: [''],
      carno: [''],
      chasisno: [''],
      totalbaseamt: [{ value: '', disabled: true }],
      cgst: [{ value: '', disabled: true }],
      sgst: [{ value: '', disabled: true }],
      igst: [{ value: '', disabled: true }],
      ugst: [{ value: '', disabled: true }],
      totalamt: [{ value: '', disabled: true }],
      invoiceBreakupList: this.fb.array([]),
      actranser: [''],
      invhIrnno: [''],
    },
    { validator: this.invoiceDateVlidation }
  );

  config = {
    invoiceType: [
      { id: 'R', name: 'Regular' },
      { id: 'A', name: 'Ad-HOC' },
    ],
    isRegular: false,
    regularInvoiceList: [],
    isUpdate: false,
    isAccountPost: false,
    isLoading: false,
    invoiceTypePrint: 'O',
    invoiceTypeList: [
      { id: 'O', name: 'Original Copy' },
      { id: 'F', name: 'File Copy' },
    ],
    StrLocCompanyYn: 'Y',
  };

  filters: any = {
    getCoy: '',
    getBldg: '',
    partyCode: '',
    getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",
    getPartyType: '',
    getInvoice: '',
    getBgldCode: '',
    getSerialDefaultValue: " NVL(advn_status, '1') < '5'",
    getPartyName: '',
  };

  selectedRowIndex: number = -1; // Initialize to -1 to indicate no selection
  selectedItem: any;

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'delete',
    'address',
    'save',
    'accPost',
    'print',
    'back',
    'exit',
  ]);

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpRequestService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private _commonReport: CommonReportsService,
    public _service: ServiceService
  ) {}
  ngOnInit(): void {
    this.init();
    this.updateFromToDate();

    this.invoiceCreation.get('invoicenum')?.valueChanges.subscribe((res) => {
      if (res) {
        if (res.length != 0) {
          this.commonService.enableDisableButtonsByIds(
            ['add'],
            this.buttonsList,
            true
          );
        } else {
          this.commonService.enableDisableButtonsByIds(
            ['add'],
            this.buttonsList,
            false
          );
        }
      } else {
        this.commonService.enableDisableButtonsByIds(
          ['add'],
          this.buttonsList,
          false
        );
      }
    });
  }

  //initi valujes
  init() {
    this.commonService.enableDisableButtonsByIds(
      ['delete', 'address', 'save', 'accPost', 'list', 'print'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'back', 'exit', 'retrieve'],
      this.buttonsList,
      false
    );
  }

  buttonAction(event: string) {
    console.log('form value', this.invoiceCreation);

    if (event == 'add') {
      this.onAddClick();
    } else if (event == 'retrieve') {
      this.onRetriveClick();
    } else if (event == 'delete') {
    } else if (event == 'accPost') {
      this.config.isAccountPost = true;
      this.onSaveClick();
    } else if (event == 'reset') {
    } else if (event == 'print') {
      this.getStrLocCompanyYn();
      document.getElementById('printProcess')?.click();
    } else if (event == 'back') {
      this.resetData();
    } else if (event == 'exit') {
    } else if (event == 'save') {
      this.onSaveClick();
    }
  }
  ///////////////////////////////////////////
  // on click action buttons
  ///////////////////////////////////////////
  onAddClick() {
    this.config.isUpdate = false;
    const date = this.invoiceCreation.get('invdate');
    date?.setValidators(Validators.required);
    date?.updateValueAndValidity();

    if (this.invoiceCreation.valid) {
      this.addInvoiceBreakupList();
      this.invoiceCreation.get('invoicenum')?.disable();
      this.invoiceCreation.get('transerno')?.disable();

      this.commonService.enableDisableButtonsByIds(
        ['add', 'delete', 'address', 'list', 'retrieve', 'print'],
        this.buttonsList,
        true
      );
      this.commonService.enableDisableButtonsByIds(
        ['save', 'back', 'exit'],
        this.buttonsList,
        false
      );
    } else {
      this.showErroPopup();
    }
  }

  onSaveClick() {
    if (this.invoiceCreation.valid) {
      this.saveInvoiceCreation();
    } else {
      this.showErroPopup();
    }
  }

  onRetriveClick() {
    this.addInvoiceNumberValidationDynamicaly(true);
    const date = this.invoiceCreation.get('invdate');
    date?.clearValidators();
    date?.updateValueAndValidity();
    if (this.invoiceCreation.valid) {
      this.getInvoiceDetails();
    } else {
      this.showErroPopup();
    }
  }

  getStrLocCompanyYn() {
    let parms = {
      invoiceNum: this.commonService.convertArryaToString(
        this.invoiceCreation.get('invoicenum')?.value
      ),
    };
    this.http
      .request('get', api_url.fetchPartyCodeExist, null, parms)
      .subscribe((res: any) => {
        if (res.success) {
          this.config.StrLocCompanyYn = res.data ? 'Y' : 'N';
        } else {
          this.config.StrLocCompanyYn = 'N';
        }
      });
  }

  onPrintClick() {
    const invoiceBreakupList: FormArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;
    const modelNumber = this.invoiceCreation.getRawValue().modelno;
    const isAtLeastOneGstTrue = invoiceBreakupList.controls.some(
      (group: any) => group.get('gstyn').value == true
    );

    var rptName = '';
    if (isAtLeastOneGstTrue) {
      if (modelNumber) {
        rptName = 'EN_RP_InvoiceBill_vehical.rpt';
      } else {
        rptName = 'EN_RP_InvoiceBill.rpt';
      }
    } else {
      if (modelNumber) {
        rptName = 'EN_RP_VehicalBillOfSupply.rpt';
      } else {
        rptName = 'EN_RP_BillOfsupply.rpt';
      }
    }

    var HeaderText3 =
      this.config.invoiceTypePrint == 'O'
        ? 'Original for Recipient'
        : 'File Copy';

    var invoiceNumber = this.commonService.convertArryaToString(
      this.invoiceCreation.get('invoicenum')?.value
    );
    var partyType = this.commonService.convertArryaToString(
      this.invoiceCreation.get('partytype')?.value
    );

    var wherecondition = '';

    if (partyType == 'F') {
      wherecondition =
        " and trim(substr(invh_partycode,1,11)) = trim(address.adr_adowner) and address.adr_adsegment='PARTY' and address.adr_adtype='OUTG'";
    } else {
      wherecondition =
        " and trim(invh_partycode)= trim(address.adr_adowner) and address.adr_adsegment='PARTY' ";
    }

    let payload: any = {
      name: rptName,
      isPrint: false,
      seqId: 1,
      reportParameters: {
        formname: '',
        HeaderText3: HeaderText3,
        HeaderText1: this.config.StrLocCompanyYn,
        HeaderText2: this.commonService.convertArryaToString(this.invoiceCreation.get('coyname')?.value)?.trimEnd(),
        StrPrmInvoiceNo: invoiceNumber,
        StrwhereClause: wherecondition,
      },
    };

    if (
      !modelNumber &&
      (rptName == 'EN_RP_BillOfsupply.rpt' ||
        rptName == 'EN_RP_VehicalBillOfSupply.rpt')
    ) {
      delete payload.reportParameters.HeaderText1;
    }

    if (rptName == 'EN_RP_BillOfsupply.rpt') {
      delete payload.reportParameters.StrwhereClause;
      payload.reportParameters['StrLocwhereCluase'] = wherecondition;
    }

    if (modelNumber && rptName == 'EN_RP_InvoiceBill_vehical.rpt') {
      delete payload.reportParameters.StrwhereClause;
    }

    this.PrintReport(payload, true);
  }

  // print report from api
  PrintReport(payload: any, isPrint: boolean) {
    this._commonReport.getParameterizedReport(payload).subscribe({
      next: (res) => {
        if (res) {
          this.commonPdfReport(isPrint, res);
        }
      },
      error: (error) => {},
    });
  }

  // download the file
  commonPdfReport(print: Boolean, res: any) {
    let filename = this._commonReport.getReportName();
    this.getQRCode(print, res, filename);
    // this.commonService.insertPdfAtPositionForQR(res, res, 0, 400, 250).then((res) => {
    //   this._service.exportReport(print, res, 'PDF', filename);
    // });
    // this.commonService.insertImageIntoPDF(res, res, 0, 100, 200).then((res) => {
    //   this._service.exportReport(print, res, 'PDF', filename);
    // });

    // this._service.exportReport(print, res, 'PDF', filename);
  }

  // get QR code
  getQRCode(print: Boolean, firstBlob: any, filename: string) {
    let parms = {
      invoiceNo: this.invoiceCreation.getRawValue().invoicenum,
    };
    this.http
      .reportRequest('get', api_url.getQRCode, null, parms)
      .subscribe((res: any) => {
        if (res.size == 60) {
          this._service.exportReport(print, firstBlob, 'PDF', filename);
        } else {
          this.commonService
            .insertPdfAtPositionForQR(firstBlob, res, 0, 370, 270)
            .then((res) => {
              this._service.exportReport(print, res, 'PDF', filename);
            });
        }
      });
  }

  addInvoiceNumberValidationDynamicaly(state: boolean) {
    // Get the invoiceType control
    const invoiceTypeControl: AbstractControl | any =
      this.invoiceCreation.get('invoicenum');
    // Conditionally set or remove the "required" validation
    if (state) {
      invoiceTypeControl.setValidators(Validators.required);
    } else {
      invoiceTypeControl.clearValidators();
    }

    // Update the value and validity of the control
    invoiceTypeControl.updateValueAndValidity();
  }

  /////////////////////////////////////////////
  // error handling
  /////////////////////////////////////////////
  showErroPopup() {
    this.markFormGroupAndArrayAsTouched(this.invoiceCreation);

    // Check if any form control is invalid
    if (this.invoiceCreation.invalid) {
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

  // validation
  invoiceDateVlidation(control: any): { [key: string]: boolean } | null {
    // first  add validation
    const invdate = new Date(control.get('invdate')?.value);
    const invfromdate = new Date(control.get('invfromdate')?.value);
    const invtodate = new Date(control.get('invtodate')?.value);

    // Check if the month of invfromdate is different from the month of invdate
    // if (invfromdate.getMonth() !== invdate.getMonth() || invfromdate.getFullYear() !== invdate.getFullYear()) {
    //   return { 'invalidMonthInvFromDate': true };
    // }

    // Check if the month of invtodate is different from the month of invdate
    // if (invtodate.getMonth() !== invdate.getMonth() || invtodate.getFullYear() !== invdate.getFullYear()) {
    //   return { 'invalidMonthInvToDate': true };
    // }

    // Check if invtodate is less than invfromdate
    if (invtodate < invfromdate) {
      return { invalidDateOrder: true };
    }

    return null;
  }

  // Function to handle row selection
  selectRow(index: number, item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedRowIndex = index;
      this.selectedItem = item;
    } else {
      this.selectedItem = '';
      this.selectedRowIndex = -1;
    }
  }

  setValueFromTemplate() {
    if ((this, this.selectedItem)) {
      this.invoiceCreation.get('coy')?.setValue(this.selectedItem.companyCode);
      this.invoiceCreation
        .get('partytype')
        ?.setValue(this.selectedItem.partyCode);
      this.invoiceCreation
        .get('partycode')
        ?.setValue(this.selectedItem.partyType);
      this.invoiceCreation
        .get('partyname')
        ?.setValue(this.selectedItem.partyName);
      this.updateFromToDate();
      const yourFormArray = this.invoiceCreation.get(
        'invoiceBreakupList'
      ) as FormArray;
      yourFormArray.clear();
      this.addInvoiceBreakupList(this.selectedItem);
      this.invoiceCreation.get('invoicenum')?.disable();
      this.invoiceCreation.get('transerno')?.disable();

      const date = this.invoiceCreation.get('invdate');
      date?.setValidators(Validators.required);
      date?.updateValueAndValidity();

      this.commonService.enableDisableButtonsByIds(
        ['add', 'delete', 'address', 'list', 'retrieve', 'print'],
        this.buttonsList,
        true
      );
      this.commonService.enableDisableButtonsByIds(
        ['save', 'back', 'exit'],
        this.buttonsList,
        false
      );
    } else {
      this.toastr.error(
        'Please select a template from the existing regular templates table.'
      );
    }
  }

  setSerialNumber() {
    if (this.invoiceCreation.value?.coy) {
      this.filters.getCoy =
        "invh_coy='" +
        this.commonService.convertArryaToString(
          this.invoiceCreation.value?.coy
        ) +
        "'";
    }

    if (this.invoiceCreation.value?.bldgcode) {
      this.filters.getBgldCode =
        "invh_bldgcode='" +
        this.commonService.convertArryaToString(
          this.invoiceCreation.value?.bldgcode
        ) +
        "'";
    }
    if (this.invoiceCreation.value?.partycode) {
      this.filters.partyCode =
        "invh_partycode='" +
        this.commonService.convertArryaToString(
          this.invoiceCreation.value?.partycode
        ) +
        "'";
    }

    this.filters.getInvoice =
      (this.filters.getCoy ? this.filters.getCoy + ' AND ' : '') +
      (this.filters.partyCode ? this.filters.partyCode + ' AND ' : '') +
      (this.filters.getBgldCode ? this.filters.getBgldCode : '') +
      '';

    this.filters.getInvoice = this.removeLastAND(this.filters.getInvoice);

    this.invoiceCreation.value?.partytype
      ? (this.filters.getPartyName =
          "par_partytype='" +
          this.commonService.convertArryaToString(
            this.invoiceCreation.value?.partytype
          ) +
          "'")
      : '';
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
  // ///////////////////////////////
  // all cheque details form
  // ///////////////////////////////
  createInvoiceBreakupList(data?: any): FormGroup | any {

    return this.fb.group({
      billCode: [data ? data.billCode : '', Validators.required],
      billDesc: [data ? data.billDesc : '', Validators.required],
      acMajor: [data ? data.acMajor : '', Validators.required],
      minorType: [data ? data.minorType : ''],
      acMinor: [data ? data.acMinor : ''],
      gstyn: [data ? (data.gstyn == 'Y' ? true : false) : true],
      qty: [data ? data.qty : 1, Validators.required],
      rate: [data ? data.rate : 1, Validators.required],
      ammount: [data ? data.ammount : 0, Validators.required],
      hsnSac: [data ? data.hsnSac : ''],
      cgst: [data ? (data.cgst ? data.cgst : 0) : 9, Validators.required],
      cgstAmt: [{ value: 0, disabled: true }, Validators.required],
      sgst: [data ? (data.sgst ? data.sgst : 0) : 9, Validators.required],
      sgstAmt: [{ value: 0, disabled: true }, Validators.required],
      igst: [data ? (data.igst ? data.igst : 0) : 0, Validators.required],
      igstAmt: [{ value: 0, disabled: true }, Validators.required],
      ugst: [data ? (data.ugst ? data.ugst : 0) : 0, Validators.required],
      isUpdate: [this.config.isUpdate ? true : false, Validators.required],
      ugstAmt: [{ value: 0, disabled: true }, Validators.required],
      gstTotal: [data?.gstTotal ? data.gstTotal : 0, Validators.required],
      grandTotal: [data?.grandTotal ? data.grandTotal : 0, Validators.required],
    });
  }

  updateChangeDetection() {
    const array: any = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;

    const index = Number(array.length) - 1;
    const id = 'table_code' + index;

    array.controls.map((item: any) => {
      item.get('billCode').setValue(item.get('billCode').value);
      document.getElementById(id)?.focus();
      this.invoiceBreakupCalculation(item);
    });
  }

  addInvoiceBreakupList(data?: any) {
    const invoiceBreakupDetailsArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;

    invoiceBreakupDetailsArray.push(this.createInvoiceBreakupList(data));

    setTimeout(() => {
      this.updateChangeDetection();
    }, 0);
  }

  removeInvoiceBreakupList(index: number, item: any) {
    const invoiceBreakupDetailsArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;
    invoiceBreakupDetailsArray.removeAt(index);

    this.invoiceBreakupCalculation(item);
  }

  resetData() {
    this.invoiceCreation.reset();

    const yourFormArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;
    yourFormArray.clear();

    this.filters = {
      getCoy: '',
      getBldg: '',
      partyCode: '',
      getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",
      getPartyType: '',
      getInvoice: '',
      getBgldCode: '',
      getSerialDefaultValue: " NVL(advn_status, '1') < '5'",
      getPartyName: '',
    };

    this.config.isUpdate = false;
    this.config.isRegular = false;

    this.commonService.enableDisableButtonsByIds(
      ['delete', 'address', 'save', 'accPost', 'list', 'print'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'back', 'exit', 'retrieve'],
      this.buttonsList,
      false
    );

    this.disableAllControls(this.invoiceCreation, false);

    this.invoiceCreation.get('coyname')?.disable();
    this.invoiceCreation.get('partyname')?.disable();
    this.invoiceCreation.get('bldgname')?.disable();
    this.invoiceCreation.get('invamt')?.disable();
    this.invoiceCreation.get('totalbaseamt')?.disable();
    this.invoiceCreation.get('cgst')?.disable();
    this.invoiceCreation.get('sgst')?.disable();
    this.invoiceCreation.get('igst')?.disable();
    this.invoiceCreation.get('ugst')?.disable();
    this.invoiceCreation.get('totalamt')?.disable();

    this.addInvoiceNumberValidationDynamicaly(false);

    this.invoiceCreation.patchValue({
      invoiceType: 'A',
      // invdate: new Date(),
    });

    // this.updateFromToDate();
  }

  /// invoice type change event
  invoiceTypeChange(val: string) {
    this.selectedRowIndex - 1;
    if (val == 'R') {
      this.config.isRegular = true;
      this.getInvoiceFormates();
      this.commonService.enableDisableButtonsByIds(
        ['add'],
        this.buttonsList,
        true
      );
    } else {
      this.resetData();
      this.config.isRegular = false;
      this.commonService.enableDisableButtonsByIds(
        ['add'],
        this.buttonsList,
        false
      );
    }

    this.commonService.enableDisableButtonsByIds(
      ['save'],
      this.buttonsList,
      true
    );
  }

  // get regular invoice formate details
  getInvoiceFormates() {
    this.http
      .request('get', api_url.getRegularInvocieFormate, null, null)
      .subscribe((res: any) => {
        this.config.regularInvoiceList = res.data;
      });
  }

  // get single invoice details
  getInvoiceDetails() {
    const invoiceBreakupList: FormArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;

    invoiceBreakupList.clear();

    this.config.isLoading = true;
    let parms = {
      invoiceNum: this.invoiceCreation.get('invoicenum')?.value,
    };

    if (this.invoiceCreation.valid) {
      this.http
        .request('get', api_url.getInvoiceDetails, null, parms)
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.filters.getPartyName =
                "par_partytype='" + res.data.invoiceheader.invhPartytype + "'";

              this.invoiceCreation.patchValue({
                invoiceType: res.data.invoiceheader.invhBilltype,
                coy: res.data.invoiceheader.invhCoy,
                partytype: res.data.invoiceheader.invhPartytype,
                subtitle:
                  res.data.invoiceheader.invhSubtitle == 'Y' ? true : false,
                partycode: res.data.invoiceheader.invhPartycode,
                bldgcode: res.data.invoiceheader.invhBldgcode,
                invfromdate: res.data.invoiceheader.invhPeriodfrom,
                invtodate: res.data.invoiceheader.invhPeriodto,
                invdate: res.data.invoiceheader.invhTrandate,
                transerno: res.data.invoiceheader.invhActranser,
                invamt: res.data.invoiceheader.invhTranamt,
                remark: res.data.invoiceheader.invhRemarks,
                modelno: res.data.invoiceheader.invhModel,
                carno: res.data.invoiceheader.invhCarno,
                chasisno: res.data.invoiceheader.invhChasisno,
              });

              res.data.invoiceDetail.map((item: any) => {
                let data = {
                  billCode: item.invoicedetailCK.invdCode,
                  billDesc: item.invoicedetailCK.invdNarration,
                  acMajor: item.invdAcmajor ? item.invdAcmajor : '',
                  minorType: item.invdMinortype ? item.invdMinortype : '',
                  acMinor: item.invdAcminor ? item.invdAcminor : '',
                  gstyn: item.invdGstyn,
                  qty: item.invdQuantity,
                  rate: item.invdRate,
                  hsnSac: item.invdHsncode ? item.invdHsncode : '',
                  cgst: item.invdCgstper,
                  cgstAmt: item.invdCgstpayable,
                  sgst: item.invdSgstper,
                  sgstAmt: item.invdSgstpayable,
                  igst: item.invdIgstper,
                  igstAmt: item.invdIgstpayable,
                  ugst: item.invdUgstper,
                  ugstAmt: item.invdUgstpayable,
                  // gstTotal: item.invdTranamtgstpayable,
                  grandTotal: item.invdTranamtgstpayable,
                };

                this.addInvoiceBreakupList(data);
              });

              this.config.isUpdate = true;
              this.getCalculationOfInoviceDetaials();

              this.commonService.enableDisableButtonsByIds(
                ['accPost', 'save', 'print'],
                this.buttonsList,
                false
              );
              this.commonService.enableDisableButtonsByIds(
                ['add', 'delete', 'address', 'list', 'retrieve'],
                this.buttonsList,
                true
              );

              this.config.isLoading = false;
              res.data.invoiceheader.invhPostedyn == 'Y'
                ? this.isAccountPostedPopup()
                : '';
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
      this.toastr.error('Invoice number should be entered');
    }
  }

  isAccountPostedPopup() {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: 'Can not modify invoice. Invoice already posted.',
        template: '',
        type: 'info',
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      this.disableAllControls(this.invoiceCreation, true);

      this.commonService.enableDisableButtonsByIds(
        [
          'delete',
          'address',
          'save',
          'accPost',
          'list',
          'add',
          'back',
          'exit',
          'retrieve',
        ],
        this.buttonsList,
        true
      );
      this.commonService.enableDisableButtonsByIds(
        ['back', 'exit', 'print'],
        this.buttonsList,
        false
      );
    });
  }

  // disabled all field
  disableAllControls(
    formGroup: FormGroup | FormArray,
    isDisable: boolean
  ): void {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.disableAllControls(control, true);
      } else {
        isDisable ? control?.disable() : control?.enable();
      }
    });
  }

  getCalculationOfInoviceDetaials() {
    const formArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;
    let total = 0;
    formArray.controls.forEach((control) => {
      this.invoiceBreakupCalculation(control);
    });
  }

  // leave event
  updateFromToDate() {
    const invdateValue = this.invoiceCreation.get('invdate')?.value;
    // Convert the string values to Date objects
    const invdate = new Date(invdateValue);
    const invtodate = new Date(invdateValue);

    if (!isNaN(invdate.getTime()) && !isNaN(invtodate.getTime())) {
      // Calculate first and last dates of the month for invdate and invtodate
      const firstDateOfMonth = new Date(
        invdate.getFullYear(),
        invdate.getMonth(),
        1
      );
      const lastDateOfMonth = new Date(
        invtodate.getFullYear(),
        invtodate.getMonth() + 1,
        0
      );

      // Update invfromdate and invtodate values in the form
      this.invoiceCreation.patchValue({
        invfromdate: firstDateOfMonth,
        invtodate: lastDateOfMonth,
      });
    }
  }

  invoiceBreakupCalculation(item: any, fieldName?: string) {
    // when make SGST/CGST Per zero then amount should be zero

    if (fieldName == 'cgst') {
      if (
        Number(item.get('cgst')?.value) == 0 &&
        Number(item.get('sgst')?.value) != 0
      ) {
        item.get('sgst').setValue(0);
        item.get('sgstAmt').setValue(0);
      }

      if (Number(item.get('cgst')?.value) == 9) {
        item.get('sgst').setValue(9);
      }
    } else if (fieldName == 'sgst') {
      if (
        Number(item.get('cgst')?.value) != 0 &&
        Number(item.get('sgst')?.value) == 0
      ) {
        item.get('cgst').setValue(0);
        item.get('cgstAmt').setValue(0);
      }
      if (Number(item.get('sgst')?.value) == 9) {
        item.get('cgst').setValue(9);
      }
    }

    // diable igst and ugst
    if (
      Number(item.get('cgst').value) != 0 ||
      Number(item.get('sgst').value) != 0
    ) {
      item.get('igst')?.setValue(0);
      item.get('igst')?.disable();
      item.get('ugst')?.setValue(0);
      item.get('ugst')?.disable();
    } else {
      item.get('igst')?.enable();
      item.get('ugst')?.enable();
    }

    const qty = item.get('qty').value;
    const rate = item.get('rate').value;
    const ammount = qty * rate;
    item.get('ammount').setValue(ammount);

    const cgst = item.get('cgst').value;
    const sgst = item.get('sgst').value;
    const igst = item.get('igst').value;
    const ugst = item.get('ugst').value;

    const cgstAmt = (cgst / 100) * ammount;
    const sgstAmt = (sgst / 100) * ammount;
    const igstAmt = (igst / 100) * ammount;
    const ugstAmt = (ugst / 100) * ammount;

    item.get('cgstAmt').setValue(cgstAmt.toFixed(2));
    item.get('sgstAmt').setValue(sgstAmt.toFixed(2));
    item.get('igstAmt').setValue(igstAmt.toFixed(2));
    item.get('ugstAmt').setValue(ugstAmt.toFixed(2));

    const grandToatl =
      Number(item.get('cgstAmt').value) +
      Number(item.get('sgstAmt').value) +
      Number(item.get('igstAmt').value) +
      Number(item.get('ugstAmt').value) +
      Number(ammount);
    const gstTotal =
      Number(item.get('cgstAmt').value) +
      Number(item.get('sgstAmt').value) +
      Number(item.get('igstAmt').value) +
      Number(item.get('ugstAmt').value);

    item.get('grandTotal').setValue(grandToatl.toFixed(2));
    item.get('gstTotal').setValue(gstTotal.toFixed(2));

    // grand total for all column
    this.invoiceCreation
      .get('totalbaseamt')
      ?.setValue(this.calculateTotalAmmount('ammount'));
    this.invoiceCreation
      .get('invamt')
      ?.setValue(this.calculateTotalAmmount('grandTotal'));
    this.invoiceCreation
      .get('cgst')
      ?.setValue(this.calculateTotalAmmount('cgstAmt'));
    this.invoiceCreation
      .get('sgst')
      ?.setValue(this.calculateTotalAmmount('sgstAmt'));
    this.invoiceCreation
      .get('igst')
      ?.setValue(this.calculateTotalAmmount('igstAmt'));
    this.invoiceCreation
      .get('ugst')
      ?.setValue(this.calculateTotalAmmount('ugstAmt'));
    this.invoiceCreation
      .get('totalamt')
      ?.setValue(this.calculateTotalAmmount('grandTotal'));
  }

  calculateTotalAmmount(fieldName: string): any {
    const formArray = this.invoiceCreation.get(
      'invoiceBreakupList'
    ) as FormArray;
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

  // gstn change true flase event change
  onGSTYNCheckboxChange(item: any, event: any) {
    if (event.target.checked) {
      item.get('cgst').setValue(9);
      item.get('sgst').setValue(9);
      item.get('igst').setValue(0);
      item.get('ugst').setValue(0);

      item.get('cgst').enable();
      item.get('sgst').enable();
      item.get('ugst').enable();
      item.get('igst').enable();
      item.get('gstTotal').enable();
    } else {
      item.get('cgst').setValue(0);
      item.get('sgst').setValue(0);
      item.get('igst').setValue(0);
      item.get('ugst').setValue(0);

      item.get('cgst').disable();
      item.get('sgst').disable();
      item.get('ugst').disable();
      item.get('igst').disable();
      item.get('gstTotal').disable();
    }
    this.invoiceBreakupCalculation(item);
  }

  // save the record or create invoice creation
  saveInvoiceCreation() {
    const data = this.invoiceCreation.getRawValue();

    const detailsData = data.invoiceBreakupList.map((item: any, index: any) => {

      let obj = {
        acmajor: item.acMajor
          ? this.commonService.convertArryaToString(item.acMajor)?.trimEnd()
          : '',
        acminor: item.acMinor
          ? this.commonService.convertArryaToString(item.acMinor)?.trimEnd()
          : '',
        cgstpayable: item.cgstAmt,
        cgstper: item.cgst,
        code: item.billCode
          ? this.commonService.convertArryaToString(item.billCode)?.trimEnd()
          : '',
        gstyn: item.gstyn ? 'Y' : 'N',
        hsncode: item.hsnSac
          ? this.commonService.convertArryaToString(item.hsnSac)?.trimEnd()
          : '',
        igstpayable: item.igstAmt,
        igstper: item.igst,
        invoiceno: data.invoicenum
          ? this.commonService.convertArryaToString(data.invoicenum)
          : '',
        minortype: item.minorType
          ? this.commonService.convertArryaToString(item.minorType)?.trimEnd()
          : '',
        narration: item.billDesc
          ? this.commonService.convertArryaToString(item.billDesc)?.trimEnd()
          : '',
        origsite: '',
        quantity: item.qty,
        rate: item.rate,
        sgstpayable: item.sgstAmt,
        sgstper: item.sgst,
        site: '',
        srno: index + 1,
        today: '', // Example date and time format
        tranamtgstpayable: item.ammount,
        // tranamtgstpayable: item.gstTotal,
        trtype: 'P',
        ugstpayable: item.ugstAmt,
        ugstper: item.ugst,
        userid: '',
        isUpdate: item.isUpdate ? item.isUpdate : false,
      };

      return obj;
    });

    let payload = {
      isUpdate: this.config.isUpdate ? 'Y' : 'N',
      invoiceheaderRequestBean: {
        actranser: data.actranser ? data.actranser : '',
        billtype: data.invoiceType,
        bldgcode: data.bldgcode
          ? this.commonService.convertArryaToString(data.bldgcode)?.trimEnd()
          : '',
        carno: data.carno ? data.carno : '',
        chasisno: data.chasisno ? data.chasisno : '',
        coy: this.commonService.convertArryaToString(data.coy)?.trimEnd(),
        invoiceno: data.invoicenum
          ? this.commonService.convertArryaToString(data.invoicenum)
          : '',
        irnno: data.irnno ? data.irnno : '',
        model: data.modelno,
        origsite: '',
        partycode: this.commonService
          .convertArryaToString(data.partycode)
          ?.trimEnd(),
        partytype: this.commonService
          .convertArryaToString(data.partytype)
          ?.trimEnd(),
        periodfrom: data.invfromdate
          ? moment(data.invfromdate).format('YYYY-MM-DD')
          : '',
        periodto: data.invtodate
          ? moment(data.invtodate).format('YYYY-MM-DD')
          : '',
        postedyn: 'N',
        remarks: data.remark ? data.remark : '',
        site: '',
        subtitle: data ? 'Y' : 'N',
        today: '', // Example date and time format
        tranamt: data.invamt,
        trandate: data.invdate ? moment(data.invdate).format('YYYY-MM-DD') : '', // Example date format
        userid: '',
        isUpdate: this.config.isUpdate,
      },

      invoicedetailRequestBean: detailsData,
    };

    if (this.config.isUpdate && !this.config.isAccountPost) {
      this.config.isLoading = true;
      this.http.request('put', api_url.updateInvoice, payload, null).subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (res.success) {
            this.showSucessMessage(res, 'update');
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => {
          this.config.isLoading = false;
        },
      });
    } else if (this.config.isAccountPost) {
      const dialogRef = this.dialog.open(ModalComponent, {
        disableClose: true,
        data: {
          isF1Pressed: false,
          title: 'K-Raheja ERP',
          message: 'Do you wan to post this entry to Accounts ?',
          template: '',
          type: 'info',
          confirmationDialog: true,
        },
      });
      dialogRef.afterOpened().subscribe(() => {});
      dialogRef.afterClosed().subscribe((result: any) => {
        this.config.isLoading = true;
        if (result) {
          this.http
            .request('post', api_url.accountPostInvoice, payload, null)
            .subscribe({
              next: (res: any) => {
                this.config.isLoading = false;
                if (res.success) {
                  this.showSucessMessage(res, 'posted');
                } else {
                  this.toastr.error(res.message);
                }
              },
              error: () => {
                this.config.isLoading = false;
              },
            });
        } else {
          this.config.isLoading = false;
        }
      });
    } else {
      this.config.isLoading = true;
      this.http.request('post', api_url.addInvoice, payload, null).subscribe({
        next: (res: any) => {
          this.config.isLoading = false;
          if (res.success) {
            this.showSucessMessage(res, 'saved');
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

  showSucessMessage(data: any, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: 'K-Raheja ERP',
        message: `Data ${type} succesfully into Invoice no -` + data.data,
        template: '',
        type: 'info',
      },
    });
    dialogRef.afterOpened().subscribe(() => {});
    dialogRef.afterClosed().subscribe((result: any) => {
      this.resetData();

      this.invoiceCreation.patchValue({
        invoicenum: data.data,
      });

      this.config.isUpdate = false;
      this.config.isAccountPost = false;
    });
  }
}
