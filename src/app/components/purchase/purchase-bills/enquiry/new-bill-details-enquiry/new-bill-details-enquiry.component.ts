import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { PurchService } from 'src/app/services/purch/purch.service';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';

@Component({
  selector: 'app-new-bill-details-enquiry',
  templateUrl: './new-bill-details-enquiry.component.html',
  styleUrls: ['./new-bill-details-enquiry.component.css']
})
export class NewBillDetailsEnquiryComponent implements OnInit {
  party_condition = `par_partytype = 'S' AND (par_closedate IS NULL OR par_closedate = '01/JAN/2050')`
  suppBillNo = ''
  billTypeList: any
  rDisable = false
  bDisable = true
  newBillDetailsEnquiry = new FormGroup({
    matcode: new FormControl<string[] | null>({value:[],disabled:true}),
    suppbilldt: new FormControl({ value: '', disabled: true }),
    partycode: new FormControl<string[]>([], Validators.required),
    ser: new FormControl({ value: '', disabled: true }),
    coy: new FormControl({ value: '', disabled: true }),
    bldgcode: new FormControl({ value: '', disabled: true }),
    billtype: new FormControl({ value: '', disabled: true }),
    suppbillno: new FormControl<string[]>([], Validators.required),
    amount: new FormControl({ value: '', disabled: true }),
    retention: new FormControl({ value: '', disabled: true }),
    tdsperc: new FormControl({ value: '', disabled: true }),
    tdsamount: new FormControl({ value: '', disabled: true }),
    advanceadj: new FormControl({ value: '', disabled: true }),
    narration: new FormControl({ value: '', disabled: true }),
    matgroup: new FormControl({ value: '', disabled: true }),
    uom: new FormControl({ value: '', disabled: true }),
    rate: new FormControl({ value: '', disabled: true }),
    quantity: new FormControl({ value: '', disabled: true }),
    authdate: new FormControl({ value: '', disabled: true }),
    authnum: new FormControl({ value: '', disabled: true }),
    chequeno: new FormControl({ value: '', disabled: true }),
    paiddate: new FormControl({ value: '', disabled: true }),
    bankcode: new FormControl({ value: '', disabled: true }),
    paidamt: new FormControl({ value: '', disabled: true }),
    ceser: new FormControl({ value: '', disabled: true }),
    debsocyn: new FormControl({ value: '', disabled: true }),
    gstno: new FormControl({ value: '', disabled: true }),
    state: new FormControl({ value: '', disabled: true }),
    itemDetailBreakUp: new FormArray([this.itemDetailInitRows()]),
    debitNoteDetail: new FormArray([this.debitNoteInitRows()])
  });

  itemDetailInitRows() {
    return this.fb.group({
      amount: new FormControl<string>({ value: '0', disabled: true }),
      cgstamt: new FormControl<string>({ value: '0', disabled: true }),
      cgstperc: new FormControl<string>({ value: '0', disabled: true }),
      discountamt: new FormControl<string>({ value: '0', disabled: true }),
      fotoamt: new FormControl<string>({ value: '0', disabled: true }),
      hsncode: new FormControl<string | null>(null),
      hsndesc: new FormControl<string>({ value: '', disabled: true }),
      igstamt: new FormControl<string>({ value: '0', disabled: true }),
      igstperc: new FormControl<string>({ value: '0', disabled: true }),
      sgstamt: new FormControl<string>({ value: '0', disabled: true }),
      sgstperc: new FormControl<string>({ value: '0', disabled: true }),
      site: new FormControl<string>({ value: '0', disabled: true }),
      taxableamt: new FormControl<string>({ value: '0', disabled: true }),
      ugstamt: new FormControl<string>({ value: '0', disabled: true }),
      ugstperc: new FormControl<string>({ value: '0', disabled: true }),
    });
  }
  debitNoteInitRows() {
    return this.fb.group({
      partycode: new FormControl<string>({ value: '', disabled: true }),
      transer: new FormControl<string>({ value: '', disabled: true }),
      amount: new FormControl<string | null>({ value: null, disabled: true }),
      tdsamount: new FormControl<string | null>({ value: null, disabled: true }),
      date: new FormControl<Date | null>({ value: null, disabled: true }),
      quantity: new FormControl<string | null>({ value: null, disabled: true }),
    });
  }

