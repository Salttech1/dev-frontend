import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormControlName,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { config, take } from 'rxjs';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-admin-advance-payment-passing',
  templateUrl: './admin-advance-payment-passing.component.html',
  styleUrls: ['./admin-advance-payment-passing.component.css'],
})
export class AdminAdvancePaymentPassingComponent implements OnInit {
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`;
  maxDate = new Date(); //use for future date disable
  isBackClicked: boolean = false; // use for back btn

  initialMode: boolean = false;

  filters: any = {
    getCoy: '',
    getBldg: '',
    getPartyType: '',
    getPartyCode: '',
    getBgldCode: '',
    getPInvoice: '',
    getSerial: '',
    getSerialDefaultValue: " NVL(advn_status, '1') < '5'",
    getPartyCodeUsingPartyType: "par_partytype in ('B','C','Z')",

    getParPartyType: ''
  };

  config = {
    url: ''
  }

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'retrieve',
    'save',
    'reset',
    'back',
    'exit',
  ]);
  dailog: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) { }

  adminAdvancePaymentPassingForm: FormGroup = this.fb.group({
    coy: [''],
    coyname: [{ value: '', disabled: true }],
    partytype: ['Z'],
    partycode: [''],
    partyname: [{ value: '', disabled: true }],
    bldgcode: [''],
    bldgname: [{ value: '', disabled: true }],
    pinvno: ['', Validators.required],
    ser: ['', Validators.required],
  });

  fetchAdminAdvancePaymentPassing: FormGroup = this.fb.group({
    pinvdate: [''],
    orderby: [''],
    advanceamt: [''],
    basicamt: [''],
    gstperc: [''],
    gstamt: [''],
    tdsacmajor: [''],
    tdsperc: [''],
    tdsamount: [''],
    paidamount: [''],
    fotoamount: [''],
    date: [''],
    narration: [''],
  });

  ngOnInit(): void {
    this.init();
  }

  init() {
    // button
    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
  }

  buttonAction(event: string) {
    console.log('check event : ', event);

    if (event == 'retrieve') {
      this.getAdminPaymentPassing();
    } else if (event == 'save') {
      this.saveAdminPaymentPassing();
    } else if (event == 'reset') {
      this.adminAdvancePaymentPassingForm.reset();
      this.filters.getSerial = '';

      for (const key in this.filters) {
        if (this.filters.hasOwnProperty(key)) {
          if (key != 'getPartyCodeUsingPartyType' && key != 'getSerialDefaultValue')
            this.filters[key] = null; // You can use undefined or '' (empty string) as well
        }
      }

    } else if (event == 'back') {
      this.resetForm();
      // this.adminAdvancePaymentPassingForm.reset();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // fetch Data from db
  getAdminPaymentPassing() {
    let payload = {
      ser: this.commonService.convertArryaToString(
        this.adminAdvancePaymentPassingForm.get('ser')?.value
      ),
      pinvno: this.commonService.convertArryaToString(
        this.adminAdvancePaymentPassingForm.get('pinvno')?.value
      ),
    };
    console.log('payload value :', payload);

    console.log('fomr val', this.adminAdvancePaymentPassingForm);

    if (payload.ser || payload.pinvno) {
      let serialNo = this.adminAdvancePaymentPassingForm
        .get('ser')
        ?.value[0]?.[0].trim();
      if (serialNo != null) {
        this.http
          .request(
            'get',
            api_url.getAdminAdvancePaymentPassing +
            '?ser=' +
            this.adminAdvancePaymentPassingForm.value.ser +
            '&pinv=' +
            this.adminAdvancePaymentPassingForm.value.pinvno,
            payload,
            null
          )
          .pipe(take(1))
          .subscribe({
            next: (res: any) => {
              if (res.success == true) {
                this.initialMode = true;
                // console.log('fetch data :', res);
                // this.onLeaveCompany(res.data.coy);        

                // admin advance payment passing form patch
                this.adminAdvancePaymentPassingForm.patchValue({
                  coy: res.data.advnCoy,
                  partytype: res.data.advnPartytype,
                  partycode: res.data.advnPartycode,
                  bldgcode: res.data.advnBldgcode,
                  pinvno: res.data.advnPinvno,
                });

                // fetch admin advance payment passing form patch
                this.fetchAdminAdvancePaymentPassing.patchValue({
                  pinvdate: res.data.advnPinvdate,
                  orderby: res.data.advnOrderby,
                  advanceamt: res.data.advnAdvanceamt,
                  basicamt: res.data.advnBasicamt,
                  gstperc: res.data.advnGstperc,
                  gstamt: res.data.advnGstamt,
                  tdsacmajor: res.data.advnTdsacmajor,
                  tdsperc: res.data.advnTdsperc,
                  tdsamount: res.data.advnTdsamount,
                  paidamount: res.data.advnPaidamount,
                  fotoamount: res.data.advnFotoamount,
                  date: res.data.advnDate,
                  narration: res.data.advnNarration,
                });
                this.adminAdvancePaymentPassingForm.disable();
                this.fetchAdminAdvancePaymentPassing.disable();

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
                  ['retrieve', 'reset', 'exit'],
                  this.buttonsList,
                  true
                );
              } else {
                this.toastr.error(res.message ? res.message : 'Payment already passed for the given serial number.', 'No Data.')
              }
            },
          });
      }
    } else {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'You have to enter either performa invoice# No or Serial#',
        'error'
      );
    }
  }

  // save data in db
  saveAdminPaymentPassing() {
    console.log('fonmr', this.adminAdvancePaymentPassingForm);

    if (true) {
      let body = this.commonService.convertArryaToString(
        this.adminAdvancePaymentPassingForm.get('ser')?.value
      );

      this.http
        .request('put', api_url.createAdminAdvancePaymentPassing, body, null)
        .subscribe((res: any) => {
          console.log('api', res);

          this.initialMode = false;
          this.adminAdvancePaymentPassingForm.reset();
          this.fetchAdminAdvancePaymentPassing.reset();
          this.adminAdvancePaymentPassingForm.get('coy')?.enable();
          this.adminAdvancePaymentPassingForm.get('partytype')?.enable();
          this.adminAdvancePaymentPassingForm.get('partycode')?.enable();
          this.adminAdvancePaymentPassingForm.get('bldgcode')?.enable();
          this.adminAdvancePaymentPassingForm.get('pinvno')?.enable();
          this.adminAdvancePaymentPassingForm.get('ser')?.enable();

          this.toastr.success(res.message ? res.message : 'Admin advance Bill Passed Successfully.', 'Data Saved')

          this.commonService.enableDisableButtonsByIds(['retrieve', 'exit'], this.buttonsList, false);
          this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true);
        });
    }
  }

  back() { }

  // back button
  resetForm() {
    this.isBackClicked = true;
    this.initialMode = false;
    this.adminAdvancePaymentPassingForm.reset();
    this.fetchAdminAdvancePaymentPassing.reset();
    this.adminAdvancePaymentPassingForm.get('coy')?.enable();
    this.adminAdvancePaymentPassingForm.get('partytype')?.enable();
    this.adminAdvancePaymentPassingForm.get('partycode')?.enable();
    this.adminAdvancePaymentPassingForm.get('bldgcode')?.enable();
    this.adminAdvancePaymentPassingForm.get('pinvno')?.enable();
    this.adminAdvancePaymentPassingForm.get('ser')?.enable();

    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true);
    this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false);
  }

  //on leave compny
  onLeaveCompany(val: string) {
    if (val) {
      this.filters.getBldg = "bldg_coy='" + val + "'";
      this.setSerialNumber();
      console.log(this.filters.getBldg, "get bldg");
    }
  }

  // On leave party type
  onLeavePartyType(val: string) {
    // this.filters.getPartyType = val;
    this.filters.getParPartyType = "par_partytype='" + val + "'";
    console.log("get party code : ", this.filters.partyCode);
    this.setSerialNumber();
  }

  // On leave party code
  onLeavePartyCode(val: string) {
    this.filters.getPartyCode = val;
    this.setSerialNumber();
  }

  // On leave bldg code
  onLeaveBldgCode(val: string) {
    this.filters.getBgldCode = val;
    console.log("bldg code data:", this.filters.getBgldCode);

    this.setSerialNumber();
  }

  // On leave p. invoice 
  onLeavePInvoice(val: string) {
    this.filters.getPInvoice = val;
    this.setSerialNumber();
  }

  // filter Serial
  setSerialNumber() {
    if (this.adminAdvancePaymentPassingForm.value?.coy) {
      this.filters.getCoy = "advn_coy='" + this.commonService.convertArryaToString(this.adminAdvancePaymentPassingForm.value?.coy) + "'"
    }
    if (this.adminAdvancePaymentPassingForm.value?.partytype) {
      this.filters.getPartyType = "advn_partytype='" + this.commonService.convertArryaToString(this.adminAdvancePaymentPassingForm.value?.partytype) + "'"
    }
    if (this.adminAdvancePaymentPassingForm.value?.partycode) {
      this.filters.getPartyCode = "advn_partycode='" + this.commonService.convertArryaToString(this.adminAdvancePaymentPassingForm.value?.partycode) + "'"
    }
    if (this.adminAdvancePaymentPassingForm.value?.bldgcode) {
      this.filters.getBgldCode = "advn_bldgCode='" + this.commonService.convertArryaToString(this.adminAdvancePaymentPassingForm.value?.bldgcode) + "'"
    }
    if (this.adminAdvancePaymentPassingForm.value?.pinvno) {
      this.filters.getPInvoice = "advn_pinvno='" + this.commonService.convertArryaToString(this.adminAdvancePaymentPassingForm.value?.pinvno) + "'"
    }

    this.filters.getSerial = (this.filters.getCoy ? this.filters.getCoy + ' AND ' : '') +
      (this.filters.getPartyType ? this.filters.getPartyType + ' AND ' : '') +
      (this.filters.getPartyCode ? this.filters.getPartyCode + ' AND ' : '') +
      (this.filters.getBgldCode ? this.filters.getBgldCode + ' AND ' : '') +
      (this.filters.getPInvoice ? this.filters.getPInvoice + ' AND ' : '') +
      ((this.filters.getCoy || this.filters.getPartyType || this.filters.getPartyCode || this.filters.getBgldCode || this.filters.getPInvoice) ? this.filters.getSerialDefaultValue : '');

    // console.log("Filter serial :", this.filters.getSerial);                           
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
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // this.focusField('coyCode');
      //window.location.reload()
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
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }
}
