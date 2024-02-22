import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { Subscription } from 'rxjs';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../constants/constant'
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Input() addressFetchData: any
  @Input() _townsTable: any
  @Input() _townsColHead: any
  @Input() _cityColHead: any
  @Input() _cityTable: any
  @Input() _stateColHead: any
  @Input() _stateTable: any
  @Input() _countryColHead: any
  @Input() _countryTable: any
  @Input() receiveBirthDay: any
  @Input() addressListFlag: boolean = false
  @Output() cityFieldValueChange = new EventEmitter()
  bringBackColumn: any;
  isRetrieveFlag: boolean = false
  @Input() getDepositorDetailForm!: FormGroup
  // sending address data to depositorEdit page
  @Output() passAddressData = new EventEmitter()
  @Output() passFormGroup = new EventEmitter()
  @Input() classesResponsive = ''
  isAddClicked: any;
  // resetClickSubscription!: Subscription
  // saveClickSubscription!: Subscription
  pipe = new DatePipe("en-US")

  constructor(private dynapop: DynapopService, private modalService: ModalService,
    private dialog: MatDialog,
    private actionService: ActionservicesService, private tostr: ToasterapiService, private changeDetection: ChangeDetectorRef, private rendered: Renderer2) {
    this.actionService.isAddClickedFlagUpdated.subscribe((res: any) => {
      this.isAddClicked = res
    })
    this.actionService.isReterieveClickedFlagUpdate.subscribe((res: any) => {
      this.isRetrieveFlag = res
    })
    // this.resetClickSubscription = this.actionService.getResetClickEvent().subscribe(()=>{

    //   if(this.actionService?.isResetClickFlagUpdate?.value){
    //     this.addressForm.reset()
    //     this.getTownList()
    //     this.getCityList() 
    //     this.getStatesList()
    //     this.getCountryList()
    //   }

    // })
    //  this.saveClickSubscription=this.actionService.getSaveValidationEvent().subscribe(()=>{
    //     if(this.actionService?.isSaveClickFlagUpdate?.value){
    //       if(!this.addressForm?.valid){
    //         this.addressForm.markAllAsTouched()
    //         this.validationField()

    //       } 
    //     }

    // })
  }

  ngAfterContentChecked() {
    this.changeDetection.detectChanges()
    if (this.addressForm.get("addressResponseBean.town")?.value === '') {
      this.addressForm.patchValue({
        'addressResponseBean': {
          addrTownshipName: ''
        }
      })
    }
    if (this.addressForm.get("addressResponseBean.city")?.value === '') {
      this.addressForm.patchValue({
        'addressResponseBean': {
          addrCityName: ''
        }
      })
    }
    if (this.addressForm.get("addressResponseBean.state")?.value === '') {
      this.addressForm.patchValue({
        'addressResponseBean': {
          adrStateName: ''
        }
      })
    }
    if (this.addressForm.get("addressResponseBean.country")?.value === '') {
      this.addressForm.patchValue({
        'addressResponseBean': {
          adrCountryName: ''
        }
      })
    }
    //  console.log("getDepositorDetailForm in address", this.getDepositorDetailForm?.get("dbirthdate")?.dirty);
    if (this.getDepositorDetailForm?.get("dbirthdate")?.dirty) {
      this.updateTodayValue()
    }
    // console.log(this.actionService.isTabContentDataFlag?.value)
  }


  validationField() {
    if (this.addressForm.controls['addressResponseBean'].controls['ad1'].errors && this.addressForm.controls['addressResponseBean'].controls['ad1'].errors?.['required']) {
      // this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Address-1 is required", "error")
      this.tostr.showError("Address-1 is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['ad2'].errors && this.addressForm.controls['addressResponseBean'].controls['ad2'].errors?.['required']) {
      // this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Address-2 is required", "error")
      this.tostr.showError("Address-2 is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['pincode'].errors && this.addressForm.controls['addressResponseBean'].controls['pincode'].errors?.['required']) {
      this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Pincode is required", "error")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['town'].errors && this.addressForm.controls['addressResponseBean'].controls['town'].errors?.['required']) {
      //this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Town is required", "error")
      this.tostr.showError("Town is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['city'].errors && this.addressForm.controls['addressResponseBean'].controls['city'].errors?.['required']) {
      //  this.modalService.showErrorDialog(constant.ErrorDialog_Title, "City is required", "error")
      this.tostr.showError("City is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['state'].errors && this.addressForm.controls['addressResponseBean'].controls['state'].errors?.['required']) {
      //this.modalService.showErrorDialog(constant.ErrorDialog_Title, "State is required", "error")
      this.tostr.showError("State is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['country'].errors && this.addressForm.controls['addressResponseBean'].controls['country'].errors?.['required']) {
      //this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Country is required", "error")
      this.tostr.showError("Country is required")
      return false;
    }
    else if (this.addressForm.controls['addressResponseBean'].controls['email'].errors && this.addressForm.controls['addressResponseBean'].controls['email'].errors?.['pattern']) {
      //this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Invalid Email", "error")
      this.tostr.showError("Invalid Email")
      return false;
    }
    else {
      return true;
    }
  }


  addressForm = new FormGroup({
    addressResponseBean: new FormGroup({
      ad1: new FormControl('', Validators.required),
      ad2: new FormControl('', Validators.required),
      ad3: new FormControl(),
      ad4: new FormControl(),
      ad5: new FormControl(),
      city: new FormControl('', Validators.required),
      addrCityName: new FormControl(),
      country: new FormControl('', Validators.required),
      adrCountryName: new FormControl(),
      email: new FormControl('', Validators.pattern("^[aA-zZ0-9._%+-]+@[aA-zZ0-9.-]+\\.[a-z]{2,4}$")),
      fax: new FormControl(),
      phoneoff: new FormControl(),
      phoneres: new FormControl(),
      pincode: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      adrStateName: new FormControl(),
      town: new FormControl('', Validators.required),
      addrTownshipName: new FormControl(),
      birthday: new FormControl(),
      userid: new FormControl(sessionStorage.getItem("userName")),
      insupd: new FormControl(),
      today: new FormControl(),
      phonemobile: new FormControl()
    })
  })

  ngOnInit(): void {
    console.log("Retrieved CLicked: ", this.isRetrieveFlag)
    if (this.isRetrieveFlag) {
      this.addressForm.patchValue({
        'addressResponseBean': {
          ad1: this.addressFetchData?.adline1,
          ad2: this.addressFetchData?.adline2,
          ad3: this.addressFetchData?.adline3,
          ad4: this.addressFetchData?.adline4,
          ad5: this.addressFetchData?.adline5,
          city: this.addressFetchData?.city,
          country: this.addressFetchData?.country,
          email: this.addressFetchData?.email,
          fax: this.addressFetchData?.fax,
          phoneoff: this.addressFetchData?.phoneoff,
          phoneres: this.addressFetchData?.phoneres,
          pincode: this.addressFetchData?.pincode,
          state: this.addressFetchData?.state,
          town: this.addressFetchData?.town,
          //birthday:new Date(this.depositFetchedData?.birthdate)
          userid: sessionStorage.getItem("userName"),
          insupd: "",
          birthday: this.receiveBirthDay,
          phonemobile: this.addressFetchData?.phonemobile
        }
      });


    }
    this.passFormGroup.emit(this.addressForm)
  }

  ngOnChanges() {
    this.addressForm.patchValue({
      'addressResponseBean': {
        birthday: this.receiveBirthDay
      }
    })

    if (this.isAddClicked) {

      this.addressForm.patchValue({
        'addressResponseBean': {
          insupd: "I",
          userid: sessionStorage.getItem("userName")
        }
      })

    }
    this.getTownList()
    this.getCityList()
    this.getStatesList()
    this.getCountryList()

    this.passAddressData.emit(this.addressForm)
    /** for change detecttion */
    // Patch values for retrieve done here since values were not seen in employee detail screen done by kalpana on 10/08/2023 
    if (this.isRetrieveFlag) {
      this.addressForm.patchValue({
        'addressResponseBean': {
          ad1: this.addressFetchData?.adline1,
          ad2: this.addressFetchData?.adline2,
          ad3: this.addressFetchData?.adline3,
          ad4: this.addressFetchData?.adline4,
          ad5: this.addressFetchData?.adline5,
          city: this.addressFetchData?.city,
          country: this.addressFetchData?.country,
          email: this.addressFetchData?.email,
          fax: this.addressFetchData?.fax,
          phoneoff: this.addressFetchData?.phoneoff,
          phoneres: this.addressFetchData?.phoneres,
          pincode: this.addressFetchData?.pincode,
          state: this.addressFetchData?.state,
          town: this.addressFetchData?.town,
          //birthday:new Date(this.depositFetchedData?.birthdate)
          userid: sessionStorage.getItem("userName"),
          insupd: "",
          birthday: this.receiveBirthDay,
          phonemobile: this.addressFetchData?.phonemobile
        }
      });
    }
    // End of patching values for retrieve
  }

  getTownList() {
    this.dynapop.getDynaPopListObj("TOWNS", ``).subscribe((res: any) => {
      this._townsColHead = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5, res.data.colhead5]
      this._townsTable = res.data
      this.bringBackColumn = res.data.bringBackColumn
      if (this.isRetrieveFlag) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            town: this.addressFetchData?.township
          }
        })
      }
      if (this.isAddClicked) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            town: ''
          }
        })
      }

      this._townsTable.dataSet.filter((itemId: any) => {

        if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.town")?.value?.trim()) {
          this.addressForm.patchValue({
            'addressResponseBean': {
              addrTownshipName: itemId[1]
            }
          })
        }
      })
    })

  }

  getCityList() {
    this.dynapop.getDynaPopListObj("CITIES", ``).subscribe((res: any) => {
      this._cityColHead = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5, res.data.colhead5]
      this._cityTable = res.data
      this.bringBackColumn = res.data.bringBackColumn
      if (this.isRetrieveFlag) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            city: this.addressFetchData?.city
          }
        })
      }
      if (this.isAddClicked) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            city: 'MUM'
          }
        })
      }

      this._cityTable.dataSet.filter((itemId: any) => {
        if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.city")?.value?.trim()) {
          this.addressForm.patchValue({
            'addressResponseBean': {
              addrCityName: itemId[1]
            }
          })
        }
      })
    })
  }

  getStatesList() {
    this.dynapop.getDynaPopListObj("STATES", ``).subscribe((res: any) => {
      this._stateColHead = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5, res.data.colhead5]
      this._stateTable = res.data
      this.bringBackColumn = res.data.bringBackColumn
      if (this.isRetrieveFlag) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            state: this.addressFetchData?.state
          }
        })
      }
      if (this.isAddClicked) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            state: 'MAH'
          }
        })
      }
      this._stateTable.dataSet.filter((itemId: any) => {
        if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.state")?.value?.trim()) {
          this.addressForm.patchValue({
            'addressResponseBean': {
              adrStateName: itemId[1]
            }
          })
        }
      })
    })
  }

  setDefaultCity() {
    this.addressForm.patchValue({
      'addressResponseBean': {
        city: 'MUM'
      }
    })
    this._cityTable.dataSet.filter((itemId: any) => {
      if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.city")?.value?.trim()) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            addrCityName: itemId[1]
          }
        })
      }
    })
    this.addressForm.patchValue({
      'addressResponseBean': {
        state: 'MAH'
      }
    })
    this._stateTable.dataSet.filter((itemId: any) => {
      if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.state")?.value?.trim()) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            adrStateName: itemId[1]
          }
        })
      }
      this.addressForm.patchValue({
        'addressResponseBean': {
          country: 'INDIA'
        }
      })
      this._countryTable.dataSet.filter((itemId: any) => {
        if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.country")?.value?.trim()) {
          this.addressForm.patchValue({
            'addressResponseBean': {
              adrCountryName: itemId[1]
            }
          })
        }
      })
    })
  }

  getCountryList() {
    this.dynapop.getDynaPopListObj("NATIONS", ``).subscribe((res: any) => {
      this._countryColHead = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5, res.data.colhead5]
      this._countryTable = res.data
      this.bringBackColumn = res.data.bringBackColumn
      if (this.isRetrieveFlag) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            country: this.addressFetchData?.country
          }
        })
      }
      if (this.isAddClicked) {
        this.addressForm.patchValue({
          'addressResponseBean': {
            country: 'INDIA'
          }
        })
      }
      this._countryTable.dataSet.filter((itemId: any) => {
        if (itemId[0]?.trim() == this.addressForm.get("addressResponseBean.country")?.value?.trim()) {
          this.addressForm.patchValue({
            'addressResponseBean': {
              adrCountryName: itemId[1]
            }
          })
        }
      })
    })
  }

  updateListControl(val: any, formControl: any) {
    //console.log('change',Number(val.length))
    formControl.setValue(val[this.bringBackColumn])

  }

  updateTodayValue() {
    this.addressForm.patchValue({
      addressResponseBean: {
        today: this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:SS')
      }
    })
  }

  fieldValChange() {
    console.log('add change field')
    this.updateTodayValue()
  }

  inputFieldValueChange() {
    console.log('add field change')
    this.updateTodayValue()
  }
  inputFieldValueChangeCity() {
    this.updateTodayValue()
    this.cityFieldValueChange.emit(true)
  }
  resetAddress() {
    this.addressForm.reset()
    if (this.addressListFlag) {
      this.getTownList()
      this.getCityList()
      this.getStatesList()
      this.getCountryList()
    }
    this.addressForm.patchValue({
      addressResponseBean: {
        userid: sessionStorage.getItem("userName")
      }
    })
  }
  activeAddressFieldFocus() {
    this.rendered.selectRootElement('#address1')?.focus()
  }

  showDialog(titleVal: any, message: string, type: string, confirmationDialog: boolean) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type,
        confirmationDialog: true,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.setDefaultCity();
      }
    });
  }

  checkIsCityBlank() {
    if (this.addressForm.get("addressResponseBean.city")?.value === '') {
      this.showDialog(constant.ErrorDialog_Title, "Do you want to select MUM as Default City", "question", false);
    }
  }

  onCityChange(event:any)
  {
    if(event.target.value.includes('MUM'))
    {  
      this.addressForm.get('addressResponseBean.state')?.setValue('MAH')
      this.addressForm.get('addressResponseBean.adrStateName')?.setValue('Maharashtra   ')
      this.addressForm.get('addressResponseBean.country')?.setValue('INDIA')
      this.addressForm.get('addressResponseBean.adrCountryName')?.setValue('India      ')
    }else{
      this.addressForm.get('addressResponseBean.state')?.setValue('')
      this.addressForm.get('addressResponseBean.adrStateName')?.setValue('')
      this.addressForm.get('addressResponseBean.country')?.setValue('')
      this.addressForm.get('addressResponseBean.adrCountryName')?.setValue('')
    }
  }
}
