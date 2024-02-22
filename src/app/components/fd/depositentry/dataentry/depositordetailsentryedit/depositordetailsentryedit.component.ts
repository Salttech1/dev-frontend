import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { outputAst } from '@angular/compiler';
import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DynapopService } from 'src/app/services/dynapop.service';
import * as constant from '../../../../../../constants/constant'
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { DepositordetailComponent } from '../../../fdcommon/depositordetail/depositordetail.component';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { Router } from '@angular/router';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { finalize, take } from 'rxjs';
import { PartyComponent } from 'src/app/components/common/party/party.component';

@Component({
  selector: 'app-depositordetailsentryedit',
  templateUrl: './depositordetailsentryedit.component.html',
  styleUrls: ['./depositordetailsentryedit.component.css']
})
export class DepositordetailsentryeditComponent implements OnInit, AfterViewInit {
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  depositorTableData: any;
  deptColumnHeader!: any[];
  tabContentFlag: boolean = false
  disabledFlagAdd: boolean = false
  disabledFlagRetrieve: boolean = false
  disabledFlagNewDeposit: boolean = false
  disabledFlagSave: boolean = true
  disabledFlagBack: boolean = true
  disabledFlagReset: boolean = true
  disabledFlagList: boolean = true
  disabledFlagPrint: boolean = true
  disabledFlagExit: boolean = false
  loader: boolean = false
  activeTabStringValue: string = 'depositorDetail'
  @Input() depositEntryTabVal: any
  @Input() addressTabVal: any


  // reterieveFlagVal:any
  // sending data to actionpanelcomponent for reterive data
  @Output() retrieveFormData = new EventEmitter()
  // get address and depositor data
  receivedAddressData!: FormGroup
  receiveDepositorData!: FormGroup
  receivePartyData!: FormGroup
  // sending address data to actioncomponent for save action
  receivedData: any
  // send formGroup validation flag
  sendFgValidationChk!: boolean
  passSaveApiUrl: any = constant.Add_Depositor
  updateApiUrl: any = constant.update_Depositor
  addChkApi = constant.DepositorId_Chk
  paramsPost: any
  passRetrieveApiUrl: string = 'depositor/fetch-depositor-by-depositorid-and-companycode'
  deptDyanPop!: string
  readonlyAttr = true
  depositEntryValidationChk!: boolean;
  isAddClicked!: boolean;
  insupdVal: string = ""
  coy_condition = "coy_fdyn='Y'"
  @Input() cityValueChangeFlag: boolean = false
  @ViewChild(F1Component) comp!: F1Component
  constructor(private dynapop: DynapopService, private changeDetector: ChangeDetectorRef, private actionService: ActionservicesService, private http: HttpClient, private toastr: ToasterapiService, private modalService: ModalService, private router: Router,
    private rendered: Renderer2) {
    this.actionService.isAddClickedFlagUpdated.subscribe((res: any) => {
      this.isAddClicked = res
    })
    this.actionService.getIsNewDepositActionFlag(false)

  }

  ngOnInit(): void {
    this.getCompanyList()
  }

  ngAfterViewInit(): void {
    this.focusField();
  }

  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('company2')?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  ngOnChanges() {
    this.getReceiveAddressData(this)
    this.receiveDepositorEntryData(this)
    this.receivePartyEntryData(this)
    // this.depositorData(this)

  }

  updateCityFieldValueChange(event: boolean) {
    this.cityValueChangeFlag = event
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
    this.payloadData()
    console.log(this.payloadData());

    this.sendFgValidationChk = this.receivedAddressData?.valid && this.receiveDepositorData?.valid
    // console.log("this.sendFgValidationChk", this.receiveDepositorData?.valid )
    // let params = new HttpParams()
    // .set("depositorId", `${this.depositorEntryForm?.get("depositorId")?.value}`)
    // .set("companyCode", `${this.depositorEntryForm?.get("companyCode")?.value}`)
    // this.paramsPost = params
    // this.depositEntryValidationChk=this.depositorEntryForm.valid
    if (this.isAddClicked) {
      this.insupdVal = "I"
    }
    else {
      this.insupdVal = ""
    }
    this.actionService.getExportActionFlag(true)
    this.actionService.getDeleteActionFlag(true)
    this.actionService.getisPrintActionFlag(true)
    this.actionService.getCalcInterestFlag(true)
    if (!this.isAddClicked) { this.actionService.getResetActionFlag(true) }

    //   this.actionService.commonFlagCheck(false,false,false,true,true,true,true,true,true,true)
    if (this.receiveDepositorData?.controls['dbirthdate'].errors && this.receiveDepositorData?.controls['dbirthdate'].errors?.['matDatepickerParse']?.text == '') {
      this.receiveDepositorData?.controls['dbirthdate'].setValue(null)
    }
    if (this.tabContentFlag) {
      this.depositorEntryForm.patchValue({
        name: this.receiveDepositorData?.value.name
      })
    }
    if (this.depositorEntryForm.get('companyCode')?.value == '') {
      this.depositorEntryForm.patchValue({
        companyName: '',
        proprietor: '',
        propName: '',
      })
    }
  }

