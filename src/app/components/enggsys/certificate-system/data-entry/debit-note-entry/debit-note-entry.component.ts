import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ToastrService } from 'ngx-toastr';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as constant from '../../../../../../constants/constant';
import * as moment from 'moment';
import { CertificateService } from 'src/app/services/enggsys/certificate.service';
import { finalize, take } from 'rxjs';
import { DataEntryService } from 'src/app/services/enggsys/data-entry.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-debit-note-entry',
  templateUrl: './debit-note-entry.component.html',
  styleUrls: ['./debit-note-entry.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DebitNoteEntryComponent implements OnInit {
  debitNoteDetails: boolean = false;
  cdbnotedRequestBean : any =[];
  disableButtons = [false, false, true, true, false];
  loaderToggle: boolean = false;
  contractBillCondition = '';
  initialFormValue : any;
  showTable: boolean = false;
  total: number = 0;
  totalFoto: number = 0;
  totalCgst: number = 0;
  totalSgst: number = 0;
  totalIgst: number = 0;
  totalUgst: number = 0;
  isPartyGST: boolean = false;
  isDataRetrieved: boolean = false;
  constructor(
    private toastr: ToastrService,
    private certificateService: CertificateService,
    private dataEntryService: DataEntryService,
    private fb: FormBuilder,
    private el: ElementRef,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {}

  ngOnInit(): void {
    this.focusInputField('dbnote123');
    this.recIdChanges();
    this.billNoChanges();
    this.debitNoteSerChanges();
    this.initialFormValue = this.contractDebitNoteEntryForm?.value
   
  }

  contractDebitNoteEntryForm = new FormGroup({
    dbnoteser: new FormControl<string[]>([], Validators.required),
    date: new FormControl(moment(), Validators.required),
    party: new FormControl<string>('E'),
    partyTypeName: new FormControl<string>('Engg Contractor'),
    contract: new FormControl<string[]>([], Validators.required),
    contbillno: new FormControl<string[]>([], Validators.required),
    partycode: new FormControl<string>({ value: '', disabled: true }),
    partyName: new FormControl<string>({ value: '', disabled: true }),
    contbilldt: new FormControl<string>({ value: '', disabled: true }),
    billtype: new FormControl<string>({ value: '', disabled: true }),
    amount: new FormControl<string>('', Validators.required),
    bldgcode:new FormControl<string>(''),
    tdsperc: new FormControl<string>('', Validators.maxLength(4)),
    tdsamount: new FormControl<string>('', Validators.maxLength(12)),
    coy:new FormControl<string>(''),
    prop: new FormControl<string>(''),
    project: new FormControl<string>(''),
    coyName:new FormControl<string>(''),
    bldgName: new FormControl<string>(''),
    narration: new FormControl<string>(''),
    workcode:new FormControl<string>(''),
    workName:new FormControl<string>(''),
    description1: new FormControl<string>(''),
    description2: new FormControl<string>(''),
    description3: new FormControl<string>(''),
    description4: new FormControl<string>(''),
    description5:new FormControl<string>(''),  
    itemsDebitNoteWiseArray: new FormArray([
      this.fb.group({
        lineno: new FormControl<string | null>('1'),
        saccode: new FormControl<string>(''),
        sacdesc: new FormControl<string>(''),
        discountamt: new FormControl<string>('0.00'),
        fotoamt: new FormControl<string>('0.00'),
        uom: new FormControl<string>('', Validators.maxLength(10)),
        quantity: new FormControl('0.00', Validators.maxLength(10)),
        rate: new FormControl<string>('', Validators.maxLength(10)),
        amount: new FormControl<string>('0.00'),
        sgstperc: new FormControl<string>('0.00'),
        sgstamt: new FormControl<string>('0'),
        taxableamt: new FormControl<string>('0.00'),
        ugstamt: new FormControl<string>('0'),
        ugstperc: new FormControl<string>('0.00'),
        vatamount: new FormControl<string>('0'),
        vatpercent: new FormControl<string>('0.00'),
        cgstperc: new FormControl<string>('0.00'),
        cgstamt: new FormControl<string>('0'),
        igstperc: new FormControl<string>('0.00'),
        igstamt: new FormControl<string>('0'),
        dbnoteser: new FormControl<string>(''),
      }),
    ]),
  });

  get itemBreakUpFormArr() {
    return this.contractDebitNoteEntryForm.get(
      'itemsDebitNoteWiseArray'
    ) as FormArray;
  }

  itemDetailInitRows() {
    return this.fb.group({
      saccode: new FormControl<string>(''),
      sacdesc: new FormControl<string>(''),
      discountamt: new FormControl<string>('0.00'),
      fotoamt: new FormControl<string>('0.00'),
      uom: new FormControl<string>('', Validators.maxLength(10)),
      quantity: new FormControl('0.00', Validators.maxLength(10)),
      rate: new FormControl<string>('', Validators.maxLength(10)),
      amount: new FormControl<string>('0.00'),
      sgstperc: new FormControl<string>('0.00'),
      sgstamt: new FormControl<string>('0'),
      taxableamt: new FormControl<string>('0.00'),
      ugstamt: new FormControl<string>('0'),
      ugstperc: new FormControl<string>('0.00'),
      vatamount: new FormControl<string>('0'),
      vatpercent: new FormControl<string>('0.00'),
      cgstperc: new FormControl<string>('0.00'),
      cgstamt: new FormControl<string>('0'),
      igstperc: new FormControl<string>('0.00'),
      igstamt: new FormControl<string>('0'),
      dbnoteser: new FormControl<string>(''),
    });
  }

  recIdChanges() {
    let mgc = this.contractDebitNoteEntryForm?.get('contract');
    let mc = this.contractDebitNoteEntryForm?.get('contbillno');
    let partyCode = this.contractDebitNoteEntryForm?.get('partycode');
    let partyName = this.contractDebitNoteEntryForm?.get('partyName');
    mgc?.valueChanges.subscribe((val: any) => {
      if(!this.isDataRetrieved){
        this.contractBillCondition = "";
        mc?.setValue(null);
        partyName?.setValue(null);
        partyCode?.setValue(null);
        this.fetchPartyCodeByRecId();
      } 
    });
  }

  debitNoteSerChanges(){
    let ser = this.contractDebitNoteEntryForm?.get('dbnoteser');
    ser?.valueChanges.subscribe((val: any) => {
      val && val instanceof Object ? this.disableButtons =  [true, false, true, true, false] : this.disableButtons = [false, false, true, true, false] 
    });
  }

  billNoChanges(){
    let coy = this.contractDebitNoteEntryForm?.get('coy');
    let coyName = this.contractDebitNoteEntryForm?.get('coyName');
    let bldgcode = this.contractDebitNoteEntryForm?.get('bldgcode');
    let bldgName = this.contractDebitNoteEntryForm?.get('bldgName');
    let billtype = this.contractDebitNoteEntryForm?.get('billtype');
    let billno = this.contractDebitNoteEntryForm?.get('contbillno');
    let contbilldt = this.contractDebitNoteEntryForm?.get('contbilldt');
    billno?.valueChanges.subscribe((val: any) => {
      console.log(this.isDataRetrieved)
      if(!this.isDataRetrieved){
        coy?.setValue(null);
        coyName?.setValue(null);
        bldgcode?.setValue(null);
        bldgName?.setValue(null);
        contbilldt?.setValue(null);
        this.retrieveBillDetailsByRecIdAndBillNo();
      }
    });
  }

  focusInputField(id: any) {
    setTimeout(() => {
      let focusElement3 = document.getElementById(id) as HTMLElement;
      focusElement3 && focusElement3?.focus();
    }, 100);
  }

  fetchPartyCodeByRecId() {
    if(this.contractDebitNoteEntryForm?.controls.contract?.valid){
      let recId  = this.contractDebitNoteEntryForm?.controls.contract?.value
      ? this.contractDebitNoteEntryForm?.controls.contract.value![0].trim()
      : '';
      this.certificateService
      .getPartyCodetByRecId(recId)
      .pipe(
        take(1),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            res.data?.gstno ? this.isPartyGST = true : this.isPartyGST = false;
            this.contractDebitNoteEntryForm?.controls.partycode.setValue(
              res.data?.partycode
            );
            this.contractDebitNoteEntryForm?.controls.partyName.setValue(
              res.data?.partyName
            );
            this.contractBillCondition = `cblh_contract = '${
             recId
            }' and cblh_partycode = '${res.data?.partycode?.trim()}'`;
          }
        },
      });
    }
    
  }
  validateDebitNoteDate(id: any, event: any) {
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = '';
      this.toastr.error('Invalid Contract Debit Note Date');
    } else {
      if (event.target.value > moment()) {
        this.toastr.error('Debit Note Date cannot be greater than today');
        this.contractDebitNoteEntryForm?.controls.date?.setValue(moment());
      }
    }
  }

  handleAddOrRetrieveClick(isRetrieve: boolean) {
  
    if(isRetrieve){
      this.retrieveDebitNoteBySer();
    }
    else{
      this.contractDebitNoteEntryForm?.controls.dbnoteser?.disable();
      this.contractDebitNoteEntryForm?.controls.date?.disable();
      this.debitNoteDetails = true;
      this.focusInputField('contract1234');
      this.isDataRetrieved = false;
      this.disableButtons = [true, true, false, false, true];
      this.itemBreakUpFormArr.push(this.itemDetailInitRows());
      this.showTable=true
    }
   
  }

  createPayload(isAdd: boolean){
    this.cdbnotedRequestBean = [];
    if(isAdd){
       for(var i = 0; i < this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.value?.length; i++){
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.value[
          i
        ].lineno = `${i + 1}`;
        this.cdbnotedRequestBean.push(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.value[
          i
        ]);
       }   
    }
    else{
      this.cdbnotedRequestBean.push(this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.value)
    }
    let payload = {
      amount: this.contractDebitNoteEntryForm?.controls.amount?.value,
      billtype:  this.contractDebitNoteEntryForm?.controls.billtype?.value,
      bldgcode: this.contractDebitNoteEntryForm?.controls.bldgcode?.value,
      contbilldt: this.contractDebitNoteEntryForm?.controls.contbilldt?.value,
      contbillno: this.contractDebitNoteEntryForm?.controls.contbillno?.value![0].trim(),
      contract: this.contractDebitNoteEntryForm?.controls.contract?.value![0].trim(),
      coy : this.contractDebitNoteEntryForm?.controls.coy?.value,
      date: this.contractDebitNoteEntryForm?.controls.date?.value?.format("DD/MM/YYYY"),
      prop:  this.contractDebitNoteEntryForm?.controls.prop?.value,
      description1: this.contractDebitNoteEntryForm?.controls.description1?.value,
      description2: this.contractDebitNoteEntryForm?.controls.description2?.value,
      description3: this.contractDebitNoteEntryForm?.controls.description3?.value,
      description4: this.contractDebitNoteEntryForm?.controls.description4?.value,
      description5: this.contractDebitNoteEntryForm?.controls.description5?.value,
      narration:  this.contractDebitNoteEntryForm?.controls.narration?.value,
      project: this.contractDebitNoteEntryForm?.controls.project?.value,
      tdsamount : parseFloat(this.contractDebitNoteEntryForm?.controls.tdsamount?.value!),
      tdsperc : parseFloat(this.contractDebitNoteEntryForm?.controls.tdsperc?.value!),
      workcode: this.contractDebitNoteEntryForm?.controls.workcode?.value,
      partycode: this.contractDebitNoteEntryForm?.controls.partycode?.value,
      partytype: this.contractDebitNoteEntryForm?.controls.party?.value,
      cdbnotedRequestBean: this.cdbnotedRequestBean
    }
    return payload;
  }

  

  setContractBillDetails(response: any){
    this.showTable = true;
    this.contractDebitNoteEntryForm?.patchValue({
      coy: response?.data?.coy,
      prop: response?.data?.prop,
      coyName: response?.coyName,
      billtype: response?.data?.billtype,
      contbilldt:response?.data?.contbilldt,
      workcode: response?.data?.workcode,
      workName: response?.workName,
      partyName: response?.partyName,
      bldgcode: response?.data?.bldgcode,
      bldgName: response?.bldgName,
      project: response?.data.project
    })
    let billDetailData =  response?.data?.cbilldResponseBean
    for (var i = 0; i < billDetailData?.length; i++) {
      billDetailData?.length - 1 == i
        ? ''
        : this.itemBreakUpFormArr.push(this.itemDetailInitRows());
        if(!this.isPartyGST){
          billDetailData[i].cgstperc = '0.00';
        billDetailData[i].sgstperc = '0.00';
        billDetailData[i].igstperc = '0.00';
        billDetailData[i].ugstperc = '0.00';
        }
        billDetailData[i].amount =  '0.00';
        billDetailData[i].taxableamt = '0.00';
        billDetailData[i].cgstamt = '0.00';
        billDetailData[i].sgstamt = '0.00';
        billDetailData[i].igstamt = '0.00';
        billDetailData[i].ugstamt = '0.00';
        billDetailData[i].fotoamt = '0.00';
        billDetailData[i].quantity = '0.00';
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.patchValue(
        billDetailData
      );
    }
    this.enableDisabledTDSFields(response?.data);
    this.focusInputField('amount123124');
  }


  retrieveBillDetailsByRecIdAndBillNo() {
    let recId  = this.contractDebitNoteEntryForm?.controls.contract?.value
      ? this.contractDebitNoteEntryForm?.controls.contract.getRawValue()![0].trim()
      : '';
    let billNo = this.contractDebitNoteEntryForm?.controls.contbillno?.value
    ? this.contractDebitNoteEntryForm?.controls.contbillno.getRawValue()![0].trim()
    : '';
    if(this.contractDebitNoteEntryForm?.controls.contract?.valid && this.contractDebitNoteEntryForm?.controls.contbillno?.valid){
      this.loaderToggle = true;
      this.dataEntryService
      .fetchContratcBillByRecIdAndBillNo(recId, billNo)
      .pipe(
        take(1),
        finalize(() => {this.loaderToggle = false})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
             this.setContractBillDetails(res.data);
             res?.message ? this.toastr.info(res.message) : () => {};
          }
        },
      });
    }}


  addContractDebitNote(){
    let payload = this.createPayload(true);
    console.log("Payload: ", payload);
    if (this.saveValidationCheck() && this.contractDebitNoteEntryForm.valid) {
    this.loaderToggle = true;
    this.dataEntryService
    .addContractDebitNote(payload)
    .pipe(
      take(1),
      finalize(() => {this.loaderToggle = false})
    )
    .subscribe({
      next: (res: any) => {
        if (res.status) {
          this.openDialog(
            constant.ErrorDialog_Title,
            false,
            'info',
            res.message
          );
          this.dialogRef.afterClosed().subscribe((res: any) => {
              this.back();
          });
          
        }
      },
    });
  }
  }

  retrieveDebitNoteBySer(){
    if(this.contractDebitNoteEntryForm?.controls.dbnoteser?.valid && this.contractDebitNoteEntryForm?.controls.date?.valid){
      let ser  = this.contractDebitNoteEntryForm?.controls.dbnoteser?.value
      ? this.contractDebitNoteEntryForm?.controls.dbnoteser.value![0].trim()
      : '';
      this.loaderToggle = true;
      this.dataEntryService
      .fetchContractDebitNoteBySer(ser)
      .pipe(
        take(1),
        finalize(() => {this.loaderToggle = false})
      )
      .subscribe({
        next: (res: any) => {
          if(res.status){
            this.isDataRetrieved = true;
            this.setRetrievedData(res?.data);
            this.focusInputField('amount123124')
            this.disableButtons = [true, true,false, false, true];
          }
          else{
            if(res?.extraData != undefined){
              if(res?.extraData){
                this.focusInputField('amount123124');
              }
              else{
                this.contractDebitNoteEntryForm?.controls?.amount.disable();
                this.focusInputField('tdsperc123');
              }
              this.isDataRetrieved = true;
              this.setRetrievedData(res?.data);
  
              this.disableButtons = [true, true, !res?.extraData, false, true];
            }
            this.toastr.error(res?.message)
          }
        },
      });
    }
    else{
      this.contractDebitNoteEntryForm?.markAllAsTouched();
      this.toastr.error("Please Fill All Fields Properly")
    }
  
  }


  setRetrievedData(response: any){
    this.showTable = true;
    this.debitNoteDetails = true;
      this.contractDebitNoteEntryForm.controls.contract?.disable();
      this.contractDebitNoteEntryForm.controls.dbnoteser?.disable();
      this.contractDebitNoteEntryForm.controls.date?.disable();
    this.contractDebitNoteEntryForm.controls.contbillno?.disable();
    this.contractDebitNoteEntryForm.patchValue({
      amount: response?.data.amount.toFixed(2),
      coy: response?.data.coy,
      billtype: response?.data.billtype,
      bldgcode: response?.data.bldgcode,
      date: moment(response?.data.date),
      narration: response?.data.narration,
      tdsamount: response?.data.tdsamount,
      tdsperc: response?.data.tdsperc,
      workcode: response?.data.workcode,
      coyName: response?.coyName,
      workName: response?.workName,
      partyName: response?.partyName,
      bldgName: response?.bldgName,
      partycode: response?.data.partycode,
      contbilldt: response?.data.contbilldt,
      description1: response?.data?.description1,
      description2: response?.data?.description2,
      description3: response?.data?.description3,
      description4: response?.data?.description4,
      description5: response?.data?.description5,

    })
    this.contractDebitNoteEntryForm.controls.contract?.setValue(response?.data.contract, { emitEvent: false });
    this.contractDebitNoteEntryForm.controls.contbillno?.setValue(response?.data.contbillno, { emitEvent: false });
  
    let debitDetailData =  response?.data?.cdbnotedResponses
    for (var i = 0; i < debitDetailData?.length; i++) {
      debitDetailData?.length - 1 == i
      ? ''
      : this.itemBreakUpFormArr.push(this.itemDetailInitRows());
    this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.patchValue(
      debitDetailData
    );
    }
  }

    isDebitAmountValid() {
      let recId  = this.contractDebitNoteEntryForm?.controls.contract?.value
        ? this.contractDebitNoteEntryForm?.controls.contract.value![0].trim()
        : '';
      let billNo = this.contractDebitNoteEntryForm?.controls.contbillno?.value
      ? this.contractDebitNoteEntryForm?.controls.contbillno.value![0].trim()
      : '';
      let dnAmount = parseFloat(this.contractDebitNoteEntryForm?.controls?.amount?.value!)

        this.certificateService
        .checkIsDebitAmountValid(recId, billNo,dnAmount)
        .pipe(
          take(1),
          finalize(() => {})
        )
        .subscribe({
          next: (res: any) => {
            if (!res.status) {
              this.toastr.error(res.message);
              this.contractDebitNoteEntryForm?.controls?.amount?.setValue('')
              this.focusInputField('amount123124');
            }
            else{
              this.contractDebitNoteEntryForm?.controls?.amount?.setValue(dnAmount ? dnAmount.toFixed(2) : '');
              this.contractDebitNoteEntryForm?.controls.tdsperc?.enable();
              this.contractDebitNoteEntryForm?.controls.tdsamount?.enable();
              this.calculateTDS();
            }
          },
        });
      }

  enableDisabledTDSFields(data: any){
    let billDtMonth = moment(this.contractDebitNoteEntryForm?.controls.contbilldt?.value).format('D');
    let debitDTMonth = moment(this.contractDebitNoteEntryForm?.controls.date?.value).format('M');
    if(data?.tdscertno || (billDtMonth != debitDTMonth)){
      this.contractDebitNoteEntryForm?.controls?.tdsamount?.disable();
      
      this.contractDebitNoteEntryForm?.controls?.tdsperc?.disable();
      this.contractDebitNoteEntryForm?.controls?.tdsperc?.setValue('0.00');
      this.contractDebitNoteEntryForm?.controls?.tdsperc?.setValue('0');
    }
    else{
      this.contractDebitNoteEntryForm?.controls?.tdsperc?.setValue(data?.tdsperc);
    }
  }

  calculateTDS(){
    let tdsper = parseFloat(this.contractDebitNoteEntryForm?.controls.tdsperc?.value! ? this.contractDebitNoteEntryForm?.controls.tdsperc?.value! : '0');
    let dnAmount = parseFloat(this.contractDebitNoteEntryForm?.controls?.amount?.value! ? this.contractDebitNoteEntryForm?.controls?.amount?.value! : '0');
    let tdsAmount = dnAmount * tdsper/100;
    this.contractDebitNoteEntryForm?.controls?.tdsamount.setValue(Math.round(tdsAmount).toString());

  }

  triggerCalculateGst(index: number) {
    this.calcGST(
      'CGST',
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['cgstperc'],
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['cgstamt'],
      'input[id="'+"cell"+index+-"8" + '"]' 
    );
    this.calcGST(
      'SGST',
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['sgstperc'],
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['sgstamt'],
      'input[id="'+"cell"+index+-"10" + '"]' 
    );
    this.calcGST(
      'IGST',
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['igstperc'],
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['igstamt'],
      'input[id="'+"cell"+index+-"12" + '"]' 
    );
    this.calcGST(
      'UGST',
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['ugstperc'],
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ].get('taxableamt')?.value,
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]?.controls['ugstamt'],
      'input[id="'+"cell"+index+-"14" + '"]' 
    );
  }

  checkIsItemAmountValid(index:any){
    let amount = this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.controls[index]?.get('amount')?.value 
    ? parseFloat(this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.controls[index]?.get('amount')?.value!) : 0.00;
    let dnAmount = this.contractDebitNoteEntryForm?.controls.amount?.value ? parseFloat(this.contractDebitNoteEntryForm?.controls.amount?.value) : 0.00;
    if(amount > dnAmount){
      this.toastr.error("Enter Item Amount equal to or less than Contract Debit Note Amount.");
      this.el.nativeElement
      .querySelector('input[id="'+"cell"+index+-"5" + '"]')
      ?.focus();
      this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.controls[index]?.get('amount')?.setValue('');
      
    }
    else{
      this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.controls[index]?.get('amount')?.setValue(amount.toFixed(2));
      this.calcTaxableAmt(index, amount,
        parseFloat(this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray?.controls[index]?.get('discountamt')?.value!) )
    }
  }

  checkIsDNAmountValid() {
    let dnAmount = this.contractDebitNoteEntryForm.get('amount')?.value ? parseFloat(this.contractDebitNoteEntryForm.get('amount')?.value!) : 0.00;
    if (
      dnAmount == 0
    ) {
      this.toastr.error('Debit Amount cannot be less than or equal to zero...');
      this.focusInputField('amount123124');
      this.contractDebitNoteEntryForm.patchValue({
        amount: '',
      });
    } else {
      this.isDebitAmountValid();
    }
  }


  setAmount(index: any) {
    let dnAmount  =  this.contractDebitNoteEntryForm.controls.amount?.value ? parseFloat( this.contractDebitNoteEntryForm.controls.amount?.value!) : 0.00;
    let taxableAmnt =  this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('taxableamt')?.value ? parseFloat( this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('taxableamt')?.value!) : 0.00; 
    let amount = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value ? parseFloat( this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value!) : 0.00; 

    let disamount = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('discountamt')?.value ? parseFloat( this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('discountamt')?.value!) : 0.00; 

    if (
      dnAmount <
      taxableAmnt
      )
    {
      this.toastr.error("Enter Taxable Amount less than or equal to Debite Note Amount");
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('taxableamt')
        ?.patchValue(
          ''
        );
        this.el.nativeElement
      .querySelector('input[id="'+"cell"+index+-"7" + '"]')
      ?.focus();

    } else {
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('amount')
        ?.patchValue(
          (
          taxableAmnt +
          disamount
          ).toFixed(2)
        );
      this.triggerCalculateGst(index);
    }
  }

  setQuantity(index: any) {
    let qty =  this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('quantity')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('quantity')?.value!) : 0.00;
    let amount = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('amount')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('amount')?.value!) : 0.00;
    let rate = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('rate')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('rate')?.value!) : 0.00;
    let discamnt = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('discountamt')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index 
    ].get('discountamt')?.value!) : 0.00;
      if (
      qty != 0
      ) {
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('amount')
          ?.patchValue(
            ( (qty * rate).toFixed(2)
          ));
      }
      this.calcTaxableAmt(index, 
        parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index 
        ].get('amount')?.value!), parseFloat( this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('discountamt')?.value!));
      this.triggerCalculateGst(index);
    
  }




  checkIsRateValid(index: any) {
    let rate = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('rate')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('rate')?.value!) : 0.00;
    let amount = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value!) : 0.00;
    let quantity = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('quantity')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('quantity')?.value!) : 0.00;

    if (
      rate > 0
    ) {
      let calcAmount = (amount * quantity);
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('amount')
        ?.patchValue(calcAmount.toFixed(2));
      if (calcAmount > 0) {
        this.calcTaxableAmt(
          index,
          this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('amount')?.value,
          this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
            index
          ].get('discountamt')?.value
        );
      } else {
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(calcAmount.toFixed(2));
      }
    }
  }

  checkValidDiscountAmount(index: any) {
    let discCellId =  'input[id="'+"cell"+index+-"6" + '"]' 
    let discountamnt = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('discountamt')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('discountamt')?.value!) : 0.00;

    let itemamnt = this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value ? parseFloat(this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
      index
    ].get('amount')?.value!) : 0.00;

    if (
      discountamnt >=
      itemamnt
    ) {
     
        this.toastr.error('Discount amount cannot be greater or equal to Item amount');
        this.el.nativeElement
        .querySelector(discCellId)
        ?.focus();
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
        index
      ]
        .get('discountamt')
        ?.patchValue('');
       
    } else {
      this.calcTaxableAmt(
        index,
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('amount')?.value,
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ].get('discountamt')?.value
      );
    }
  }

  calcTaxableAmt(index: number, itemAmount: any, discount: any) {
    if (parseFloat(discount) >= 0 && parseFloat(itemAmount) > 0) {
      if (parseFloat(discount) < parseFloat(itemAmount)) {
        let taxAmount = (Number(itemAmount) - Number(discount)).toFixed(2);
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(`${taxAmount}`);
        // whenever itemchange calculate gst
        this.triggerCalculateGst(index);
      } else {
        let taxAmount = (Number(itemAmount) - Number(0)).toFixed(2);
        this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls[
          index
        ]
          .get('taxableamt')
          ?.patchValue(`${taxAmount}`);
        this.toastr.error(
          'discount cannot be greater than or equal to item amount'
        );
        this.triggerCalculateGst(index);
      }
    }
  }

  saveValidationCheck() {
    let total: number = 0;
    let totalDifference: number = 0;
    for (
      let i = 0;
      i <
      this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.value.length;
      i++
    ) {
      if(!this.isPartyGST){
       // this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.controls?.cgstperc.setValue('0.00');
        
      }
      total +=
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.taxableamt}`
        ) +
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.fotoamt}`
        ) +
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.cgstamt}`
        ) +
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.sgstamt}`
        ) +
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.igstamt}`
        ) +
        parseFloat(
          `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.ugstamt}`
        );
      this.totalFoto += parseFloat(
        `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.fotoamt}`
      );
      this.totalCgst += parseFloat(
        `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.cgstamt}`
      );
      this.totalSgst += parseFloat(
        `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.sgstamt}`
      );
      this.totalIgst += parseFloat(
        `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.igstamt}`
      );
      this.totalUgst += parseFloat(
        `${this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray?.value[i]?.ugstamt}`
      );
    }
    this.total = Number(total.toFixed(2));
    totalDifference =
      parseFloat(`${this.contractDebitNoteEntryForm.get('amount')?.value}`) - total;

    if (Math.round(totalDifference) != 0) {
      let erroMessage =
        'Total of Taxable Amt + FOTO Amt + GST Amt in Tax details Grid = ' +
        this.total +
        ' not tallying with Main Debit Note Amt = ' +
        this.contractDebitNoteEntryForm.controls.amount.value +
        '....please enter correct details....';
        this.openDialog(
          constant.ErrorDialog_Title,
          false,
          'error',
          erroMessage
        );
        this.dialogRef.afterClosed().subscribe((res: any) => {
          this.focusInputField('amount123124');
        });
      return false;
    } else {
      return true;
    }
  }


  openDialog(
    titleVal: any,
    confirmationDialog: boolean,
    type: string | null,
    msg: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        confirmationDialog: confirmationDialog,
        title: titleVal,
        message: msg,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
  }


  calcGST(
    message: string,
    formControlSource: FormControl,
    textableAmt: any,
    formControl: FormControl,
    id: string
  ) {
    if (formControlSource.value <= 100) {
      let roundVal: any =
        parseFloat(textableAmt) * (parseFloat(formControlSource.value) / 100);
      formControl.setValue(parseFloat(roundVal).toFixed(2));
    } else {
      formControlSource.setValue(0), formControl.setValue(0);
      this.el.nativeElement
        .querySelector(id)
        ?.focus(),
      this.toastr.error(`${message} % cannot be greater than 100`);
    }
  }

  checkIsFotoAmountValid(index: any) {
    let fotoamt = parseFloat(this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray.controls[index].controls.fotoamt?.value!);
    let dnAmount = parseFloat(this.contractDebitNoteEntryForm?.controls?.amount?.value!);
    if(fotoamt > dnAmount){
      let fotoAmntCell =  'input[id="'+"cell"+index+-"1" + '"]' 
      this.toastr.error("Enter Freight/Octroi/Transport/Other Chgs. Amount less than or equal to Debit Note  Amount")
      this.el.nativeElement
        .querySelector(fotoAmntCell)
        ?.focus(),
      this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray.controls[index].controls.fotoamt.setValue('');
    } 
    else{
      this.contractDebitNoteEntryForm?.controls.itemsDebitNoteWiseArray.controls[index].controls.fotoamt.setValue(fotoamt.toFixed(2));
    }
  }

  handleBackClick(){
    this.openDialog(
      constant.ErrorDialog_Title,
      true,
      'question',
     "Data not saved. Do you want to exit"
    );
    this.dialogRef.afterClosed().subscribe((res: any) => {
      if(res){
        this.back();
      }
      else{
        this.focusInputField('contract1234');
      }
    });
  }
  back(){
  
    this.contractDebitNoteEntryForm?.enable();
    
    this.focusInputField('dbnote123');
    this.isDataRetrieved = false;
    this.debitNoteDetails = false;
    this.disableButtons = [false, false, true, true, false];
    this.showTable = false;
    this.debitNoteDetails = false;
    this.contractDebitNoteEntryForm?.reset();
    this.contractDebitNoteEntryForm?.controls.date?.setValue(moment())
    this.contractDebitNoteEntryForm?.controls.party?.setValue("E")
    this.contractDebitNoteEntryForm?.controls.partyTypeName?.setValue("Engg Contractor")
    this.contractDebitNoteEntryForm.controls.itemsDebitNoteWiseArray.clear();
    this.itemBreakUpFormArr.push(this.itemDetailInitRows());
  }
}