  get itemBreakUpFormArr() {
    return this.newBillDetailsEnquiry.get("itemDetailBreakUp") as FormArray;
  }
  get debitNoteFormArr() {
    return this.newBillDetailsEnquiry.get("debitNoteDetail") as FormArray;
  }

  loaderToggle: boolean = false;
  formName!: string;

  constructor(
    private toastr: ToasterapiService,
    private _commonReport: CommonReportsService,
    private _service: ServiceService,
    private enqService: PurchService,
    private fb: FormBuilder,
    private rendered: Renderer2,
    private dataEntry: DataEntryService
  ) { }

  ngOnInit(): void {
    this.getBillType()
    this.newBillDetailsEnquiry.get('partycode')?.valueChanges.subscribe({
      next: (res: any) => {
        if (res) {
          let party = res[0][0];
          this.suppBillNo= `PBLH_PARTYCODE='${party}'`;
        }
      },
    })
  }

  setBillType() {
    let billVal = this.newBillDetailsEnquiry.controls['billtype'];
    this.billTypeList.filter((val: any) => {
      val.id?.trim() == billVal.value?.trim() && billVal.patchValue(val.name?.trim())
    });
  }

  getBillType() {
    this.dataEntry.getBillTypeList().subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.billTypeList = res?.data;
        }
      },
    });
  }
  resetFormArray() {
    this.newBillDetailsEnquiry.controls.itemDetailBreakUp.clear()
    this.itemBreakUpFormArr.push(this.itemDetailInitRows())
    this.newBillDetailsEnquiry.controls.debitNoteDetail.clear()
    this.debitNoteFormArr.push(this.debitNoteInitRows())
    this.rDisable=false;this.bDisable=true
  }


  retrieve() {
    if (this.newBillDetailsEnquiry.valid) {
      let partycode: any = this.newBillDetailsEnquiry.value?.partycode, suppbillno: any = this.newBillDetailsEnquiry.value?.suppbillno;
      this.loaderToggle = true;
      (this.newBillDetailsEnquiry.get('partycode')?.value?.length && this.newBillDetailsEnquiry.get('suppbillno')?.value?.length) &&
        this.enqService.fetchNewBillDetails(`${partycode[0][0]}`, `${suppbillno[0][0]}`).pipe(take(1),finalize(()=>{
          this.loaderToggle=false
        })).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.newBillDetailsEnquiry.get('partycode')?.disable()
              this.newBillDetailsEnquiry.get('suppbillno')?.disable()
              this.newBillDetailsEnquiry.patchValue({ ...res.data.pbillhResponseBean, ...res.data.pbillhResponseBean.pbilldResponseBean, ...res.data.pbillhResponseBean.partyResponseBean, ...res.data.pbillhResponseBean.addressResponseBean })
              for (let i = 0; i < res.data.pbillhResponseBean.pbillvatResponseBean?.length; i++) {
                res.data.pbillhResponseBean.pbillvatResponseBean?.length - 1 == i ? '' : this.itemBreakUpFormArr.push(this.itemDetailInitRows())
                this.newBillDetailsEnquiry.controls.itemDetailBreakUp.patchValue(res.data.pbillhResponseBean.pbillvatResponseBean)
              }
              res.data.dbnotehResponseBeanList.length && res.data.pbillhResponseBean.pbillvatResponseBean.forEach((element: any, index: any) => {
                res.data.pbillhResponseBean.pbillvatResponseBean?.length - 1 == index ? '' : this.debitNoteFormArr.push(this.debitNoteInitRows())
                this.newBillDetailsEnquiry.controls.debitNoteDetail.patchValue(res.data.dbnotehResponseBeanList,)
                this.newBillDetailsEnquiry.controls.debitNoteDetail.patchValue(res.data.dbnotehResponseBeanList[0].dbnotedResponses)
              });
              this.setBillType()
              this.rDisable=true;this.bDisable=false
            }
            else {
              this.newBillDetailsEnquiry
            }
          }
        })
    }
    else {
      this.newBillDetailsEnquiry.markAllAsTouched()
    }
  }
  back() {
    this.newBillDetailsEnquiry.get('partycode')?.enable()
    this.newBillDetailsEnquiry.get('suppbillno')?.enable()
    this.newBillDetailsEnquiry.reset()
    this.rendered.selectRootElement("#partyCode")?.focus()
    this.resetFormArray()
 }

}