  saveCallBackValidatior = () => {
    if (!this.sendFgValidationChk) {
      this.receivedAddressData?.markAllAsTouched()
      this.receiveDepositorData?.markAllAsTouched()
    }
  }
  // depositorData(val:any){
  //  this.readonlyAttr = false
  //  this.depositEntryTabVal=val
  //  this.addressTabVal=val?.addressResponseBean
  // }

  getReceiveAddressData($event: any) {
    this.receivedAddressData = $event
  }

  receiveDepositorEntryData($event: any) {
    this.receiveDepositorData = $event
  }

  receivePartyEntryData(event: any) {
    this.receivePartyData = event
  }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  // tabContainerFlagRefresh(flagVal:any){
  //   this.tabContentFlag = flagVal
  // }

  // updateRetreievFlagVal(flagVal:any){
  //   this.reterieveFlagVal = flagVal
  // }

  depositorEntryForm = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    companyName: new FormControl({ value: '', disabled: true }),
    depositorId: new FormControl('',Validators.required),
    proprietor: new FormControl({ value: '', disabled: true }),
    propName: new FormControl({ value: '', disabled: true }),
    name: new FormControl({ value: '', disabled: true }),
    isTransferSeries: new FormControl('N')
  })

  updateCompanyList(compData: any) {
    if (compData != undefined && compData.length != 0) {
      console.log("compData", compData)
      this.depositorEntryForm.patchValue({ companyName: compData[this.bringBackColumn] })
      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {

          this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorTableData = res.data

        })
      //get proprietor list
      this.dynapop.getDynaPopListObj("COMPANY", `coy_code='${compData[this.bringBackColumn - 1]}'`).subscribe((res: any) => {
        this.depositorEntryForm.patchValue({
          proprietor: res.data.dataSet[0][0],
          propName: res.data.dataSet[0][1]
        })
      })
    }

  }

  updateListControl(val: any, formControl: any) {
    formControl.setValue(val[this.bringBackColumn])
  }


  getTransferSeries(): boolean {
    if (this.receiveDepositorData?.value.transferSeries == 'Y') {
      return true;
    } else {
      return false;
    }
  }

  payloadData() {
    this.receivedData = {
      coy: this.depositorEntryForm.value.companyCode,
      companyCode: this.depositorEntryForm.value.companyCode,
      proprietor: this.depositorEntryForm.value.proprietor,
      isTransferSeries: this.getTransferSeries(),
      depositorId: this.depositorEntryForm.value.depositorId,
      depositor: this.depositorEntryForm.value.depositorId,
      birthdate: this.receiveDepositorData?.value.dbirthdate,
      deptype: this.receiveDepositorData?.value.deptype,
      name: this.receiveDepositorData?.value.name,
      pannum1: this.receiveDepositorData?.value.pannum1,
      pannum2: this.receiveDepositorData?.value.pannum2,
      remarks: this.receiveDepositorData?.value.remarks,
      taxalwaysyn: this.receiveDepositorData?.value.taxalwaysyn,
      title: this.receiveDepositorData?.value.title,
      tds15gyn: this.receiveDepositorData?.value.tds15gyn,
      tds15hyn: this.receiveDepositorData?.value.tds15hyn,
      userid: sessionStorage.getItem("userName"),
      insupd: this.receiveDepositorData?.value.insupd,
      city: this.receivedAddressData?.value.addressResponseBean.city,
      today: this.receiveDepositorData?.value.today,
      partyRequestBean: this.receivePartyData?.value,
      addressRequestBean: this.receivedAddressData?.value.addressResponseBean,
    }
    return this.receivedData
  }


  resetAddErrorField(event: any) {
    this.depositorEntryForm.patchValue({
      depositorId: "",
      name: ""
    })
  }

  // action
  actionDisabledEnabledButtons(isAddFlag: boolean, isRetrieveFlag: boolean, isNewDeposit: boolean, isSaveFlag: boolean, isReset: boolean, isBack: boolean, isExitFlag: boolean) {
    this.disabledFlagAdd = isAddFlag
    this.disabledFlagRetrieve = isRetrieveFlag
    this.disabledFlagNewDeposit = isNewDeposit
    this.disabledFlagSave = isSaveFlag
    this.disabledFlagReset = isReset
    this.disabledFlagBack = isBack
    this.disabledFlagExit = isExitFlag
  }

  add() {
    console.log(" this.tabContentFlag ", this.tabContentFlag)
    if (!this.depositorEntryForm.get('companyCode')?.valid) {
      this.depositorEntryForm.get('companyCode')?.markAsTouched();
      (document.getElementById("company2")?.childNodes[0] as HTMLInputElement)?.focus()
    }
    else {
      console.log(this.depositorEntryForm.get('depositorId')?.value)
      if (this.depositorEntryForm.get('depositorId')?.value != null) {
        this.depositorEntryForm.patchValue({
          depositorId: null
        })
      }
      this.tabContentFlag = true
      console.log(" this.tabContentFlag ", this.tabContentFlag)
      this.depositorEntryForm.get('depositorId')?.markAsUntouched()
      this.actionService.getReterieveClickedFlagUpdatedValue(false)
      this.actionService.getAddFlagUpdatedValue(true)
      this.actionDisabledEnabledButtons(true, true, true, false, false, false, true)
      this.depositorEntryForm.disable()
    }
  }
  retrieveData() {
    if (this.depositorEntryForm?.valid) {
      this.http.post(`${environment.API_URL}${this.passRetrieveApiUrl}`, { companyCode: this.depositorEntryForm.get('companyCode')?.value, depositorId: this.depositorEntryForm.get('depositorId')?.value }).subscribe((res: any) => {
        if (res.status == true) {
          console.log(res)
          this.actionService.getisTabContentDataFlag(true)
          this.tabContentFlag = true
          this.depositEntryTabVal = res.data
          this.addressTabVal = res.data?.addressResponseBean
          this.actionService.getReterieveClickedFlagUpdatedValue(true)
          this.actionService.getAddFlagUpdatedValue(false)
          this.actionDisabledEnabledButtons(true, true, true, false, true, false, true)
          this.depositorEntryForm.disable()
        }
        if (res.status == false) {
          this.toastr.showError(res.message)
        }
      })
    }
    else {
      this.depositorEntryForm.markAllAsTouched()
    }
  }
  @ViewChild(DepositordetailComponent) deposiotrdetailComponent !: any
  @ViewChild(AddressComponent) addressComponent!: any
  @ViewChild(PartyComponent) partyComponent!: PartyComponent



  save() {
    this.actionService.getIsResetClickedFlagUpdateValue(false)
    if (!this.receiveDepositorData?.valid) {
      this.receiveDepositorData.markAllAsTouched()
      this.deposiotrdetailComponent.validationField()
    }
    if (!this.receivedAddressData?.valid) {
      this.receivedAddressData.markAllAsTouched()
      this.addressComponent.validationField()
    }
    if (!this.deposiotrdetailComponent.getPartyFormGroup?.valid) {
      this.deposiotrdetailComponent.getPartyFormGroup.markAllAsTouched()
      this.deposiotrdetailComponent.partyValiadtionField()
    }
    if (this.sendFgValidationChk) {
      console.log("party form group validation chk", this.deposiotrdetailComponent.getPartyFormGroup?.valid);
      if (this.actionService.isAddClickedFlagUpdated?.value) {
        this.disabledFlagSave = true // added to prevent multiple click call on save api call
        this.loader = true
        console.log("save")
        let resData: any
        if (this.receiveDepositorData?.valid && this.receivedAddressData?.valid && this.deposiotrdetailComponent.getPartyFormGroup?.valid) {
          this.http.post(`${environment.API_URL}${this.passSaveApiUrl}`, this.receivedData).pipe(take(1),finalize(() => (this.loader = false))).subscribe({
            next: (res: any) => {
              resData = res
              console.log("on add click", res.status)
            },
            error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                this.disabledFlagSave = false
                console.log("error", error.error.errors[0].defaultMessage)
                this.modalService.showErrorDialog(constant.ErrorDialog_Title, error.error.errors[0].defaultMessage, "error")
                // this.toastr.showError(error.error.errors[0].defaultMessage)
              }
            },
            complete: () => {
              if (resData.status) {
                this.tabContentFlag = false
                this.depositorEntryForm.reset()
                this.depositorEntryForm.controls.companyCode.enable();
                this.depositorEntryForm.controls.depositorId.enable();
                // this.depositorEntryForm.enable()
                this.actionDisabledEnabledButtons(false, false, false, true, true, true, false)
                this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, resData.message, this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "info")
                
              }
              else {
                this.disabledFlagSave = false
                this.modalService.showErrorDialog(constant.ErrorDialog_Title, resData.message, "error")
              }
            }
          })
        }
        else {
          this.receiveDepositorData?.markAllAsTouched()
          this.receiveDepositorData?.markAllAsTouched()
          this.deposiotrdetailComponent.getPartyFormGroup.markAllAsTouched()
        }
      }
      else {
        if (this.receiveDepositorData?.valid && this.receivedAddressData?.valid && this.deposiotrdetailComponent.getPartyFormGroup?.valid) {
          this.disabledFlagSave = true
          this.loader=true
          console.log("update");
          this.http.put(`${environment.API_URL}${this.updateApiUrl}`, this.receivedData).pipe(take(1),finalize(() => (this.loader = false))).subscribe({
            next:(res: any) => {
            if (res.status) {
              console.log(res);
              this.tabContentFlag = false
              this.depositorEntryForm.reset()
              this.depositorEntryForm.controls.companyCode.enable();
              this.depositorEntryForm.controls.depositorId.enable();
              this.actionDisabledEnabledButtons(false, false, false, true, true, true, false)
              this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, res.message, this.rendered.selectRootElement(this.comp.fo1.nativeElement)?.focus(), "info")
              
            }
            else {
              this.disabledFlagSave = false
              this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message, "error")
            }
          },
          complete:()=>{},
           error: (error: HttpErrorResponse) => {
              if (error.status === 400) {
                console.log("error", error.error.errors[0].defaultMessage)
                this.toastr.showError(error.error.errors[0].defaultMessage)
              }
              this.disabledFlagSave = false
            }
        })
        }
        else {
          this.receiveDepositorData?.markAllAsTouched()
          this.receiveDepositorData?.markAllAsTouched()
          this.deposiotrdetailComponent.getPartyFormGroup.markAllAsTouched()
        }
      }
    }
  }

  reset() {
    this.addressComponent.resetAddress()
    this.deposiotrdetailComponent.reset()
    if (this.activeTabStringValue == 'depositorDetail') {
      this.deposiotrdetailComponent.focusField()
    }
    if (this.activeTabStringValue == 'addressDetail') {
      this.addressComponent.activeAddressFieldFocus()
    }
  }
  back() {
    this.depositorEntryForm.reset()
    this.depositorEntryForm.controls.companyCode.enable();
    this.depositorEntryForm.controls.depositorId.enable();
   // this.depositorEntryForm.enable()
    this.tabContentFlag = false
    this.actionDisabledEnabledButtons(false, false, false, true, true, true, false)
    this.focusField()
    this.readonlyAttr = true
  }
  routeToDepositor(event: any) {
    this.router.navigate(['fd/depositentry/dataentry/depositdetailsentry/edit']);
  }
  handleExit() {
    this.router.navigate(['/dashboard']);
  }
  activeAddressField(event: any) {
    event.preventDefault()
    this.addressComponent.activeAddressFieldFocus()
    this.activeTabStringValue = 'addressDetail'
  }
  activeDepositorField(event: any) {
    event.preventDefault()
    this.deposiotrdetailComponent.activeDepositorDetailFocus()
    this.activeTabStringValue = 'depositorDetail'
  }
  updateOnChangeCompanyList(event: any) {
    const result = this.tableData.dataSet.filter((s: any, i: any) => {
      if (this.tableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.tableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.depositorEntryForm.patchValue({
          companyCode: ''
        })
      }
      else {
        this.depositorEntryForm.patchValue({
          companyName: result[0][1].trim(),
          proprietor: result[0][0].trim(),
          propName: result[0][1].trim()
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.depositorEntryForm.get('companyCode')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.depositorEntryForm.get('companyCode')?.value}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
        this.depositorTableData = res.data
      })
  }

  updateDepositorOnChange(event: any) {
    const result = this.depositorTableData.dataSet.filter((s: any, i: any) => {
      if (this.depositorTableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.depositorTableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        this.depositorEntryForm.patchValue({
          depositorId: ''
        })
      }
      else {
        this.depositorEntryForm.patchValue({
          name: result[0][1].trim()
        })
      }
    }
  }
}


