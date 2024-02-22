import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectorRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../constants/constant'

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-depositordetail',
  templateUrl: './depositordetail.component.html',
  styleUrls: ['./depositordetail.component.css'],
  providers: [
    // the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class DepositordetailComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() depositFetchedData: any
  @Output() _depositorDetailForm = new EventEmitter()
  @Input() _depositorTypeColHeader: any
  @Input() _depositorTypeTable: any
  @Input() _depositorTitleColHeader: any
  @Input() _depositorTitleTable: any
  @Input() passCityData!: string
  @Input() getCityUpdatedFlag: boolean = false
  @Output() passPartFormGroupEmit = new EventEmitter()
  @Input() getAddressFormGroup!: FormGroup
  titleValueChangeField: boolean = false
  getPartyFormGroup!: FormGroup

  _15gTDS: any
  _15hTDS: any
  none: any
  bringBackColumn: any;
  isRetrieveFlag: boolean = false
  //send depositor data 
  @Output() passDepositorData = new EventEmitter()
  minDate!: Date;
  maxDate!: Date;
  isAddClicked!: boolean;
  resetClickSubscription!: Subscription
  saveClickSubscription!: Subscription
  pipe = new DatePipe("en-US")

  constructor(private dynapop: DynapopService, private renderer: Renderer2, private actionService: ActionservicesService, private toastr: ToasterapiService, private changeDetectionRef: ChangeDetectorRef, private modalService: ModalService) {
    this.actionService.isAddClickedFlagUpdated.subscribe((res: any) => {
      this.isAddClicked = res
    })
    this.actionService.isReterieveClickedFlagUpdate.subscribe((res: any) => {
      this.isRetrieveFlag = res
    })
    // this.resetClickSubscription = this.actionService.getResetClickEvent().subscribe(()=>{
    //   if(this.actionService?.isResetClickFlagUpdate?.value){
    //     this.depositorDetailForm.reset()
    //     this.getDepositorTypeList()
    //     this.getDepositorTitleList()
    //     this._15gTDS=false
    //     this._15hTDS=false
    //     this.none=true
    //     this.depositorDetailForm.patchValue({
    //       transferSeries:'N'
    //     })
    //   }

    // })
    // this.saveClickSubscription=this.actionService.getSaveValidationEvent().subscribe(()=>{
    //   alert(this.actionService?.isSaveClickFlagUpdate?.value)
    //   if(this.actionService?.isSaveClickFlagUpdate?.value){
    //     if(!this.depositorDetailForm?.valid){
    //       this.depositorDetailForm.markAllAsTouched()
    //        this.validationField()
    //     }
    //   }
    //  })
  }

  validationField() {
    if(this.depositorDetailForm.controls['title'].errors && this.depositorDetailForm.controls['title'].errors?.['required']){
      this.toastr.showError("title is required")
    }
    else if(this.depositorDetailForm.controls['name'].errors && this.depositorDetailForm.controls['name'].errors?.['required']){
      this.toastr.showError("name is required")
    }
    else if(this.depositorDetailForm.controls['pannum1'].errors && this.depositorDetailForm.controls['pannum1'].errors?.['pattern']){
      this.toastr.showError("Invalid PAN")
    }
    else if(this.depositorDetailForm.controls['pannum2'].errors && this.depositorDetailForm.controls['pannum2'].errors?.['pattern']){
      this.toastr.showError("Invalid PAN")
    }
  }

  ngOnInit(): void {
    if (this.isRetrieveFlag) {
      this.depositorDetailForm.patchValue({
        dbirthdate: new Date(this.depositFetchedData?.birthdate),
        deptype: this.depositFetchedData?.deptype,
        name: this.depositFetchedData?.name,
        pannum1: this.depositFetchedData?.panum1?.trim(),
        pannum2: this.depositFetchedData?.panum2?.trim(),
        remarks: this.depositFetchedData?.remarks,
        taxalwaysyn: this.depositFetchedData?.taxalwaysyn,
        title: this.depositFetchedData?.title,
        tds15gyn: this.depositFetchedData?.tds15gyn,
        tds15hyn: this.depositFetchedData?.tds15hyn,
        insupd: "",
        city: this.passCityData,
        transferSeries: this.depositFetchedData?.isTransferSeries ? 'Y' : 'N'
      })

      if (this.depositorDetailForm.get('tds15gyn')?.value != undefined && this.depositorDetailForm.get('tds15gyn')?.value != null && this.depositorDetailForm.get('tds15gyn')?.value != "" && this.depositorDetailForm.get('tds15gyn')?.value == "Y") {
        this._15gTDS = true
        this._15hTDS = false
        this.none = false
      }
      else if (this.depositorDetailForm.get('tds15hyn')?.value != undefined && this.depositorDetailForm.get('tds15hyn')?.value != null && this.depositorDetailForm.get('tds15hyn')?.value != "" && this.depositorDetailForm.get('tds15hyn')?.value == "Y") {
        this._15gTDS = false
        this._15hTDS = true
        this.none = false
      }
      else if (this.depositorDetailForm.get('tds15hyn')?.value == undefined || this.depositorDetailForm.get('tds15hyn')?.value == null || this.depositorDetailForm.get('tds15hyn')?.value == "" || this.depositorDetailForm.get('tds15hyn')?.value == "N" && this.depositorDetailForm.get('tds15hyn')?.value == undefined || this.depositorDetailForm.get('tds15gyn')?.value == null || this.depositorDetailForm.get('tds15gyn')?.value == "" || this.depositorDetailForm.get('tds15gyn')?.value == "N") {
        this._15gTDS = false
        this._15hTDS = false
        this.none = true
      }
      this.depositorDetailForm.controls['taxalwaysyn'].disable();
      this.depositorDetailForm.controls['transferSeries'].disable()
    }
  }

  focusField() {
    let el = document.getElementById('dtype1')?.childNodes[0] as HTMLInputElement
    el.focus()
  }

  ngAfterViewInit(): void {
    this.focusField()
  }

  depositorDetailForm = new FormGroup({
    dbirthdate: new FormControl(),
    deptype: new FormControl(),
    name: new FormControl('', Validators.required),
    pannum1: new FormControl('', [Validators.maxLength(10),
    Validators.minLength(10), Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    pannum2: new FormControl('', [Validators.maxLength(10),
    Validators.minLength(10), Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    remarks: new FormControl(),
    taxalwaysyn: new FormControl("Y"),
    title: new FormControl('', Validators.required),
    tds15gyn: new FormControl('Y'),
    tds15hyn: new FormControl('N'),
    deptypeName: new FormControl(),
    titleName: new FormControl(),
    userid: new FormControl(sessionStorage.getItem("userName")),
    insupd: new FormControl(),
    city: new FormControl(),
    transferSeries: new FormControl('N'),
    today: new FormControl()
  })

  ngOnChanges() {
    console.log(this.depositorDetailForm.get("pannum1")?.value)
    if (this.depositorDetailForm.get('tds15gyn')?.value != undefined && this.depositorDetailForm.get('tds15gyn')?.value != null && this.depositorDetailForm.get('tds15gyn')?.value != "" && this.depositorDetailForm.get('tds15gyn')?.value == "Y") {
      this._15gTDS = true
      this._15hTDS = false
      this.none = false

    }
    else if (this.depositorDetailForm.get('tds15hyn')?.value != undefined && this.depositorDetailForm.get('tds15hyn')?.value != null && this.depositorDetailForm.get('tds15hyn')?.value != "" && this.depositorDetailForm.get('tds15hyn')?.value == "Y") {
      this._15gTDS = false
      this._15hTDS = true
      this.none = false

    }
    else if (this.depositorDetailForm.get('tds15hyn')?.value == undefined || this.depositorDetailForm.get('tds15hyn')?.value == null || this.depositorDetailForm.get('tds15hyn')?.value == "" || this.depositorDetailForm.get('tds15hyn')?.value == "N" && this.depositorDetailForm.get('tds15hyn')?.value == undefined || this.depositorDetailForm.get('tds15gyn')?.value == null || this.depositorDetailForm.get('tds15gyn')?.value == "" || this.depositorDetailForm.get('tds15gyn')?.value == "N") {
      this._15gTDS = false
      this._15hTDS = false
      this.none = true

    }
    this.passDepositorData.emit(this.depositorDetailForm)


    if (this.isAddClicked) {
      this.depositorDetailForm.controls['taxalwaysyn'].enable();
      // this.none = true
      //  this.depositorDetailForm.reset()
      this.depositorDetailForm.patchValue({
        taxalwaysyn: 'Y',
        insupd: "I",
        city: this.passCityData,
      })

    }

    this.getDepositorTypeList()
    this.getDepositorTitleList()
    this.receivePartFG(this)

    // if(this.isReset){
    //   this.getDepositorTypeList()
    //   this.getDepositorTitleList()
    // }
  }

  ngAfterContentChecked() {
    this.changeDetectionRef.detectChanges()
    this.getPartyFormGroup
    this.depositorDetailForm.patchValue({
      pannum1: this.depositorDetailForm.get('pannum1')?.value?.toUpperCase(),
      pannum2: this.depositorDetailForm.get('pannum2')?.value?.toUpperCase()
    })
    if (this.depositorDetailForm.get("deptype")?.value === '') {
      this.depositorDetailForm.patchValue({
        deptypeName: ''
      })
    }
    if (this.depositorDetailForm.get("title")?.value === '') {
      this.depositorDetailForm.patchValue({
        titleName: ''
      })
    }
    if (this.getAddressFormGroup?.controls['addressResponseBean']?.get('city')?.dirty) {
      this.todayUpdateValue()
    }
    if (this.getCityUpdatedFlag) {
      this.todayUpdateValue()
    }
  }

  receivePartFG(event: any) {
    this.getPartyFormGroup = event

    this.passPartFormGroupEmit.emit(this.getPartyFormGroup)
  }




  // receiveIsReset(event:boolean){

  //   this.depositorDetailForm.reset()
  // }

  todayUpdateValue() {
    this.depositorDetailForm.patchValue({
      today: this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss')
    })
  }

  handleChange(event: any, targetAtt: any) {
    if (targetAtt == '15G') {
      event.target.value = 'Y'
      this.depositorDetailForm.patchValue({ tds15gyn: event.target.value })
      this.depositorDetailForm.patchValue({ tds15hyn: 'N' })
      this.todayUpdateValue()
      console.log('field change')
    }
    else if (targetAtt == '15H') {
      event.target.value = 'Y'
      this.depositorDetailForm.patchValue({ tds15hyn: event.target.value })
      this.depositorDetailForm.patchValue({ tds15gyn: 'N' })
      this.todayUpdateValue()
      console.log('field change')
    }
    else if (targetAtt == 'none') {
      this.depositorDetailForm.patchValue({ tds15hyn: 'N' })
      this.depositorDetailForm.patchValue({ tds15gyn: 'N' })
      this.todayUpdateValue()
      console.log('field change')
    }

  }

  updateCalcs(event: any, id: any) {
    var datepipe = new DatePipe("en-IN")
    //  var a = moment(event.value).valueOf() / 1000
    var yearVal: any = datepipe.transform(this.depositorDetailForm.get('dbirthdate')?.value, 'yyyy')
    if (parseInt(yearVal) < 1900 || parseInt(yearVal) > 2049) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Year in between 1900 to 2050", document.getElementById(`${id}`)?.focus(), "error");
      event.target.value = ""
    }

    console.log("moment(event.target.value, 'yyyy-MM-dd', true).isValid())", event.target.value)
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = ""
    }
    this.todayUpdateValue()
    console.log('date change')
  }


  getDepositorTypeList() {
    this.dynapop.getDynaPopListObj("CUSTTYPE", ``).subscribe((res: any) => {
      this._depositorTypeTable = res.data
      this.bringBackColumn = res.data.bringBackColumn
      this._depositorTypeColHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      if (this.isRetrieveFlag) {
        this.depositorDetailForm.patchValue({
          deptype: this.depositFetchedData?.deptype
        })
      }
      if (this.isAddClicked) {
        this.depositorDetailForm.patchValue({
          deptype: "I"
        })
      }

      this._depositorTypeTable.dataSet.filter((itemId: any) => {
        if (itemId[0].trim() == this.depositorDetailForm.get("deptype")?.value.trim()) {
          this.depositorDetailForm.patchValue({
            deptypeName: itemId[1]
          })
        }
      })
    })
  }

  getDepositorTitleList() {

    this.dynapop.getDynaPopListObj("TITLES", ``).subscribe((res: any) => {
      this._depositorTitleColHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this._depositorTitleTable = res.data
      if (this.isRetrieveFlag) {
        this.depositorDetailForm.patchValue({
          title: this.depositFetchedData?.title
        })
      }
      if (this.isAddClicked) {
        this.depositorDetailForm.patchValue({
          title: "MR"
        })
      }


      this._depositorTitleTable.dataSet.filter((itemId: any) => {
        if (itemId[0].trim() == this.depositorDetailForm.get("title")?.value?.trim()) {

          this.depositorDetailForm.patchValue({
            titleName: itemId[1]
          })
        }
      })

    })
    // console.log("bank", this.depositorDetailForm.get("titleName")?.value)
  }


  updateListControl(val: any, formControl: any) {
    formControl.setValue(val[this.bringBackColumn])
  }

  getTransferSeries(): boolean {
    if (this.depositorDetailForm.value.transferSeries == 'Y') {
      return true;
    } else {
      return false;
    }
  }

  fieldValueChange() {
    this.todayUpdateValue()
    console.log(' ddeatil change field')
  }
  inputFieldValueChange() {
    this.todayUpdateValue()
    console.log('ddeatil field change')
  }
  inputFieldValueChangeTitle() {
    this.todayUpdateValue()
    this.titleValueChangeField = true
  }

  reset() {
    this.depositorDetailForm.reset()
    this.getDepositorTypeList()
    this.getDepositorTitleList()
    this._15gTDS = false
    this._15hTDS = false
    this.none = true
    this.depositorDetailForm.patchValue({
      transferSeries: 'N',
      tds15gyn:'N',
      tds15hyn:'N'
    })
    this.getPartyFormGroup?.reset()
    this.getPartyFormGroup?.controls['userid'].setValue(sessionStorage.getItem('userName'))
  }

  activeDepositorDetailFocus(){
    setTimeout(()=>{
      (document.getElementById('dtype1')?.childNodes[0] as HTMLInputElement)?.focus()
    },50)
  }

  partyValiadtionField(){
      if(this.getPartyFormGroup.controls['payeeIfsc1'].errors?.['pattern']){
        this.toastr.showError("Invalid IFSC")
      }
      else if(this.getPartyFormGroup.controls['payeeIfsc1'].errors?.['ifscInValid']){
        this.toastr.showError("Bank Code is not matching with IFSC")
      }
      else if(this.getPartyFormGroup.controls['aadharno'].errors?.['maxlength'] ||this.getPartyFormGroup.controls['aadharno'].errors?.['minlength']){
        this.toastr.showError("Aadhar no. should be 12 Character")
      }
    
  }

}


