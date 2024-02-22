import { Component, OnInit, Renderer2 } from '@angular/core';
import { buttonsList } from 'src/app/shared/interface/common';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { api_url } from 'src/constants/constant';
import { filter, take } from 'rxjs';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/services/service.service';



@Component({
  selector: 'app-admin-debit-note-cancellation',
  templateUrl: './admin-debit-note-cancellation.component.html',
  styleUrls: ['./admin-debit-note-cancellation.component.css']
})
export class AdminDebitNoteCancellationComponent implements OnInit {
  initialMode: boolean = false;
  isBackClicked: boolean = false; // use for back button
  filter_partyType = `TRIM(ENT_ID) in ('B','C','Z')`; // use for party type filter

  config = {
    partyType: '',
    suppBillNo: ''
  }


  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'retrieve', 'save', 'reset', 'back', 'exit'
  ])

  filter = {
    getDebitNote: '',
    getParPartyType: ''
  }


  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private dailog: MatDialog,
    private service: ServiceService,
    private renderer: Renderer2,
  ) { }

  debitNoteCancellation: FormGroup = this.fb.group({
    partytype: ['Z', Validators.required],
    partycode: ['', Validators.required],
    partycodename: [{ value: '', disabled: true }],
    dbnoteser: ['', Validators.required],

  })

  debitNoteCancellationHeader: FormGroup = this.fb.group({
    partycodename: [{ value: '', disabled: true }],
    bldgcodename: [{ value: '', disabled: true }],
    coyname: [{ value: '', disabled: true }],
    project: [{ value: '', disabled: true }],
    projectName: [{ value: '', disabled: true }],
    invbilldt: [{ value: '', disabled: true }],
    billamt: [{ value: '', disabled: true }],
    debitNoteDate: [{ value: '', disabled: true }],
    dnamount: [{ value: '', disabled: true }],
    dbnoteser: [{ value: '', disabled: true }],
    narration: [{ value: '', disabled: true }],
    description1: [{ value: '', disabled: true }]
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('debitnotecancel_partyType')
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: string) {
    if (event == 'retrieve') {
      this.getdebitNoteCancellation();
    }
    else if (event == 'save') {
      this.saveDebitNoteCancellation();
    }
    else if (event == 'reset') {
      this.debitNoteCancellation.reset();
      this.setFocus('debitnotecancel_partyType');
      this.debitNoteCancellation.get('partytype')?.setValue('Z');
    }
    else if (event == 'back') {
      this.resetDebitNoteCancellation();
    }
    else if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // Fetch debit note cancellation
  getdebitNoteCancellation() {
    if (this.debitNoteCancellation.valid) {
      this.initialMode = true;
      this.debitNoteCancellation.disable();

      let payload = {
        partycode: this.commonService.convertArryaToString(this.debitNoteCancellation.get('partycode')?.value),
        dbnoteser: this.commonService.convertArryaToString(this.debitNoteCancellation.get('dbnoteser')?.value)
      }

      this.http.request('get', api_url.getDebitNoteEntry + "?ser=" + this.debitNoteCancellation.value.dbnoteser, payload, null).subscribe((res: any) => {
        console.log("Data :", res);

        this.debitNoteCancellationHeader.patchValue({
          partycodename: res.data.adbnotehAttributes[0].par_partyname,
          bldgcodename: res.data.adbnotehAttributes[0].bldg_name,
          coyname: res.data.adbnotehAttributes[0].coy_name,
          project: res.data.adbnotehAttributes[0].proj_name,
          invbilldt: res.data.adbnotehAttributes[0].ADBNH_INVBILLDT,
          billamt: res.data.totalAmount,
          debitNoteDate: res.data.adbnotehAttributes[0].ADBNH_DATE,
          dnamount: res.data.adbnotehAttributes[0].ADBNH_AMOUNT,
          dbnoteser: res.data.adbnotehAttributes[0].ADBNH_DBNOTESER,
          narration: res.data.adbnotehAttributes[0].ADBNH_NARRATION,
          description1: res.data.adbnotehAttributes[0].ADBNH_DESCRIPTION1,
        })

        this.config.partyType = res.data.adbnotehAttributes[0]?.ADBNH_PARTYTYPE
        this.config.suppBillNo = res.data.adbnotehAttributes[0]?.ADBNH_INVBILLNO


        this.toastr.success(res.message ? res.message : 'Data fetch successfully.', 'Data fetched.')
      })
      this.commonService.enableDisableButtonsByIds(['retrieve', 'edit', 'delete', 'list', 'reset', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)

    }
    else {
      if (this.debitNoteCancellation.value.partycode == '') {
        this.showErrorFieldDialog("K-Raheja ERP", "Party code can't be left blank.", "error")
      }
      else if (this.debitNoteCancellation.value.dbnoteser == '') {
        this.showErrorFieldDialog("K-Raheja ERP", "Debit Note Number can't be left blank.", "error")
      }
    }
  }

  // Save debit note cancellation
  saveDebitNoteCancellation() {
    let payload = {
      serNo: this.commonService.convertArryaToString(this.debitNoteCancellation.get('dbnoteser')?.value),
      partyCode: this.commonService.convertArryaToString(this.debitNoteCancellation.get('partycode')?.value[0][0].trim()),
      partyType: this.config.partyType?.trimEnd(),
      suppBillNo: this.config.suppBillNo?.trimEnd()
    }
    console.log('save debit note cancellation payload :', payload);

    this.http.request('put', api_url.cancelDebitNoteCancellation, payload, null).subscribe((res: any) => {
      console.log('save debit note cancellation data :', res);
      if (res.success == true) {
        this.showErrorFieldDialog("K-Raheja ERP", "Cancelled / Reversed Admin Debit Note # " + res.data.oldTranserNum + "." + " New Transer # " + res.data.newTranserNum, "info")
      } else {
        this.toastr.error(res.message)
      }
    })

    this.initialMode = false;
    this.debitNoteCancellation.reset();
    this.debitNoteCancellation.enable();
    this.debitNoteCancellationHeader.reset();
    this.debitNoteCancellation.get('partycodename')?.disable();
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
    console.log("save debit note data :", this.debitNoteCancellationHeader.value);

  }

  back() {
    // this.showConfirmation("K-Raheja ERP", "Data not saved. Do you want to exit?", 'info', true);
    this.initialMode = false;
    this.debitNoteCancellation.reset();
    this.debitNoteCancellation.enable();
    this.debitNoteCancellationHeader.reset();

    this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
    this.commonService.enableDisableButtonsByIds(['save', 'back',], this.buttonsList, true)
  }

  resetDebitNoteCancellation() {
    this.showConfirmation("K-Raheja ERP", "Data not saved. Do you want to exit?", 'info', true);
  }

  onLeavePartyType(val: string) {
    this.filter.getParPartyType = "par_partytype='" + val + "'";
    console.log("get party code : ", this.filter.getParPartyType);

    this.debitNoteCancellation.patchValue({
      partycode: '',
      partycodename: '',
      dbnoteser: ''
    })
  }

  onLeavePartyCode(val: String) {
    this.filter.getDebitNote = "adbnh_partycode='" + val + "'";
    console.log("get debit note :", this.filter.getDebitNote);

    this.debitNoteCancellation.patchValue({
      dbnoteser: ''
    })
  }

  // setFocus to object on form
  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
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
      this.setFocus('debitnotecancel_partyType')
      this.debitNoteCancellation.get('partytype')?.setValue('Z');

      if (this.debitNoteCancellation.value.partycode == '') {
        this.setFocus('debitnotecancel_partycode')
      } else if (this.debitNoteCancellation.value.dbnoteser == '') {
        this.setFocus('debitnotecancel_debitNote')
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
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.initialMode = false;
        this.debitNoteCancellation.reset();
        this.debitNoteCancellation.enable();
        this.setFocus('debitnotecancel_partyType');
        this.debitNoteCancellation.get('partycodename')?.disable();
        this.debitNoteCancellation.get('partytype')?.setValue('Z')
        this.commonService.enableDisableButtonsByIds(['retrieve', 'reset', 'exit'], this.buttonsList, false)
        this.commonService.enableDisableButtonsByIds(['edit', 'save', 'delete', 'list', 'back'], this.buttonsList, true)
      }
    });
  }

}
