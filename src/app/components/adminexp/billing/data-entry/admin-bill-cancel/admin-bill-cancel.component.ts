import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-admin-bill-cancel',
  templateUrl: './admin-bill-cancel.component.html',
  styleUrls: ['./admin-bill-cancel.component.css']
})
export class AdminBillCancelComponent implements OnInit {
  initialMode: boolean = false;

  config = {
    isLoading: false,
  }

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['retrieve', 'save', 'reset', 'back', 'exit']);

  constructor(
    private http: HttpRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,

  ) { }

  billCancellation: FormGroup = this.fb.group({
    billNo: ['', Validators.required],

    partyCode: [''],
    partyName: [{ value: '', disabled: true }],
    coy: [''],
    partyGST: [''],
    stateCode: [''],
    stateName: [''],
    bldgCode: [''],
    bldgName: [{ value: '', disabled: true }],
    orderBy: [''],
    matService: [''],
    billType: [''],
    invoiceNum: [''],
    invoiceDate: [''],
    invoiceAmt: [''],
    expenseAc: [''],
    minType: [''],
    acMinor: [''],
    expClass: [''],
    expId: [''],
    periodFrom: [''],
    periodUpTo: [''],
    tdspers: [''],
    tdsAcMajor: [''],
    tdsAmt: [''],
    fotoAmt: [''],
    narration: [''],

    admBillCancelList: this.fb.array([])
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('billNo');
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true);
    this.commonService.enableDisableButtonsByIds(['retrive', 'reset', 'exit'], this.buttonsList, false);
  }

  createBillcancellation(data: any): FormGroup | any {
    return this.fb.group({
      sacCode: [data ? data.adbldHsnsaccode : ''],
      itemDesc: [data ? data.adbldItemdesc : ''],
      uom: [data ? data.adbldUom : ''],
      qty: [data ? data.adbldQuantity : ''],
      rate: [data ? data.adbldRate : ''],
      amount: [data ? data.adbldAmount : ''],
      discountAmt: [data ? data.adbldDiscountamt : ''],
      taxableAmt: [data ? data.adbldTaxableamt : ''],
      cgstpers: [data ? data.adbldCgstperc : ''],
      cgstAmt: [data ? data.adbldCgstamt : ''],
      sgstpers: [data ? data.adbldSgstperc : ''],
      sgstAmt: [data ? data.adbldSgstamt : ''],
      igstpers: [data ? data.adbldIgstperc : ''],
      igstAmt: [data ? data.adbldIgstamt : ''],
      ugstpers: [data ? data.adbldUgstperc : ''],
      ugstAmt: [data ? data.adbldUgstamt : ''],
    })
  }

  addBillCancel(data: any) {
    const addRow = this.billCancellation.get('admBillCancelList') as FormArray;
    addRow.push(this.createBillcancellation(data))
  }

  // removeBillCancel(index: number){
  //   const addRow = this.billCancellation.get('admBillCancelList') as FormArray;
  //   addRow.removeAt(this.createBillcancellation(index))
  // }

  buttonAction(event: string) {
    if (event == 'retrieve') {
      this.fetchBillCancellation();
    }
    else if (event == 'save') {
      this.saveBillCancellation();
    }
    else if (event == 'reset') {
      this.billCancellation.get('billNo')?.reset();
      this.setFocus('billNo');
    }
    else if (event == 'back') {
      this.goBack();
    }
    else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  fetchBillCancellation() {
    let parms = {
      ser: this.commonService.convertArryaToString(this.billCancellation.get('billNo')?.value)
    }

    if (this.billCancellation.value.billNo != '') {
      this.http.request('get', api_url.getBillCancellation, null, parms).subscribe((res: any) => {
        console.log("get bill cancel", res);

        if (res.success == true) {
          this.initialMode = true;
          this.billCancellation.disable();

          this.billCancellation.patchValue({
            partyCode: res.data.docParCode,
            partyName: res.data.refPartyDesc,
            coy: res.data.admbillh.adblhCoy,
            partyGST: res.data.gstNo,
            stateCode: res.data.stateCode,
            stateName: res.data.stateName,
            bldgCode: res.data.admbillh.adblhBldgcode,
            bldgName: res.data.bldgDesc,
            orderBy: res.data.admbillh.adblhOrderedby,
            invoiceAmt: res.data.admbillh.adblhBillamount,
            matService: res.data.admbillh.adblhExptype,
            billType: res.data.admbillh.adblhBilltype,
            invoiceNum: res.data.admbillh.adblhSuppbillno,
            invoiceDate: res.data.admbillh.adblhSuppbilldt,
            expenseAc: res.data.admbillh.adblhAcmajor,
            minType: res.data.admbillh.adblhMintype,
            acMinor: res.data.admbillh.adblhAcminor,
            expClass: res.data.admbillh.adblhSunclass,
            expId: res.data.admbillh.adblhSunid,
            periodFrom: res.data.admbillh.adblhFromdate,
            periodUpTo: res.data.admbillh.adblhTodate,
            tdspers: res.data.admbillh.adblhTdsperc,
            tdsAcMajor: res.data.admbillh.adblhTdsacmajor,
            tdsAmt: res.data.admbillh.adblhTdsamount,
            fotoAmt: res.data.admbillh.adblhFotoamount,
            narration: res.data.admbillh.adblhNarration,
          })

          res.data.admbilld.map((item: any) => {
            this.addBillCancel(item);
            this.billCancellation.disable();
          })

          this.toastr.success(res.message ? res.message : 'Data fetch successfully', 'Data fetched.')
          this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, true)
          this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)

        } else {
          this.toastr.error(res.message ? res.message : 'This bill is already paid. Removing payment reference from this bill.', 'No Data.')
        }
      })
    }
    else {
      this.showErrorFieldDialog("K-Raheja ERP", "Enter Bill No.", "error");
    }
  }

  saveBillCancellation() {
    this.showConfirmation("K-Raheja ERP", "Do you want to reverse bill?", "info", true)
  }

  goBack() {
    this.initialMode = false;
    this.billCancellation.reset();
    this.billCancellation.get('billNo')?.enable();
    this.setFocus('billNo');

    const groupArray = this.billCancellation.get('admBillCancelList') as FormArray;
    groupArray.clear();

    this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
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
      this.setFocus('billNo')
    });
  }

  // confirm dailog box
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
    dialogRef.afterClosed().subscribe((result: any) => {
      let parms = {
        ser: this.commonService.convertArryaToString(this.billCancellation.get('billNo')?.value).trimEnd()
      }
      this.config.isLoading = true;
      this.http.request('put', api_url.cancelBillCancellation, null, parms).subscribe(
        {
          next: (res: any) => {
            console.log("Save bill cancellation :", res);
            this.config.isLoading = false;
            this.initialMode = false;
            this.billCancellation.reset();
            this.billCancellation.get('billNo')?.enable();
            this.setFocus('billNo');
            this.toastr.success(res.message ? res.message : 'Data update successfully', 'Data updated')
            this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
            this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
          },
          error: () => {
            this.config.isLoading = false
          }
        }
      )
    });
  }

}
