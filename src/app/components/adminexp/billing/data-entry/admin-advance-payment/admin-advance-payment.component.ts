import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
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
import { Print } from '@syncfusion/ej2-angular-grids';
import { config, filter, finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-advance-payment',
  templateUrl: './admin-advance-payment.component.html',
  styleUrls: ['./admin-advance-payment.component.css'],
})
export class AdminAdvancePaymentComponent implements OnInit {
  initialMode: Boolean = false; // use for form hide and show
  // isEditMode: boolean = false; // use for edit and save data
  maxDate = new Date(); // use for future date disabled
  isBackClicked: boolean = false; // use for back button
  tranMode: String = '';
  loaderToggle: boolean = false; // use for loader
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`; // use for party type filter

  config: any = {
    isLoading: false,
    url: '',
    isAdvancePaasing: false,
    currentDate: new Date(),
    isSaveClick: false
  };
  filters: any = {
    getCoy: '',
    getBldg: '',
    partyCode: '',
    getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",
    getPartyType: '',
    getSerial: '',
    getBgldCode: '',
    getSerialDefaultValue: " NVL(advn_status, '1') < '5'",

    getParPartyType: ''
  };

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'add',
    'retrieve',
    'save',
    'reset',
    'back',
    'exit',
  ]);
  renderer: any;

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
  ) { }

  // admin form validation start
  adminAdvancePaymentform: FormGroup = this.fb.group({
    coy: ['', Validators.required],
    partytype: ['Z', Validators.required],
    partycode: ['', Validators.required],
    partyname: [{ value: '', disabled: true }],
    bldgcode: ['', Validators.required],
    bldgname: [{ value: '', disabled: true }],
    pinvno: ['', Validators.required],
    ser: [''],
  });
  // admin form validation end

  // add admin advance payment form validation start
  addAdminAdvancePaymentForm: FormGroup = this.fb.group({
    exportType: ['PDF'],
    pinvdate: ['', Validators.required],
    orderby: [''],
    advanceamt: ['', Validators.required],
    basicamt: ['', Validators.required],
    gstperc: [],
    gstamt: [{ value: '', disabled: true }],
    tdsacmajor: [''],
    tdsperc: [],
    tdsamount: [{ value: 0, disabled: true }],
    fotoamount: [''],
    date: [new Date(), Validators.required],
    narration: [''],
  });
  // add admin advance payment form validation end

  ngOnInit(): void {
    this.init();
    this.addAdminAdvancePaymentForm.get('date')?.setValue(new Date())
  }

  init() {
    this.config.url =
      this.router.url.split('/')[this.router.url.split('/').length - 1];

    this.config.url.includes('adminadvancepaymentpassing')
      ? (this.config.isAdvancePaasing = true)
      : (this.config.isAdvancePaasing = false);
    //disabled default buttons
    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
  }

  buttonAction(event: string) {
    if (event == 'add') {
      this.addAdvancePayment();
    } else if (event == 'retrieve') {
      this.fetchData();
    } else if (event == 'save') {
      this.config.isSave = true
      this.config.isAdvancePaasing ? this.saveData() : this.validateData(true);
    } else if (event == 'print') {
      this.getPrint(true);
    } else if (event == 'reset') {
      // this.tranMode == 'R'?this.initialMode = true:  this.initialMode = false;
      // this.tranMode == 'R' ? '' : this.adminAdvancePaymentform.reset();
      this.adminAdvancePaymentform.reset();
      this.filters.getSerial = ''

      for (const key in this.filters) {
        if (this.filters.hasOwnProperty(key)) {
          if (key != 'getPartyCodeUsingPartyType' && key != 'getSerialDefaultValue')
            this.filters[key] = null; // You can use undefined or '' (empty string) as well
        }
      }
      var inputElement: any = document.getElementById('advn_coy');
      inputElement.focus();
    } else if (event == 'back') {
      this.resetForm();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  //  on action buttons click methods
  addAdvancePayment() {
    if (this.adminAdvancePaymentform.valid) {
      this.tranMode = 'A';
      this.initialMode = true;
      // this.serialFilter(this.adminAdvancePaymentform.value)
      this.adminAdvancePaymentform.disable();

      // hide show buttons
      this.commonService.enableDisableButtonsByIds(
        ['add', 'retrieve', 'reset', 'exit'],
        this.buttonsList,
        true
      );
      this.commonService.enableDisableButtonsByIds(
        ['save', 'back'],
        this.buttonsList,
        false
      );
    } else {
      // this.toastr.error("Please fill in all the mandatory feild.");
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'Please fill the mandatory field/s.',
        'error'
      );
    }
  }

  // fetching data from db
  fetchData() {
    this.adminAdvancePaymentform.get('coy')?.clearValidators;
    this.adminAdvancePaymentform.get('coy')?.updateValueAndValidity;
    this.adminAdvancePaymentform.get('partytype')?.clearValidators;
    this.adminAdvancePaymentform.get('partytype')?.updateValueAndValidity;
    this.adminAdvancePaymentform.get('partycode')?.clearValidators;
    this.adminAdvancePaymentform.get('partycode')?.updateValueAndValidity;
    this.adminAdvancePaymentform.get('bldgcode')?.clearValidators;
    this.adminAdvancePaymentform.get('bldgcode')?.updateValueAndValidity;
    this.adminAdvancePaymentform.get('pinvno')?.clearValidators;
    this.adminAdvancePaymentform.get('pinvno')?.updateValueAndValidity;

    let getSerPayload = {
      ser: this.adminAdvancePaymentform.get('ser')?.value,
    };

    if (this.adminAdvancePaymentform.invalid) {
      let serialNo = this.adminAdvancePaymentform
        .get('ser')
        ?.value[0]?.[0]?.trim();

      if (serialNo != null) {
        this.http
          .request(
            'get',
            api_url.getAdminAdvancePayment +
            '?ser=' +
            this.adminAdvancePaymentform.value.ser,
            getSerPayload,
            null
          )
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              if (res.success == true) {
                this.initialMode = true;

                this.tranMode = 'R';

                this.onLeaveCompany(res.data.coy);
                this.onLeavePartyCode(res.data.partycode);
                this.onLeaveBldgCode(res.data.bldgcode);

                // patch value
                this.adminAdvancePaymentform.patchValue({
                  coy: res.data.coy,
                  partytype: res.data.partytype,
                  partycode: res.data.partycode,
                  bldgcode: res.data.bldgcode,
                  pinvno: res.data.pinvno,
                });

                this.addAdminAdvancePaymentForm.patchValue({
                  pinvdate: res.data.pinvdate,
                  orderby: res.data.orderby,
                  advanceamt: res.data.advanceamt,
                  basicamt: res.data.basicamt,
                  gstperc: res.data.gstperc,
                  gstamt: res.data.gstamt,
                  tdsacmajor: res.data.tdsacmajor,
                  tdsperc: res.data.tdsperc,
                  tdsamount: res.data.tdsamount,
                  fotoamount: res.data.fotoamount,
                  date: res.data.date,
                  narration: res.data.narration,
                });
                this.adminAdvancePaymentform.disable();
                this.toastr.success(
                  res.message ? res.message : 'Data fetched successfully',
                  'Data fetched'
                );

                this.commonService.enableDisableButtonsByIds(
                  ['save', 'back'],
                  this.buttonsList,
                  false
                );
                this.commonService.enableDisableButtonsByIds(
                  ['add', 'retrieve', 'reset', 'exit'],
                  this.buttonsList,
                  true
                );
              } else {
                this.showErrorFieldDialog(
                  'K-Raheja ERP',
                  "You can't modify this bill. This bill is already passed / paid.",
                  'error'
                );
                // this.toastr.error(
                //   res.message
                //     ? res.message
                //     : "You can't modify this bill. This bill is already passed/paid.",
                //   'Data not fetched.'
                // ),

                this.initialMode = false;
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
            },
          });
      } else {
        this.showErrorFieldDialog('K-Raheja ERP', 'Enter Serial No.', 'error');
      }
    }
    if (this.config.isAdvancePaasing) {
      this.addAdminAdvancePaymentForm.disable();
    }
  }

  // validate data
  validateData(isSave: boolean) {

    if (this.addAdminAdvancePaymentForm.valid) {

      const advanAmt = Number(this.addAdminAdvancePaymentForm.value.advanceamt);
      const basicamt = Number(this.addAdminAdvancePaymentForm.value.basicamt);
      const gstamt = Number(this.addAdminAdvancePaymentForm.get('gstamt')?.value);

      const isValidAmt = basicamt + gstamt === advanAmt ? true : false;

      const remainingAmt = (advanAmt) - (basicamt + gstamt);

      if (!isValidAmt) {
        this.addAdminAdvancePaymentForm.get('fotoamount')?.setValue(remainingAmt);

        if (remainingAmt <= 10 && remainingAmt >= -10) {
          this.showConfirmationIfValueIsNearTen("Admin Advance Payment", "There is difference between AdvanceAmt and BasicAmt including GST. Do you want to continue?", "info", true);
          // this.showConfirmation('Admin Advance Payment', 'There is difference between AdvanceAmt and BasicAmt including GST. Do you want to continue?', 'info', true );
        } else {
          this.modalService.showErrorDialog(
            'Admin Advance Payment',
            'There is difference between AdvanceAmt and BasicAmt including GST.',
            'error'
          );
        }
      }
      else {
        this.addAdminAdvancePaymentForm.get('fotoamount')?.setValue(0);
        isSave ? this.saveData() : '';
      }
    }
  }

  // on leave gst firel
  // GST Calculation
  onLeaveGST(percentage: Number) {

    const gstAmount =
      (this.addAdminAdvancePaymentForm.value.basicamt / 100) *
      Number(percentage);


    this.addAdminAdvancePaymentForm.get('gstamt')?.setValue(gstAmount);

    this.validateData(false);
  }

  // TDS Calculation
  onLeaveTDS(percentage: number) {

    if (this.addAdminAdvancePaymentForm.value.tdsacmajor === '') {
      this.modalService.showErrorDialog(
        'Admin Advance Payment',
        'TDS ACmajor not selected.',
        'error'
      );
    } else {
      const tdsAmt =
        (this.addAdminAdvancePaymentForm.value.basicamt / 100) *
        Number(percentage);


      this.addAdminAdvancePaymentForm.get('tdsamount')?.setValue(tdsAmt);
    }
  }

  // save and update api functionality
  saveData() {
    let payload = {
      coy: this.commonService.convertArryaToString(
        this.adminAdvancePaymentform.get('coy')?.value[0]?.[0].trim()
      ),
      partytype: this.commonService.convertArryaToString(
        this.adminAdvancePaymentform.get('partytype')?.value[0]?.[0].trim()
      ),
      partycode: this.commonService.convertArryaToString(
        this.adminAdvancePaymentform.get('partycode')?.value[0]?.[0].trim()
      ),
      bldgcode: this.commonService.convertArryaToString(
        this.adminAdvancePaymentform.get('bldgcode')?.value
      ),
      pinvno: this.commonService.convertArryaToString(
        this.adminAdvancePaymentform.get('pinvno')?.value
      ),
      ser:
        this.tranMode == 'A'
          ? ''
          : this.commonService.convertArryaToString(
            this.adminAdvancePaymentform.get('ser')?.value
          ),
      pinvdate: moment(this.addAdminAdvancePaymentForm.get('pinvdate')?.value).format('YYYY-MM-DD'),
      orderby: this.commonService.convertArryaToString(
        this.addAdminAdvancePaymentForm.get('orderby')?.value
      ),
      advanceamt: this.addAdminAdvancePaymentForm.get('advanceamt')?.value,
      basicamt: this.addAdminAdvancePaymentForm.get('basicamt')?.value,
      gstperc: this.addAdminAdvancePaymentForm.get('gstperc')?.value,
      gstamt: this.addAdminAdvancePaymentForm.get('gstamt')?.value,
      tdsacmajor: this.commonService.convertArryaToString(
        this.addAdminAdvancePaymentForm.get('tdsacmajor')?.value
      ),
      tdsperc: this.addAdminAdvancePaymentForm.get('tdsperc')?.value,
      tdsamount: this.addAdminAdvancePaymentForm.get('tdsamount')?.value,
      fotoamount: this.addAdminAdvancePaymentForm.get('fotoamount')?.value,
      date: this.addAdminAdvancePaymentForm.get('date')?.value,
      narration: this.addAdminAdvancePaymentForm.get('narration')?.value,
      actranser: '',
      origsite: sessionStorage.getItem('site'),
      paidamount: this.addAdminAdvancePaymentForm.get('advanceamt')?.value,
      paiddate: '',
      passedon: '',
      paidref: '',
      project: '',
      site: sessionStorage.getItem('site'),
      status: '',
      today: new Date(),
      userid: sessionStorage.getItem('userName'),
    };
    console.log("this.config.isAdvancePaasing", this.config.isAdvancePaasing);

    // advance payment
    if (this.config.isAdvancePaasing) {
      let parms = {
        serNumber: this.adminAdvancePaymentform.get('ser')?.value,
      };

      this.http
        .request('post', api_url.AdminAdvancePaymentPassing, null, parms)
        .subscribe((res: any) => {
        });
    } else {
      // save api
      if (this.tranMode == 'A') {
        this.http
          .request('post', api_url.createAdminAdvancePayment, payload, null)
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.toastr.success(
                res.message ? res.message : 'Data saved successfully',
                'Data saved'
              );
              this.adminAdvancePaymentform.get('ser')?.setValue(res.data);
              if (res.success == true) {
                this.showConfirmation(
                  'K-Raheja ERP',
                  'Do you want to print Voucher details?(Y/N)',
                  'info',
                  true
                );
              }
            },
          });
      }
      // update api
      else if (this.tranMode == 'R') {
        this.http
          .request('put', api_url.updateAdminAdvancePayment, payload, null)
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.toastr.success(
                res.message ? res.message : 'Transaction saved successfully',
                'Update Status'
              );
              if (res.success == true) {
                this.showConfirmation(
                  'K-Raheja ERP',
                  'Do you want to print Voucher details?(Y/N)',
                  'info',
                  true
                );
              }
            },
          });
      } else {
        this.toastr.error('Please fill the mandatory field/s.');
      }
    }
  }

  // get print report
  getPrint(print: boolean) {


    if (true) {
      if (this.service.printExcelChk(print, 'PDF')) {

        this.config.isLoading = true;
        let payload = {
          name: 'AdminAdvancePayment.rpt',
          isPrint: false,
          seqId: 1,
          exportType: 'PDF',
          reportParameters: {
            formname: "'Admin Advance Payment Voucher'",
            prmBillNum:
              "'" +
              this.commonService.convertArryaToString(
                this.adminAdvancePaymentform.get('ser')?.value
              ) +
              "'",
          },
        };

        this.commonReport
          .getParameterizedReport(payload)
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              this.commonPdfReport(true, res);
            },
          });
      }
    }
    //  else {
    //   this.config.isLoading = false;
    //   this.adminAdvancePaymentform.markAllAsTouched();
    // }
  }

  commonPdfReport(print: Boolean, res: any) {
    let filename = this.commonReport.getReportName();
    this.config.isLoading = false;
    this.service.exportReport(
      print,
      res,
      this.addAdminAdvancePaymentForm.get('exportType')?.value,
      filename
    );
  }

  back() {
    this.isBackClicked = false;
    this.initialMode = false;
    this.adminAdvancePaymentform.reset();
    this.adminAdvancePaymentform.enable();
    this.addAdminAdvancePaymentForm.reset();

    this.adminAdvancePaymentform.get('partyname')?.disable();
    this.adminAdvancePaymentform.get('bldgname')?.disable();
    var inputElement: any = document.getElementById('advn_coy');
    inputElement.focus();

    for (const key in this.filters) {
      if (this.filters.hasOwnProperty(key)) {
        if (key != 'getPartyCodeUsingPartyType' && key != 'getSerialDefaultValue')
          this.filters[key] = null; // You can use undefined or '' (empty string) as well
      }
    }

    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['add', 'retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );


    this.addAdminAdvancePaymentForm.patchValue({
      orderby: '',
      tdsacmajor: '',
      tdsamount: 0,
      narration: '',
    })

    this.config.isSave=false;

  }

  // back to admin advance payment form
  resetForm() {
    this.isBackClicked = true;
    if (this.addAdminAdvancePaymentForm.dirty) {
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

  //on leave compny
  onLeaveCompany(val: string) {
    this.filters.getBldg = "bldg_coy='" + val + "'";
    this.setSerialNumber();
    console.log(this.filters.getBldg, "get bldg");
  }

  onLeavePartyType(val: string) {
    this.filters.getParPartyType = "par_partytype='" + val + "'";
    console.log("get party code : ", this.filters.partyCode);
    this.setSerialNumber();
  }
  onLeavePartyCode(val: string) {
    this.filters.partyCode = val;
    this.setSerialNumber();
  }

  onLeaveBldgCode(val: string) {
    this.filters.getBgldCode = val;
    this.setSerialNumber();
  }

  setSerialNumber() {
    if (this.adminAdvancePaymentform.value?.coy) {
      this.filters.getCoy =
        "advn_coy='" +
        this.commonService.convertArryaToString(
          this.adminAdvancePaymentform.value?.coy
        ) +
        "'";
    }

    if (this.adminAdvancePaymentform.value?.partytype) {
      this.filters.getPartyType =
        "advn_partyType='" +
        this.commonService.convertArryaToString(
          this.adminAdvancePaymentform.value?.partytype
        ) +
        "'";
    }
    if (this.adminAdvancePaymentform.value?.bldgcode) {
      this.filters.getBgldCode =
        "advn_bldgCode='" +
        this.commonService.convertArryaToString(
          this.adminAdvancePaymentform.value?.bldgcode
        ) +
        "'";
    }
    if (this.adminAdvancePaymentform.value?.partycode) {
      this.filters.partyCode =
        "advn_partyCode='" +
        this.commonService.convertArryaToString(
          this.adminAdvancePaymentform.value?.partycode
        ) +
        "'";
    }

    this.filters.getSerial =
      (this.filters.getCoy ? this.filters.getCoy + ' AND ' : '') +
      (this.filters.partyCode ? this.filters.partyCode + ' AND ' : '') +
      (this.filters.getBgldCode ? this.filters.getBgldCode + ' AND ' : '') +
      (this.filters.getPartyType ? this.filters.getPartyType + ' AND ' : '') +
      ((this.filters.getCoy || this.filters.partyCode || this.filters.getBgldCode || this.filters.getPartyType) ? this.filters.getSerialDefaultValue : '');

    // console.log('filter final string', this.filters.getSerial);
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
    dialogRef.afterOpened().subscribe(() => {
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.adminAdvancePaymentform.value.coy == '') {
        var inputElement: any = document.getElementById('advn_coy');
        inputElement.focus();
      }
      else if (this.adminAdvancePaymentform.value.partytype == '') {
        var inputElement: any = document.getElementById('partytype');
        inputElement.focus();
      }
      else if (this.adminAdvancePaymentform.value.partycode == '') {
        var inputElement: any = document.getElementById('advn_partycode');
        inputElement.focus();
      }
      else if (this.adminAdvancePaymentform.value.bldgcode == '') {
        var inputElement: any = document.getElementById('advn_bldg');
        inputElement.focus();
      }
      else if (this.adminAdvancePaymentform.value.pinvno == '') {
        var inputElement: any = document.getElementById('advn_pinvo');
        inputElement.focus();
      }
    });
  }

  // confirm dailog box
  showConfirmation(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean,
    eventType?: string
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
    dialogRef.afterOpened().subscribe(() => {
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log("evetn tyeo", result);
        this.addAdminAdvancePaymentForm.get('date')?.setValue(new Date())

        this.getPrint(true);
        this.back();

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
        if (this.isBackClicked) {
          this.back();
        }
      } else {
        this.back();
      }
    });
  }
  
  showConfirmationIfValueIsNearTen(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean,
    eventType?: string
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
    dialogRef.afterOpened().subscribe(() => {
      // console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.initialMode = true;
        this.config.isSave ? this.saveData() : '';
        if (this.isBackClicked) {
          // this.back();
        }
      } 
      // else {
      //   this.back();
      // }
    });
  }
}
