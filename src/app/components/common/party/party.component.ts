import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css']
})
export class PartyComponent implements OnInit {
  @Input() partyData: any
  @Input() _bankColHead: any
  @Input() _bankTable: any
  @Input() receiveCityData!: string
  @Input() receivePartyName!: string
  @Input() receivePmt!: string
  @Input() partyTitle!: string
  @Input() rowClass: boolean = true
  @Input() inputTabClass: boolean = false
  @Input() partClassResponsive!: String
  @Input() bankClassResponsive!: String
  @Input() branchClassResponsive!: String
  @Output() sendPartyFormGroup = new EventEmitter()
  @Input() getAddressFormGroupData!: FormGroup
  @Input() getDepositorDetailFormGroup!: FormGroup
  @Input() titleValueChangeFieldFlag: boolean = false
  @Input() getCityFieldUpdatedFlag: boolean = false
  isAddClicked!: boolean
  isRetrieveFlag!: boolean
  bringBackColumn!: number;
  resetClickSubscription!: Subscription;
  pipe = new DatePipe("en-US")

  constructor(private dynapop: DynapopService, private actionService: ActionservicesService, private changeRef: ChangeDetectorRef, private toastr: ToasterapiService) {
    this.actionService.isAddClickedFlagUpdated.subscribe((res: any) => {
      this.isAddClicked = res
    })
    this.actionService.isReterieveClickedFlagUpdate.subscribe((res: any) => {
      this.isRetrieveFlag = res
    })
    // this.resetClickSubscription = this.actionService.getResetClickEvent().subscribe(()=>{
    //   if(this.actionService?.isResetClickFlagUpdate?.value){ this.party.reset()}

    // })
  }

  ngOnInit(): void {
    this.getBankCodeList()
    if (this.isRetrieveFlag) {
      this.party.patchValue({
        aadharno: this.partyData?.aadharno?.trim(),
        payeeacNum1: this.partyData?.payeeacnum1,
        payeebankcode1: this.partyData?.payeebankcode1,
        payeeBranch1: this.partyData?.payeebranch1,
        // parPayeebranch1:this.partyData?.parPayeebranch1,
        payeeIfsc1: this.partyData?.payeeifsc1,
        parPayeebankcode1Name: this.partyData?.parPayeebankcode1Name,
        insupd: "",
        city: this.receiveCityData,
        partyname: this.receivePartyName,
        pmtacnum: this.receivePmt,
        title: this.partyTitle,
        userid: sessionStorage.getItem("userName")
      })

    }
  }

  party: FormGroup = new FormGroup({
    aadharno: new FormControl('', [Validators.maxLength(12), Validators.minLength(12)]),
    payeeacNum1: new FormControl(),
    payeeBranch1: new FormControl(),
    parPayeebankcode1Name: new FormControl(),
    payeebankcode1: new FormControl(),
    // parPayeebranch1: new FormControl(),
    payeeIfsc1: new FormControl('', [Validators.pattern("[A-Z]{4}0[A-Z0-9]{6}")]),
    partyname: new FormControl(),
    userid: new FormControl(sessionStorage.getItem("userName")),
    insupd: new FormControl(),
    city: new FormControl(),
    pmtacnum: new FormControl(),
    title: new FormControl(),
    today: new FormControl(),
  },
    { validators: ifscValidation() }
  )

  ngOnChanges() {
    this.party.patchValue({
      partyname: this.receivePartyName,
      pmtacnum: this.receivePmt,
      title: this.partyTitle,
      city: this.receiveCityData,
    })

    // if (this.isRetrieveFlag) {
    //   debugger
    //   this.party.patchValue({
    //     aadharno: this.partyData?.aadharno,
    //     payeeacNum1:this.partyData?.payeeacnum1,
    //     payeebankcode1:this.partyData?.payeebankcode1,
    //     payeeBranch1: this.partyData?.payeebranch1,
    //     // parPayeebranch1:this.partyData?.parPayeebranch1,
    //     payeeIfsc1:this.partyData?.payeeifsc1,
    //     parPayeebankcode1Name: this.partyData?.parPayeebankcode1Name,
    //     insupd:"",
    //     city:this.receiveCityData,
    //     partyname:this.receivePartyName,
    //     pmtacnum:this.receivePmt,
    //     title:this.partyTitle,
    //     userid:sessionStorage.getItem("userName")
    //   })

    // }
    if (this.isAddClicked) {
      this.party.patchValue({
        insupd: "I",
        city: this.receiveCityData,
        partyname: this.receivePartyName,
        pmtacnum: this.receivePmt,
        title: this.partyTitle
      })
    }
    this.sendPartyFormGroup.emit(this.party)

  }

  ngAfterContentChecked() {
    this.changeRef.detectChanges()
    if (this.party.get("payeebankcode1")?.value === '') {
      this.party.patchValue({
        parPayeebankcode1Name: '',
        payeeIfsc1: ''
      })
    }
    this.party.patchValue({
      payeeIfsc1: this.party.get('payeeIfsc1')?.value?.toUpperCase()
    })
    if (this.getDepositorDetailFormGroup?.get('pannum1')?.dirty || this.getDepositorDetailFormGroup?.get('name')?.dirty || this.getDepositorDetailFormGroup?.get('title')?.dirty || this.getAddressFormGroupData?.controls['addressResponseBean']?.get('city')?.dirty) {
      this.updateTodayValue()
    }
    if (this.titleValueChangeFieldFlag) {
      this.updateTodayValue()
    }
    if (this.getCityFieldUpdatedFlag) {
      this.updateTodayValue()
    }

  }

  getBankCodeList() {
    this.dynapop.getDynaPopListObj("PAYEEBANKS", ``).subscribe((res: any) => {
      this._bankColHead = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this._bankTable = res.data
      this.bringBackColumn = this._bankTable?.bringBackColumn
      if (this.isRetrieveFlag) {
        this.party.patchValue({
          payeebankcode1: this.partyData?.payeebankcode1,
        })
      }
      if (this.isAddClicked) {
        this.party.patchValue({
          payeebankcode1: '',
        })
      }
      this._bankTable.dataSet.filter((itemId: any) => {

        if (itemId[0]?.trim() == this.party.get("payeebankcode1")?.value?.trim()) {
          this.party.patchValue({
            parPayeebankcode1Name: itemId[1]
          })
        }
      })

    })
  }

  updateListControl(val: any, formControl: any) {
    formControl.setValue(val[this.bringBackColumn])
  }
  updateTodayValue() {
    this.party.patchValue({
      today: this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:SS')
    })
  }

  fieldValueChange() {
    console.log(' PARTY change field')
    this.updateTodayValue()
  }
  inputFieldValueChange() {
    console.log('party field change')
    this.updateTodayValue()

  }
}

export function ifscValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const bankCode = control.get('payeebankcode1')?.value?.trim()?.slice(0, 4)
    const ifsc = control.get('payeeIfsc1')?.value?.trim()?.slice(0, 4)
    let bankCodeStringChk: any
    if (ifsc == bankCode) {
    }
    else {
      if (ifsc) {
        control.get('payeeIfsc1')?.setErrors({ 'ifscInValid': true })
      }
    }
    return null

  }

}
