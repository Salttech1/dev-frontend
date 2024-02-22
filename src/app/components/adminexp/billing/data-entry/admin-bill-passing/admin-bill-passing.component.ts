import { Component, OnInit, Renderer2 } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as constant from '../../../../../../constants/constant';
import { CommonService } from 'src/app/services/common.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { Router } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { api_url } from 'src/constants/constant';

@Component({
  selector: 'app-admin-bill-passing',
  templateUrl: './admin-bill-passing.component.html',
  styleUrls: ['./admin-bill-passing.component.css'],
})
export class AdminBillPassingComponent implements OnInit {
  initialMode: Boolean = false;
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`;

  filters: any = {
    getBldg: '',
    getPartyType: '',
    getPartyCode: '',
    getBgldCode: '',
    getSuppBillNo: '',
    getSerial: 'adblh_status < 5',
    getSerialDefaultValue: "NVL(adblh_status,'1') < '5'",
    getParPartyType: '',
    // getBldg: ''
  };

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'retrieve',
    'save',
    'reset',
    'back',
    'exit',
  ]);

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private commonService: CommonService,
    private router: Router,
    private http: HttpRequestService
  ) {}

  adminPassSelectionsForm: FormGroup = this.fb.group({
    coyCode: [''],
    coyName: [{ value: '', disabled: true }],
    partyType: ['Z'],
    partyCode: [''],
    partyName: [{ value: '', disabled: true }],
    bldgCode: [''],
    bldgName: [{ value: '', disabled: true }],
    suppBillNo: [''],
    serNo: ['', Validators.required],
  });

  adminPassBillForm: FormGroup = this.fb.group({
    orderBy: [''],
    matService: [''],
    billType: [''],
    expClass: [''],
    expId: [''],
    period: this.fb.group({
      periodFrom: [''],
      periodUpTo: [''],
    }),
    periodFrom: [''],
    periodUpTo: [''],
    invoiceNum: [''],
    invoiceDate: [''],
    invoiceAmt: [''],
    tdspern: [''],
    tdsAmt: [''],
    fotoAmt: [''],
    narration: [''],
    advanceAdjust: [''],
    payAmt: [''],
    debitNoteAmt: [''],
  });

  ngOnInit(): void {
    this.setFocus('id_CoyCode');
    this.init();
  }

  init() {
    // button
    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );
  }

  buttonAction(event: string) {
    if (event == 'retrieve') {
      this.fetchBill();
    } else if (event == 'save') {
      this.addBill();
    } else if (event == 'reset') {
      this.adminPassSelectionsForm.reset();
      this.filters.getSerial = 'adblh_status < 5';
      this.setFocus('id_CoyCode');
    } else if (event == 'back') {
      this.goBack();
    } else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  fetchBill() {
    let parms = {
      ser: this.commonService.convertArryaToString(
        this.adminPassSelectionsForm.get('serNo')?.value
      ),
    };
    console.log('fetch bill payload :', parms);

    if (this.adminPassSelectionsForm.value.serNo != '') {
      this.http
        .request('get', api_url.getBillPassing, null, parms)
        .subscribe((res: any) => {
          console.log('fetch data :', res);

          if (res.success == true) {
            this.initialMode = true;
            this.adminPassSelectionsForm.disable();
            this.adminPassBillForm.disable();

            this.adminPassSelectionsForm.patchValue({
              coyCode: res.data.adblhCoy,
              partyType: res.data.adblhPartytype,
              partyCode: res.data.adblhPartycode,
              bldgCode: res.data.adblhBldgcode,
              suppBillNo: res.data.adblhSuppbillno,
            });

            this.adminPassBillForm.patchValue({
              orderBy: res.data.adblhOrderedby,
              matService: res.data.adblhExptype,
              billType: res.data.adblhBilltype,
              expClass: res.data.adblhSunclass,
              expId: res.data.adblhSunid,
              period: {
                periodFrom: res.data.adblhFromdate,
                periodUpTo: res.data.adblhTodate,
              },
              periodFrom: res.data.adblhFromdate,
              periodUpTo: res.data.adblhTodate,
              invoiceNum: res.data.adblhSuppbillno,
              invoiceDate: res.data.adblhSuppbilldt,
              invoiceAmt: res.data.adblhBillamount,
              tdspern: res.data.adblhTdsperc,
              tdsAmt: res.data.adblhTdsamount,
              fotoAmt: res.data.adblhFotoamount,
              narration: res.data.adblhNarration,
              advanceAdjust: res.data.adblhAdvnadjust,
              payAmt:
                res.data.adblhBillamount -
                res.data.adblhTdsamount -
                res.data.adblhAdvnadjust -
                res.data.adblhDebitamt,
              debitNoteAmt: res.data.adblhDebitamt,
            });

            this.filters.getBldg = "bldg_coy='" + res.data.adblhCoy + "'";

            this.toastr.success(
              res.message ? res.message : 'Data fetch successfully',
              'Data fetched.'
            );
            this.commonService.enableDisableButtonsByIds(
              ['retrieve', 'reset', 'exit'],
              this.buttonsList,
              true
            );
            this.commonService.enableDisableButtonsByIds(
              ['save', 'back'],
              this.buttonsList,
              false
            );
          } else {
            this.toastr.error(
              res.success ? res.success : 'This bill has been passed.',
              'No Data.'
            );
          }
        });
    } else {
      this.showErrorFieldDialog(
        'K-Raheja ERP',
        'You have to enter Serial#',
        'error'
      );
    }
  }

  addBill() {
    let parms = {
      ser: this.commonService.convertArryaToString(
        this.adminPassSelectionsForm.get('serNo')?.value
      ),
    };

    this.http
      .request('put', api_url.createBillPassing, null, parms)
      .subscribe((res: any) => {
        console.log('api res save bill passing data :', res);

        this.initialMode = false;
        this.adminPassSelectionsForm.reset();
        this.adminPassSelectionsForm.enable();
        this.adminPassBillForm.reset();

        if (res.success == true) {
          this.toastr.success(
            res.message ? res.message : 'Data saved successfully',
            'Data saved.'
          );
          this.showErrorFieldDialog(
            'K-Raheja ERP',
            'New P Number is ' + res.data + ' generated.',
            'info'
          );
        } else {
          this.toastr.error(res.message);
        }

        this.adminPassSelectionsForm.get('coyName')?.disable();
        this.adminPassSelectionsForm.get('partyName')?.disable();
        this.adminPassSelectionsForm.get('bldgName')?.disable();

        this.commonService.enableDisableButtonsByIds(
          ['retrieve', 'rest', 'exit'],
          this.buttonsList,
          false
        );
        this.commonService.enableDisableButtonsByIds(
          ['save', 'back'],
          this.buttonsList,
          true
        );
      });
  }

  goBack() {
    this.initialMode = false;
    this.adminPassSelectionsForm.reset();
    this.adminPassSelectionsForm.enable();
    this.adminPassBillForm.reset();
    this.setFocus('id_CoyCode');
    this.filters.getSerial = 'adblh_status < 5';
    this.adminPassSelectionsForm.get('partyType')?.setValue('Z');
    this.adminPassSelectionsForm.get('coyName')?.disable();
    this.adminPassSelectionsForm.get('partyName')?.disable();
    this.adminPassSelectionsForm.get('bldgName')?.disable();

    this.filters = {
      getBldg: '',
      getPartyType: '',
      getPartyCode: '',
      getBgldCode: '',
      getSuppBillNo: '',
      getSerial: 'adblh_status < 5',
      getSerialDefaultValue: "NVL(adblh_status,'1') < '5'",
      getParPartyType: '',
    };

    this.commonService.enableDisableButtonsByIds(
      ['save', 'back'],
      this.buttonsList,
      true
    );
    this.commonService.enableDisableButtonsByIds(
      ['retrieve', 'reset', 'exit'],
      this.buttonsList,
      false
    );
  }

  // setFocus to object on form
  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  partyTypeKeyPress(val: any, type: string) {
    if (type == 'ref') {
      this.adminPassSelectionsForm.patchValue({
        partyCode: '',
        partyName: '',
        suppBillNo: '',
      });
    } else {
      this.adminPassSelectionsForm.patchValue({
        partyCode: '',
        partyName: '',
        suppBillNo: '',
      });
    }
  }

  partyCodeKeyPress(val: String) {
    this.adminPassSelectionsForm.patchValue({
      suppBillNo: '',
    });
  }

  //on leave compny
  onLeaveCompany(val: string) {
    // this.filters.getBldg = "bldg_code='" + val + "'"; // new requirement
    this.filters.getBldg = "bldg_coy='" + val + "'";

    this.setSerialNumber();
    console.log('get bldg :', this.filters.getBldg);
  }

  onLeavePartyType(val: string) {
    // this.filters.getPartyType = "adblh_partytype='" + val + "'";
    console.log('value --->',val)
    this.filters.getParPartyType = "par_partytype='" + val + "'";
    console.log('form data -->',this.adminPassBillForm.get('partyCode'))
    this.setSerialNumber();
  }

  onLeavePartyCode(val: string) {
    this.filters.getPartyCode = val;
    this.setSerialNumber();
  }

  onLeaveBldgCode(val: string) {
    this.filters.getBgldCode = val;
    this.setSerialNumber();
    console.log('get bldg code :', this.filters.getBgldCode);
  }

  onLeavePInvoice(val: string) {
    this.filters.getPInvoice = val;
    this.setSerialNumber();
  }

  setSerialNumber() {
    if (this.adminPassSelectionsForm.value.coyCode) {
      this.filters.getCoy =
        "adblh_coy='" +
        this.commonService.convertArryaToString(
          this.adminPassSelectionsForm.value.coyCode
        ) +
        "'";
    }
    if (this.adminPassSelectionsForm.value.partyType) {
      this.filters.getPartyType =
        "adblh_partytype='" +
        this.commonService.convertArryaToString(
          this.adminPassSelectionsForm.value.partyType
        ) +
        "'";
    }
    if (this.adminPassSelectionsForm.value.partyCode) {
      this.filters.getPartyCode =
        "adblh_partycode='" +
        this.commonService.convertArryaToString(
          this.adminPassSelectionsForm.value.partyCode
        ) +
        "'";
    }
    if (this.adminPassSelectionsForm.value.bldgCode) {
      this.filters.getBgldCode =
        "adblh_bldgcode='" +
        this.commonService.convertArryaToString(
          this.adminPassSelectionsForm.value.bldgCode
        ) +
        "'";
    }
    if (this.adminPassSelectionsForm.value.suppBillNo) {
      this.filters.getSuppBillNo =
        "adblh_suppbillno='" +
        this.commonService.convertArryaToString(
          this.adminPassSelectionsForm.value.suppBillNo
        ) +
        "'";
    }

    this.filters.getSerial =
      (this.filters.getCoy ? this.filters.getCoy + ' AND ' : '') +
      (this.filters.getPartyType ? this.filters.getPartyType + ' AND ' : '') +
      (this.filters.getPartyCode ? this.filters.getPartyCode + ' AND ' : '') +
      (this.filters.getBgldCode ? this.filters.getBgldCode + ' AND ' : '') +
      (this.filters.getSuppBillNo ? this.filters.getSuppBillNo + ' AND ' : '') +
      (this.filters.getCoy ||
      this.filters.getPartyType ||
      this.filters.getPartyCode ||
      this.filters.getBgldCode ||
      this.filters.getSuppBillNo
        ? this.filters.getSerialDefaultValue
        : '');
    console.log('Query :', this.filters.getSerial);
  }

  // error dailog box
  showErrorFieldDialog(titleVal: any, message: string, type: string) {
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
      this.setFocus('serNo');
    });
  }

  // confirmation dailog box
  showConfirmation(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
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
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
