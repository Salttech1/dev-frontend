import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-cancel-contract-bill',
  templateUrl: './cancel-contract-bill.component.html',
  styleUrls: ['./cancel-contract-bill.component.css']
})
export class CancelContractBillComponent implements OnInit {

  subIdQuery = {
    getConttor: `par_partytype = 'E'`,
    getBldg: `(bmap_closedate >= to_date('${moment().format('DD.MM.yyyy')}','dd.mm.yyyy') or bmap_closedate is null)`
  }

  cancelContractBillForm: FormGroup = this.fb.group({
    headersForm: this.fb.group(
      {
        recId: ['', Validators.required],
        bldgCode: ['', Validators.required],
        workCode: ['', Validators.required],
        workName: ['', Validators.required],
        partyCode: ['', Validators.required],
        partyName: ['', Validators.required],
        partyBillNo: ['', Validators.required],
      }
    ),
    detailForm: this.fb.group(
      {

        propCode: [{ value: '', disabled: true }],
        propName: [{ value: '', disabled: true }],
        companyCode: [{ value: '', disabled: true }],
        companyName: [{ value: '', disabled: true }],
        projectCode: [{ value: '', disabled: true }],
        projectName: [{ value: '', disabled: true }],
        billDate: [{ value: '', disabled: true }],
        billAmount: [{ value: '', disabled: true }],
        tds: [{ value: '', disabled: true }],
        tdsAmount: [{ value: '', disabled: true }],
        durationFrom: [{ value: '', disabled: true }],
        durationTo: [{ value: '', disabled: true }],
        tranSer: [{ value: '', disabled: true }],
        retention: [{ value: '', disabled: true }],
        narration: [{ value: '', disabled: true }],
      }
    ),
    billDetailsList: this.fb.array([])
  })

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'retrieve',
    'save',
    'back',
    'exit',
  ]);
  config = {
    isLoading: false,
    isRetrive: false
  }
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private commonService: CommonService,
    private router: Router,
    private dailog: MatDialog,
    private service: ServiceService,
    private modalService: ModalService,) { }

  ngOnInit(): void {
    this.addBillEntryList()
    this.cancelContractBillForm.get('billDetailsList')?.disable();
  }

  // button action
  buttonAction(type: string) {
    console.log("form value", this.cancelContractBillForm);
    console.log("event", type);

    if (type == 'retrieve') {
      this.config.isRetrive = true

    } else if (type == 'back') {

      this.config.isRetrive = false
    }

  }

  ////////////////////////////////////
  // form array
  ////////////////////////////////////
  createBillEntryDetails(data?: any): FormGroup | any {
    return this.fb.group({
      sacCode: [data ? data.sacCode : '', Validators.required],
      itemDesc: [{ value: data ? data.itemDesc : '', disabled: true }, Validators.required],
      uom: [data ? data.adbldUom : ''],
      qty: [data?.adbldDbqty ? data.adbldDbqty : 0],
      rate: [data ? data.adbldRate : ''],
      amount: [data ? data.adbldAmount : '', Validators.required],
      discountAmt: [data ? data.adbldDiscountamt : ''],
      taxableAmt: [data ? data.adbldTaxableamt : '', Validators.required],
      cgstPerc: [data ? data.adbldCgstperc : ''],
      cgstAmt: [data ? data.adbldCgstamt : ''],
      sgstPerc: [data ? data.adbldSgstperc : ''],
      sgstAmt: [data ? data.adbldSgstamt : ''],
      igstPerc: [data ? data.adbldIgstperc : ''],
      igstAmt: [data ? data.adbldIgstamt : ''],
      ugstPerc: [data ? data.adbldUgstperc : ''],
      ugstAmt: [data ? data.adbldUgstamt : ''],
      lineno: [this.cancelContractBillForm.getRawValue().billDetailsList.length + 1],

    });
  }

  addBillEntryList(data?: any) {
    const invoiceBreakupDetailsArray = this.cancelContractBillForm.get(
      'billDetailsList'
    ) as FormArray;
    invoiceBreakupDetailsArray.push(this.createBillEntryDetails(data));

  }



}
