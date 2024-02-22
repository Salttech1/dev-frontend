import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-payment-list-generation',
  templateUrl: './payment-list-generation.component.html',
  styleUrls: ['./payment-list-generation.component.css']
})
export class PaymentListGenerationComponent implements OnInit {
  initialMode: boolean = false

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['generatePaymentList', 'retrieveDocs', 'print', 'selectDocs', 'finalisePayList', 'exit'])

  config = {
    paymentList: [
      { id: 'A', name: 'Add' },
      { id: 'E', name: 'Edit Pay List' }
    ]
  }

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) { }

  paymentListGeneration: FormGroup = this.fb.group({
    paymentList: ['A', Validators.required],
    building: ['', Validators.required],
    group: ['', Validators.required],
    listNo: [{ value: '', disabled: true }],
    durationFrom: ['', Validators.required],
    durationUpto: ['', Validators.required],
    listTranser: [{ value: '', disabled: true }],

    docTp: [''],
    code: [''],
    materialWorkName: [''],
    party: [''],
    supplierName: [''],
    document: [''],
    docDate: [''],
    certAmt: [''],
    payAmt: [''],
    pay: ['']
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('paymentList_building')
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['generatePaymentList', 'print', 'selectDocs', 'finalisePayList'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieveDocs', 'exit'], this.buttonsList, false)
  }

  buttonAction(val: String) {
    if (val == 'generatePaymentList') {

    }
    if (val == 'retrieveDocs') {
      this.fetchpaymentList();
    }
    if (val == 'print') {

    }
    if (val == 'selectDocs') {

    }
    if (val == 'finalisePayList') {

    }
    if (val == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  fetchpaymentList() {
    if (this.paymentListGeneration.value.building != '' && this.paymentListGeneration.value.group != '' && this.paymentListGeneration.value.durationFrom != '' && this.paymentListGeneration.value.durationUpto != '') {
      this.initialMode = true;

      this.commonService.enableDisableButtonsByIds(['generatePaymentList', 'retrieveDocs', 'print', 'selectDocs', 'finalisePayList'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['exit'], this.buttonsList, false)
    }
    else{
      if (this.paymentListGeneration.value.building == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter building code.', 'info')
      }
      else if (this.paymentListGeneration.value.group == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter group code.', 'info')
      }
      else if (this.paymentListGeneration.value.durationFrom == '') {
        this.showErrorDialog('K-Raheja ERP', 'Invalid duration from date.', 'info')
      }
      else if (this.paymentListGeneration.value.durationUpto == '') {
        this.showErrorDialog('K-Raheja ERP', 'Invalid duration upto date.', 'info')
      }
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

  showErrorDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.paymentListGeneration.value.building == '') {
        this.setFocus('paymentList_building')
      }
      else if (this.paymentListGeneration.value.group == '') {
        this.setFocus('paymentList_group')
      }
      else if (this.paymentListGeneration.value.durationFrom == '') {
        this.setFocus('paymentList_durationFrm')
      }
      else if (this.paymentListGeneration.value.durationUpto == '') {
        this.setFocus('paymentList_durationUpto')
      }
    });
  }

}
