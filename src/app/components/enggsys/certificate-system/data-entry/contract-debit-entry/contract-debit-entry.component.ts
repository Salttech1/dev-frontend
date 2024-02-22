import { Component, ElementRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {finalize, take } from 'rxjs';
import { CertificateService } from 'src/app/services/enggsys/certificate.service';
import { DataEntryService } from 'src/app/services/enggsys/data-entry.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-contract-debit-entry',
  templateUrl: './contract-debit-entry.component.html',
  styleUrls: ['./contract-debit-entry.component.css'],
})
export class ContractDebitEntryComponent implements OnInit {
  disableButtonFlags = [false, false, true, true, true, false]; //Add, Retrieve , Add Row, Save, Back and Exit
  isDataRecieved: boolean = false;
  initialFormValue! : any;
  contraRecIdCondiiton: any ;
  contractDebitPayload: any =[];
  intiialDataSize: any = 0;
  deletedContractDebit: any = [];
  loaderToggle: boolean = false
  disableReverse: boolean = true;
  reverseClicked: boolean = false;
  constructor(
    private certificateService: CertificateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private el: ElementRef,
    private dataEntryService: DataEntryService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {}

  ngOnInit(): void {
    this.initialFormValue = this.contractDebitEntryForm?.value;
    console.log("Intial Form Value", this.initialFormValue)
    setTimeout(function () {
      document.getElementById('debitType123')?.focus();
    }, 100);
    this.debitTypeChange();
    this.bldgCodeChange();
    this.authNumChanges();
    this.recIdChange();
  }

  contractDebitEntryForm = new FormGroup({
    debitType: new FormControl<string[]>([], Validators.required),
    recId: new FormControl<string[]>(
      { value: [], disabled: true },
      Validators.required
    ),
    certType: new FormControl<string[]>(
      { value: [], disabled: true }
    ),
    bldgCode: new FormControl<string[]>(
      { value: [], disabled: true }
    ),
    runser: new FormControl<string[]>(
      { value: [], disabled: true }
    ),
    authnum: new FormControl<string[]>(
      { value: [], disabled: true }
    ),
    contractor: new FormControl(''),
    contractorName: new FormControl(''),
    coy: new FormControl(''),
    companyName: new FormControl(''),
    contractDebitWiseArray: new FormArray([
      this.fb.group({
        contracontract: new FormControl<string>(''),
        debitamount: new FormControl<string>(''),
        remarks: new FormControl<string>(''),
        bldgcode: new FormControl<string>(''),
        partyCode: new FormControl<string>(''),
        workCode: new FormControl<string>(''),
        debittype: new FormControl<string>(''),
        isAdd: new FormControl<boolean>(true),
        debitno: new FormControl<string>(''),
        authnum:  new FormControl<string>(''),
        runser: new FormControl<string>(''),
        certtype: new FormControl<string>(''),
        contract: new FormControl<string>(''),
        isDelete: new FormControl<boolean>(false)
      }),
    ]),
    totalAmount: new FormControl('0.00')
  });

  contractDebitDetailInitRows(isAdd: boolean) {
    return this.fb.group({
      contracontract: new FormControl<string>('',[Validators.required]),
      debitamount: new FormControl<string>('',[Validators.required,debitAmountValid()]),
      remarks: new FormControl<string>(''),
      bldgcode: new FormControl<string>(''),
      partyCode: new FormControl<string>(''),
      workCode: new FormControl<string>(''),
      debittype: new FormControl<string>(''),
      isAdd: isAdd,
      debitno: new FormControl<string>(''),
      authnum:  new FormControl<string>(''),
      runser: new FormControl<string>(''),
      certtype: new FormControl<string>(''),
      contract: new FormControl<string>(''),
      isDelete: new FormControl<boolean>(false)
    });
    
  }

  setBldgAndPartyAndWorkCode(index: any){
    console.log("in fbfb", index)
    let contracttId = this.contractDebitEntryForm.controls
    .contractDebitWiseArray.controls[index]
    .controls['contracontract']?.value![0]?.trim()
      this.certificateService
      .fetchBldgAndPartyAndWorkCodeByContractorId(contracttId)
      .pipe(
        take(1),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this. contractDebitEntryForm.controls
            .contractDebitWiseArray.controls[index].patchValue({
              bldgcode: res.data?.bldgCode,
              partyCode: res.data?.partyCode,
              workCode: res.data?.workCode,
            });
          } else {
            //this.toastr.error(res.message);
          }
        },
      });
    
  }

  setDebitAmount(index:any){
    let debitAmnt = this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.value
    if(Number(debitAmnt) >0){
      this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.setValue(
        Number(debitAmnt).toFixed(2));
    }
    
   
  }
  reverseContractDebit(){
    this.loaderToggle = true;
    this.dataEntryService
     .reverseContractDebit(
       this.createAddOrReversalPayload()
     )
     .pipe(
       take(1),
       finalize(() => {this.loaderToggle = false })
     )
     .subscribe({
       next: (res: any) => {
         if (res.status) {
           this.openDialog(
             constant.ErrorDialog_Title,
             'info',
             res.message
           );
           this.dialogRef.afterClosed().subscribe((res: any) => {
               this.back();
           });
         } else {
           this.toastr.error(res.message);
         }
       },
     });
  }

  checkIsContractDebitAuthorised(){
    let debitType = this.contractDebitEntryForm
    .get('debitType')
    ?.value![0].toString()!;
    let authnum = this.contractDebitEntryForm.get('authnum')?.value![0].toString()!;
    this.loaderToggle = true;
    this.certificateService
    .checkIsContractDebitReversal(
     debitType, authnum
    )
    .pipe(
      take(1),
      finalize(() => {this.loaderToggle = false })
    )
    .subscribe({
      next: (res: any) => {
        if (res.status) {
         
          this.fetchContractDetails(false);
          this.reverseClicked = true;
          this.disableReverse = true;
          this.disableButtonFlags = [true, true, false, false, false, true];
        } else {
          this.reverseClicked = false;
          this.disableReverse = false;
          this.toastr.error(res.message);
         
        }
      },
    });
  }

  calcTotalDebitAmount(){
    let totalAmount = 0;
    this.contractDebitWiseArray.value.forEach( (contractDebit:any) =>{
      totalAmount = totalAmount + Number(contractDebit?.debitamount)
    });
    this.contractDebitEntryForm?.controls.totalAmount.setValue(totalAmount.toFixed(2));
  }

  get contractDebitWiseArray() {
    return this.contractDebitEntryForm?.controls
      .contractDebitWiseArray as FormArray;
  }

  debitTypeChange() {
    let debitTypeControl = this.contractDebitEntryForm.get('debitType');
    let authnumControl = this.contractDebitEntryForm.get('authnum');
    let recIdControl = this.contractDebitEntryForm.get('recId');
    let certTypeControl = this.contractDebitEntryForm.get('certType');
    let bldgCodeControl = this.contractDebitEntryForm.get('bldgCode');
    let runserControl = this.contractDebitEntryForm.get('runser');
    debitTypeControl?.valueChanges.subscribe((val: any) => {
      if (val && val instanceof Object) {
        let debitType = val[0].trim();
        //Disabling and Setting Value to null
        authnumControl?.setValue(null);
        recIdControl?.setValue(null);
        certTypeControl?.setValue(null);
        bldgCodeControl?.setValue(null);
        runserControl?.setValue(null);

        authnumControl?.disable();
        recIdControl?.disable();
        certTypeControl?.disable();
        bldgCodeControl?.disable();
        runserControl?.disable();
        switch (debitType) {
          case 'A':
            bldgCodeControl?.clearValidators();
            authnumControl?.setValidators(Validators.required);
            recIdControl?.clearValidators();
            runserControl?.clearValidators();
            certTypeControl?.clearValidators();
            this.contractDebitEntryForm.updateValueAndValidity();
            authnumControl?.enable();
            this.disableReverse = false;
            break;
          case 'C':
            bldgCodeControl?.clearValidators();
            authnumControl?.clearValidators();
            recIdControl?.setValidators(Validators.required);
            runserControl?.setValidators(Validators.required);
            certTypeControl?.setValidators(Validators.required);
            this.contractDebitEntryForm.updateValueAndValidity();
            recIdControl?.enable();
            certTypeControl?.enable();
            runserControl?.enable();
            this.disableReverse = true;
            break;
          case 'M':
            bldgCodeControl?.setValidators(Validators.required);
            authnumControl?.setValidators(Validators.required);
            recIdControl?.clearValidators();
            runserControl?.clearValidators();
            certTypeControl?.clearValidators();
            this.contractDebitEntryForm.updateValueAndValidity();
            bldgCodeControl?.enable();
            this.disableReverse = true;
            break;
          default:
            console.log('In Default Case');
            break;
        }
      }
    });
  }

  authNumChanges() {
    let authnumControl = this.contractDebitEntryForm.get('authnum');
    let bldgCodeControl = this.contractDebitEntryForm.get('bldgCode');
    let coyControl = this.contractDebitEntryForm.get('coy');
    let coyNameControl = this.contractDebitEntryForm.get('companyName');
    authnumControl?.valueChanges.subscribe((val: any) => {
      coyControl?.setValue(null);
      coyNameControl?.setValue(null);

      bldgCodeControl?.setValue(null);
      if (val && val instanceof Object) {
        this.fetchBldgAndCoyByAuthNum();
      }
    });
  }

  bldgCodeChange() {
    let bldgCodeControl = this.contractDebitEntryForm.get('bldgCode');
    let coyControl = this.contractDebitEntryForm.get('coy');
    let coyNameControl = this.contractDebitEntryForm.get('companyName');

    bldgCodeControl?.valueChanges.subscribe((val: any) => {
      coyControl?.setValue(null);
      coyNameControl?.setValue(null);
      if (val && val instanceof Object) {
        this.fetchCoyByBldgCode();
      }
    });
  }

  recIdChange() {
    let recIdControl = this.contractDebitEntryForm.get('recId');
    let bldgCodeControl = this.contractDebitEntryForm.get('bldgCode');
    let coyControl = this.contractDebitEntryForm.get('coy');
    let coyNameControl = this.contractDebitEntryForm.get('companyName');
    let contractorControl = this.contractDebitEntryForm.get('contractor');
    let contractorNameControl =
      this.contractDebitEntryForm.get('contractorName');
    recIdControl?.valueChanges.subscribe((val: any) => {
      coyControl?.setValue(null);
      coyNameControl?.setValue(null);
      contractorControl?.setValue(null);
      contractorNameControl?.setValue(null);
      bldgCodeControl?.setValue(null);
      if (val && val instanceof Object) {
        this.fetchBuildingAndCoyAndContractorByRecId();
      }
    });
  }

  fetchCoyByBldgCode() {
    let bldgCode =
      this.contractDebitEntryForm.get('bldgCode')?.value instanceof Object
        ? this.contractDebitEntryForm.get('bldgCode')?.value![0][0]?.trim()
        : this.contractDebitEntryForm.get('bldgCode')?.value;
    this.certificateService
      .getCoyNameByBldgCode(bldgCode!?.toString())
      .pipe(
        take(1),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.contractDebitEntryForm.patchValue({
              coy: res.data?.coycode,
              companyName: res.data?.coyname,
            });
          } else {
            this.toastr.error(res.message);
          }
        },
      });
  }

  fetchBldgAndCoyByAuthNum() {
    let authnum = this.contractDebitEntryForm.get('authnum')?.value![0].trim();
    this.certificateService
      .getBuildingAndCoyByAuthNum(authnum!?.toString())
      .pipe(
        take(1),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.contractDebitEntryForm.patchValue({
              bldgCode: res.data?.bldgCode,
              coy: res.data?.coy,
              companyName: res.data?.coyName,
            });
          } else {
            this.toastr.error(res.message);
          }
        },
      });
  }

  fetchBuildingAndCoyAndContractorByRecId() {
    let recId = this.contractDebitEntryForm.get('recId')?.value![0].trim();
    this.certificateService
      .getBuildingAndCoyAndContractorByRecId(recId!?.toString())
      .pipe(
        take(1),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.contractDebitEntryForm.patchValue({
              bldgCode: res.data?.bldgCode,
              coy: res.data?.coy,
              companyName: res.data?.coyName,
              contractor: res.data?.contractorCode,
              contractorName: res.data?.contractorName,
            });
          } else {
            this.toastr.error(res.message);
          }
        },
      });
  }

  handleRetrieve() {
    this.fetchContractDetails(false);
  }

  handleAddClick() {
    this.fetchContractDetails(true);
  }

  setConracRecIdCondition(){
    let bldgCode =
    this.contractDebitEntryForm.get('bldgCode')?.value instanceof Object
      ? this.contractDebitEntryForm.get('bldgCode')?.value![0][0]?.trim()
      : this.contractDebitEntryForm.get('bldgCode')?.value;
      this.contraRecIdCondiiton = `contt_bldgcode = '${bldgCode}'`;
  }

  fetchContractDetails(isAdd: boolean) {
    if(this.contractDebitEntryForm?.valid){
      this.loaderToggle = true;
    this.certificateService
      .getContractDetails(
        this.generateRetrievePayload(isAdd)
      )
      .pipe(
        take(1),
        finalize(() => {this.loaderToggle = false})
      )
      .subscribe({
        next: (res: any) => {
          if (res.status) {
              this.isDataRecieved = true;
              this.disableReverse = true;
              this.disableButtonFlags = [true, true, false, false, false, true];
              this.setConracRecIdCondition();
              if(!isAdd){
                this.setRetrievedData(res.data);
                this.intiialDataSize = res.data.length;
                this.calcTotalDebitAmount();
              }
              setTimeout(() => {
                this.el.nativeElement
                .querySelector('input[id="'+"cell"+0+-"1" + '"]' )
                ?.focus()
             }, 100);  
          } else {
            this.toastr.error(res.message);
          }
        },
      });
    }
    else{
      this.toastr.error("Please fill the form properly");
      this.contractDebitEntryForm?.markAllAsTouched();
    }
  }

  ere(){
    console.log("testsing")
  }
  generateRetrievePayload(isAdd: boolean) {
    let payload = {
      debitType: this.contractDebitEntryForm
        .get('debitType')
        ?.value![0].toString()!,
      authnum: this.contractDebitEntryForm.get('authnum')?.value
        ? this.contractDebitEntryForm.get('authnum')?.value![0].toString()!
        : 'ALL',
      recId: this.contractDebitEntryForm.get('recId')?.value
        ? this.contractDebitEntryForm.get('recId')?.value![0].toString()!
        : 'ALL',
      certType: this.contractDebitEntryForm.get('certType')?.value
        ? this.contractDebitEntryForm.get('certType')?.value![0].toString()!
        : 'ALL',
      runser: this.contractDebitEntryForm.get('runser')?.value
        ? this.contractDebitEntryForm.get('runser')?.value!.toString()!
        : 'ALL',
      bldgCode: this.contractDebitEntryForm.get('bldgCode')?.value
        ? this.contractDebitEntryForm.get('bldgCode')?.value instanceof Object ? this.contractDebitEntryForm.get('bldgCode')?.value![0][0].toString()! : this.contractDebitEntryForm.get('bldgCode')?.value!.toString().toUpperCase()
        : 'ALL',
      isAdd: isAdd,
    };
    return payload;
  }

  addRow() {
    let index = this.contractDebitWiseArray.length-1;
    this.contractDebitWiseArray.push(this.contractDebitDetailInitRows(true));
    setTimeout(() => {
      this.el.nativeElement
      .querySelector('input[id="'+"cell"+(this.contractDebitWiseArray.length-1)+-"1" + '"]' )
      ?.focus()
   }, 100);
  }



  deleteRow(e : any,index: any) {
    e?.preventDefault();
    if( this.contractDebitWiseArray.length == 1){
      this.toastr.error(
        'Atleast one contract debit must be present in contract debit details window'
      )
    }
    else{
      if(index < this.intiialDataSize){
        this.contractDebitWiseArray.at(index)?.get('isDelete')?.setValue(true)
        this.deletedContractDebit.push(this.contractDebitWiseArray.at(index)?.value)
      }
      this.contractDebitWiseArray.removeAt(index);
      setTimeout(() => {
        this.el.nativeElement
        .querySelector('input[id="'+"cell"+(this.contractDebitWiseArray.length-1)+-"1" + '"]' )
        ?.focus()
     }, 100);
      this.calcTotalDebitAmount();
    }
  }

  checkIsDebitAmountValid(index: any){
    let debitAmnt = this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.value
    if(Number(debitAmnt) == 0 && debitAmnt!=""){
      this.toastr.error("Debit Amount cannot be less than or equal to zero...");
    }
    else{
      this.calcTotalDebitAmount();
      this.contractDebitEntryForm.controls.contractDebitWiseArray.controls[index].get('debitamount')?.setValue(Number(debitAmnt).toFixed(2));
    }

  }


  createUpdatePayload(){
    let updatedArr: any[] = [];
    this.contractDebitWiseArray.controls?.forEach((val) => {
      if (val.dirty || val?.getRawValue()?.isAdd) {
        updatedArr.push(val?.getRawValue());
      }
    });
    this.deletedContractDebit.forEach((val: any) =>{
      updatedArr.push(val);
    })
    updatedArr?.map((v: any) => {
      v.debitamount = parseFloat(v?.debitamount)
      v.contracontract = v?.contracontract instanceof Object ? v?.contracontract[0]?.trim() : v?.contracontract 
      v.debittype = this.contractDebitEntryForm?.controls.debitType?.value![0].trim()
      if(v?.isAdd){
        v.certtype =  this.contractDebitEntryForm?.controls.certType?.value ? this.contractDebitEntryForm?.controls.certType?.getRawValue()![0].trim() : ""
        v.authnum = this.contractDebitEntryForm?.controls.authnum?.value ? this.contractDebitEntryForm?.controls.authnum?.getRawValue()![0].trim() : ""
        v.runser = this.contractDebitEntryForm?.controls.runser?.value ? this.contractDebitEntryForm?.controls.runser?.getRawValue()! : ""
        v.contract = this.contractDebitEntryForm?.controls.recId?.value ? this.contractDebitEntryForm?.controls.recId?.getRawValue()![0].trim() : ""
      }
  
    })
    return updatedArr;
  }

  createAddOrReversalPayload(){
    let addedArr : any[] = this.contractDebitWiseArray?.value;
    addedArr?.map((v: any) => {
      v.debitamount = parseFloat(v?.debitamount)
      v.contracontract = v?.contracontract instanceof Object ? v?.contracontract[0]?.trim() : v?.contracontract 
      v.debittype = this.contractDebitEntryForm?.controls.debitType?.value![0].trim()
      v.certtype =  this.contractDebitEntryForm?.controls.certType?.value ? this.contractDebitEntryForm?.controls.certType?.getRawValue()![0].trim() : ""
      v.authnum = this.contractDebitEntryForm?.controls.authnum?.value ? this.contractDebitEntryForm?.controls.authnum?.getRawValue()![0].trim() : ""
      v.runser = this.contractDebitEntryForm?.controls.runser?.value ? this.contractDebitEntryForm?.controls.runser?.getRawValue()! : ""
      v.contract = this.contractDebitEntryForm?.controls.recId?.value ? this.contractDebitEntryForm?.controls.recId?.getRawValue()![0].trim() : ""
    })
    return addedArr;
  }

  setRetrievedData(data: any) {
    for (var i = 0; i < data?.length; i++) {
      data?.length - 1 == i
        ? ''
        : this.contractDebitWiseArray.push(this.contractDebitDetailInitRows(false));
      data[i].debitamount = data[i].debitamount.toFixed(2);
      this.contractDebitEntryForm.controls.contractDebitWiseArray.patchValue(
        data
      );
    }
    console.log(
      'FormValue: ',
      this.contractDebitEntryForm?.controls.contractDebitWiseArray?.value
    );
  }

  save(){
    if(this.contractDebitWiseArray?.valid){
      if(this.reverseClicked){
        this.reverseContractDebit();
      }
      else{
        this.intiialDataSize > 0 ? this.updateContractDebit() : this.addContractDebit()
      } 
    }
    else{
      this.toastr.error("Please Fill Form Properly")
      this.contractDebitWiseArray?.markAllAsTouched();
    }
  }

  addContractDebit(){
    this.loaderToggle = true;
    this.dataEntryService
    .addContractDebit(
      this.createAddOrReversalPayload()
    )
    .pipe(
      take(1),
      finalize(() => {this.loaderToggle = false })
    )
    .subscribe({
      next: (res: any) => {
        if (res.status) {
          this.openDialog(
            constant.ErrorDialog_Title,
            'info',
            res.message
          );
          this.dialogRef.afterClosed().subscribe((res: any) => {
              this.back();
          });
        } else {
          this.toastr.error(res.message);
        }
      },
    });
  }


  updateContractDebit(){
    this.loaderToggle = true;
   this.dataEntryService
    .updateContractDebit(
      this.createUpdatePayload()
    )
    .pipe(
      take(1),
      finalize(() => {this.loaderToggle = false })
    )
    .subscribe({
      next: (res: any) => {
        if (res.status) {
          // this.toastr.success(res.message);
          // this.back();
          this.openDialog(
            constant.ErrorDialog_Title,
            'info',
            res.message
          );
          this.dialogRef.afterClosed().subscribe((res: any) => {
              this.back();
          });
        } else {
          this.toastr.error(res.message);
        }
      },
    });
  }

  back() {
    this.contractDebitEntryForm.reset();
    this.contractDebitEntryForm.controls.contractDebitWiseArray.clear();
    this.contractDebitWiseArray?.push( this.fb.group({
      contracontract: new FormControl<string>(''),
      authnum:  new FormControl<string>(''),
      runser: new FormControl<string>(''),
      certtype: new FormControl<string>(''),
      contract: new FormControl<string>(''),
      debitamount: new FormControl<string>(''),
      remarks: new FormControl<string>(''),
      bldgcode: new FormControl<string>(''),
      partyCode: new FormControl<string>(''),
      workCode: new FormControl<string>(''),
      debittype: new FormControl<string>(''),
      isAdd: new FormControl<boolean>(false),
      debitno: new FormControl<string>(''),
      isDelete: new FormControl<boolean>(false)
    }),)
    this.contractDebitEntryForm?.controls.bldgCode.disable();
    this.contractDebitEntryForm?.controls.certType.disable();
    this.contractDebitEntryForm?.controls.recId.disable();
    this.contractDebitEntryForm?.controls.runser.disable();
    this.contractDebitEntryForm?.controls.authnum.disable();
    setTimeout(function () {
      document.getElementById('debitType123')?.focus();
    }, 100);
    this.disableButtonFlags = [false, false, true, true, true, false]; 
    this.isDataRecieved = false;
    this.deletedContractDebit = [];
    this.intiialDataSize = 0;
    this.disableReverse = true;
    this.reverseClicked = false;
  }

  openDialog(
    titleVal: any,
    type: string | null,
    msg: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: titleVal,
        message: msg,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
  }
}

export function debitAmountValid() {
  return (g: AbstractControl) => {
    let debitAmount = g.value ?? "";
    return Number(debitAmount) == 0  && debitAmount !=""? { amtExceeds: true } : null;
  };
}

  

