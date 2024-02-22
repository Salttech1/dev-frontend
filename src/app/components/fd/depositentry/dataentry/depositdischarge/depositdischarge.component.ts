import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { map, Subscription, take } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as constant from '../../../../../../constants/constant'
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
declare const $: any;
import { DatePipe } from '@angular/common';
import { ModalService } from 'src/app/services/modalservice.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { Router } from '@angular/router';

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
}

@Component({
  selector: 'app-depositdischarge',
  templateUrl: './depositdischarge.component.html',
  styleUrls: ['./depositdischarge.component.css'],
  providers: [
    //   the above line required for date format
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }
  ]
})
export class DepositdischargeComponent implements OnInit {

  tabContentFlag: boolean = false;
  isDisDate: boolean = false;
  isValidationMessage!: string;
  columnHeader!: any[];
  tableData: any;
  bringBackColumn!: number;
  depositorTableData: any;
  deptColumnHeader!: any[];
  deptDyanPop!: string
  coy_condition = "coy_fdyn='Y'"
  dtOptions: any
  activeDepositsContainer = false
  calcInterestContainer = false
  passRetrieveApiUrl: string = constant.api_url.depositDischargeRetrieve
  fetchRetrievedData: any = []
  totalResultSet = 0;
  datePipe = new DatePipe('en-US')
  disDateChkValidation: any = []
  bankCodeColumnHeader: any = []
  bankTableData: any
  error_message = 'error'
  readonlyAttr = true
  bankQueryCodition!: string
  disabledFlagRetrieve: boolean = false
  disabledFlagCalcInterest: boolean = true
  disabledFlagNextGroup: boolean = true
  disabledFlagReset: boolean = false
  disabledFlagSave: boolean = true
  disabledFlagBack: boolean = true
  isRetrieveFlag!: boolean
  calInterestFetchData: any = []
  groupNoIncr: number = 1
  chequeColumnHeader: any = []
  chequeTableData: any
  coy!: string
  proprietor!: string
  depositor!: number
  chequeQueryCondition!: string
  saveValidationFlag: boolean = false
  isCheckedCalcInt: boolean = true
  calcInterestNotClicked: boolean = false
  isValidationCompletes: boolean = true
  isValidationFielsFocus!: string
  loaderToggle: boolean = false
  TabPressedOnChange: boolean = false
  onInputAltSPressed: boolean = false
  isAltSValidationMessage!: string
  isAltSValidationFieldFocus!: string
  disabledFlagExit:boolean=false
  isValidationErrorFieldShow=true
  // postSavedCalculatedInterestData:any
  constructor(private dynapop: DynapopService, private actionService: ActionservicesService, private changeRef: ChangeDetectorRef, private http: HttpClient, private modalService: ModalService, private dialog: MatDialog, private rendered: Renderer2, private toastr: ToasterapiService,private router:Router) { }
  ngOnInit(): void {
    this.getCompanyList()
    this.dtOptions = {
      pageLength: 10,
      processing: false,
      lengthChange: false,
      deferRender: false,
      bPaginate: false,
      bInfo: false,
      // order: [[1, 'asc']]
    }
  }
  ngAfterViewInit(): void {
    this.focusField();
  }



  //To add default focus on input field
  focusField() {
    //Below getElementById should be unique id in every component
    let el = document.getElementById('company3')?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  tblSearch(inputid: string, tblName: string) {
    $(`#${inputid}`).on("keyup", (event: any) => {
      $(`#${tblName}`).DataTable().search(event?.target.value).draw();
    })
  }

  ngAfterContentChecked() {
    this.changeRef.detectChanges()
    if (this.fetchRetrievedData.length > 0) {
      this.actionService.commonFlagCheck(true, true, true, true, true, true, true, false, true, true, false)
    }
    else if (this.fetchRetrievedData.length == 0) {
      this.actionService.commonFlagCheck(true, false, true, true, true, true, true, false, true, true, true)
    }
    if (this.calcInterestContainer) {
      this.actionService.commonFlagCheck(true, true, true, true, true, false, false, true, true, true, true)
    }
    if (this.depositDischargeFormGroup.get('companyCode')?.value == '') {
      this.depositDischargeFormGroup.patchValue({
        companyName: ''
      })
    }
    else if (this.depositDischargeFormGroup.get('depositorId')?.value == '') {
      this.depositDischargeFormGroup.patchValue({
        name: ''
      })
      this.calcInterestNotClicked
    }
  }

  depositDischargeFormGroup = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    companyName: new FormControl(''),
    depositorId: new FormControl('', Validators.required),
    name: new FormControl(''),
    isProvision: new FormControl(false),
  })

  // active Table array
  public activeDepositsArray: any = []

  // updateAllBankCodeField() {
  //   console.log("bank field")
  // }

  getCompanyList() {
    this.dynapop.getDynaPopListObj("COMPANY", "coy_fdyn='Y'").subscribe((res: any) => {
      this.columnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.tableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  updateCompanyList(compData: any) {
    if (compData != undefined) {
      this.depositDischargeFormGroup.patchValue({ companyName: compData[this.bringBackColumn] })
      //get depositor list
      this.deptDyanPop = `deptr_coy='${compData[this.bringBackColumn - 1]}'`
      this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${compData[this.bringBackColumn - 1]}'`)
        .subscribe((res: any) => {
          this.deptColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
          this.depositorTableData = res.data
        })
    }
  }

  updateListControl(val: any, formControl: any) {
    if (val != undefined) { formControl.setValue(val[this.bringBackColumn]) }
  }
  chekBoxToggle(event: any) {
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
    }
  }

  chekedCount(disDateChk: string, event: any, matDate: any) {
    if (event.target.checked == true) {
      // if ((document.getElementById(`disdate_${disDateChk}`) as HTMLInputElement).value == '') {
      //   this.disDateChkValidation.push(`disdate_${disDateChk}`)
      // }
      this.fetchRetrievedData[disDateChk].interestrate = this.fetchRetrievedData[disDateChk].intrate
      this.fetchRetrievedData[disDateChk].compareIntRate = this.fetchRetrievedData[disDateChk].intrate
      this.fetchRetrievedData[disDateChk].disDate = new Date(`${matDate.split("/")[2]}-${matDate.split("/")[1]}-${matDate.split("/")[0]}`);
      this.fetchRetrievedData[disDateChk].isChecked = true;

      setTimeout(() => {
        (document.getElementById(`disdate_${disDateChk}`) as HTMLInputElement)?.focus()
      }, 50)

    }
    else if (event.target.checked == false) {
      this.disDateChkValidation.map((item: any, index: any) => {
        if (this.disDateChkValidation[index] == `disdate_${disDateChk}`) {
          this.disDateChkValidation.splice(index, 1)
        }
      })
      this.fetchRetrievedData[disDateChk].interestrate = 0
      this.fetchRetrievedData[disDateChk].compareIntRate = 0
      this.fetchRetrievedData[disDateChk].intrate = this.fetchRetrievedData[disDateChk].matIntRate
      this.fetchRetrievedData[disDateChk].disDate = null
      this.fetchRetrievedData[disDateChk].isChecked = false
    }
    this.disDateChkValidation.sort()
    var resultCount = 0
    var checkboxes: any = document.querySelectorAll('.activetbl-chk-input');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        resultCount = Number(resultCount) + 1
      }
      this.totalResultSet = resultCount
    }
  }

  dateValidation(depDateIndex: any, currentDate: any, disDate: any, depDate: any, matDate: any, receiptNum: number) {
    if (!moment(currentDate.target.value, 'yyyy-MM-dd', true).isValid()) {
      currentDate.target.value = null
      document.getElementById(`disdate_${depDateIndex}`)?.focus()
    }
    let currentDateCheck: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    if (disDate < currentDateCheck) {
      if (!this.calcInterestNotClicked) {
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Discharge date cannot be less than current date", document.getElementById(`disdate_${depDateIndex}`)?.focus(), this.error_message)
      }
      currentDate.target.value = null
      if (this.calcInterestNotClicked) {
        this.isValidationCompletes = false
        this.isValidationFielsFocus = `disdate_${depDateIndex}`
        this.isValidationMessage = "Discharge date cannot be less than current date"
        this.fetchRetrievedData[depDateIndex].disDate = null
      }
    }
    // if (disDate > matDate) {
    //   if (!this.calcInterestNotClicked) {
    //     this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Discharge date cannot be greater than maturity date", document.getElementById(`disdate_${depDateIndex}`)?.focus(), this.error_message)
    //   }
    //   currentDate.target.value = null
    //   if (this.calcInterestNotClicked) {
    //     this.isValidationCompletes = false
    //     this.isValidationFielsFocus = `disdate_${depDateIndex}`
    //     this.isValidationMessage = "Discharge date cannot be greater than maturity date"
    //   }
    //   this.fetchRetrievedData[depDateIndex].disDate = null
    // }

    this.disDateChkValidation.map((item: any, index: any) => {
      if (this.disDateChkValidation[index] == `disdate_${depDateIndex}`) {
        this.disDateChkValidation.splice(index, 1)
      }
    })
    if (currentDate.target.value != null) {
      if (!(document.getElementById(`activeChkBox_${depDateIndex}`) as HTMLInputElement)?.checked) {
        let checkedReceiptNum = document.getElementById(`activeChkBox_${depDateIndex}`) as HTMLInputElement | null;
        if (checkedReceiptNum != null) {
          var resultCount = 0
          checkedReceiptNum.checked = true;
          this.fetchRetrievedData[depDateIndex].isChecked = true
          var checkboxes: any = document.querySelectorAll('.activetbl-chk-input');
          for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              resultCount = Number(resultCount) + 1
            }
            this.totalResultSet = resultCount
          }
        }
        //  this.isValidationCompletes = true
      }
    }
    if (currentDate.target.value == null && (document.getElementById(`activeChkBox_${depDateIndex}`) as HTMLInputElement)?.checked) {
      this.disDateChkValidation.push(`disdate_${depDateIndex}`)
      this.calcInterestNotClicked = false
    }
    this.disDateChkValidation.sort()
    if (currentDate.target.value != null) {
      if (this.calcInterestNotClicked) {
        this.loaderToggle = true
        this.isValidationCompletes = false
        this.isValidationErrorFieldShow = false
      }
      let resDataInt: any = []
      this.fetchIntetrestRate(receiptNum, matDate, currentDate.target.value).subscribe({
        next: (res: any) => {
          resDataInt = res
        },
        complete: () => {
          this.loaderToggle = false
          if (resDataInt?.status) {
            this.fetchRetrievedData[depDateIndex].compareIntRate = resDataInt.data
            this.fetchRetrievedData[depDateIndex].interestrate = resDataInt.data
            this.fetchRetrievedData[depDateIndex].intrate = this.fetchRetrievedData[depDateIndex].interestrate
            if (!this.isValidationErrorFieldShow) {
              this.calcInterest()
              this.isValidationErrorFieldShow = true
            }
          }
          else {
            this.isValidationErrorFieldShow = true
          }

        }
      })
      //  this.fetchIntetrestRate[depDateIndex].disdate
    }
  }

  getBankCode() {
    this.bankQueryCodition = `bank_company='${this.depositDischargeFormGroup.get('companyCode')?.value}'`
    this.dynapop.getDynaPopListObj("BANKS", `bank_company='${this.depositDischargeFormGroup.get('companyCode')?.value}'`).subscribe((res: any) => {
      this.bankCodeColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.bankTableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  fetchIntetrestRate(receiptNum: any, matDate: any, disDate: any) {
    let params = new HttpParams()
      .set("depositor", `${this.depositDischargeFormGroup?.get("depositorId")?.value}`)
      .set("companyCode", `${this.depositDischargeFormGroup?.get("companyCode")?.value}`)
      .set("receiptNumber", `${receiptNum}`)
      .set("maturityDate", `${this.datePipe.transform(matDate, 'dd/MM/yyyy')}`)
      .set("dischargeDate", `${this.datePipe.transform(disDate, 'dd/MM/yyyy')}`)
    return this.http.get(`${environment.API_URL}${constant.api_url.depositDischargeFetchInterestRate}`, { params })
  }


  // action panel
  actionDisabledEnabledButtons(isRetrieveFlag: boolean, isCalcInterest: boolean, isNextGroup: boolean, isReset: boolean, isSaveFlag: boolean, isBack: boolean) {
    this.disabledFlagRetrieve = isRetrieveFlag
    this.disabledFlagCalcInterest = isCalcInterest
    this.disabledFlagNextGroup = isNextGroup
    this.disabledFlagReset = isReset
    this.disabledFlagSave = isSaveFlag
    this.disabledFlagBack = isBack
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
      this.tabContentFlag = true
      this.activeDepositsContainer = true
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      this.depositDischargeFormGroup.reset()
      this.tabContentFlag = false
      this.activeDepositsContainer = false;
      (document.getElementById('company3')?.childNodes[0] as HTMLInputElement)?.focus()
      this.depositDischargeFormGroup.patchValue({
        isProvision: false
      })
    });
  }

  afterSaveShowErrorDialog(titleVal: any, message: string, type: string) {
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

    })
    dialogRef.afterClosed().subscribe((result: any) => {
      this.depositDischargeFormGroup.enable()
      this.depositDischargeFormGroup.reset()
      this.fetchRetrievedData = []
      this.calInterestFetchData = []
      this.calcInterestContainer = false
      this.totalResultSet = 0
      this.groupNoIncr = 1
      this.actionDisabledEnabledButtons(false, true, true, false, true, true)
      this.disabledFlagExit = false
      this.focusField();
      this.depositDischargeFormGroup.patchValue({
        isProvision: false
      });
      (document.getElementById('company3')?.childNodes[0] as HTMLInputElement)?.focus()

    });
  }

  retrieve() {
    if (this.depositDischargeFormGroup?.valid) {
      this.loaderToggle = true
      let params = new HttpParams()
        .set("depositorId", `${this.depositDischargeFormGroup?.get("depositorId")?.value}`)
        .set("companyCode", `${this.depositDischargeFormGroup?.get("companyCode")?.value}`)
      this.http.get(`${environment.API_URL}${this.passRetrieveApiUrl}`, { params }).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.loaderToggle = false
            this.isRetrieveFlag = true
            this.fetchRetrievedData = res.data
            this.tabContentFlag = true
            this.activeDepositsContainer = true
            this.calcInterestContainer = false
            this.depositDischargeFormGroup.patchValue({
              name: this.fetchRetrievedData[0]?.depositorName
            })
            this.depositDischargeFormGroup.disable()
            this.actionDisabledEnabledButtons(true, false, true, false, true, true)
            this.initalFetchUpdatedValue()
            this.coy = res.data[0]?.coy
            this.depositor = res.data[0]?.depositor
            this.proprietor = res.data[0]?.proprietor
            setTimeout(() => {
              document.getElementById('disdate_0')?.focus()
            }, 50);
            this.disabledFlagExit = true
          }
          if (res.status == false) {
            this.loaderToggle = false
            this.showErrorDialog(constant.ErrorDialog_Title, `${res.message}`, this.error_message)
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
        }
      })
    }
    if (!this.depositDischargeFormGroup?.valid) {
      this.depositDischargeFormGroup?.markAllAsTouched()
    }
  }
  nextGroup() {
    this.groupNoIncr++
    this.toastr.showInfo(`Grooup has been incremented by ${this.groupNoIncr}`)
  }
  reset() {
    this.depositDischargeFormGroup.reset()
    this.depositDischargeFormGroup.enable()
    this.tabContentFlag = false
    this.fetchRetrievedData = []
    this.disDateChkValidation = []
    this.calInterestFetchData = []
    this.totalResultSet = 0
    this.groupNoIncr = 1
    this.actionDisabledEnabledButtons(false, true, true, false, true, true)
    this.disabledFlagExit = false
    this.focusField();
    this.depositDischargeFormGroup.patchValue({
      isProvision: false
    });
  }
  back() {
    this.depositDischargeFormGroup.enable()
    this.depositDischargeFormGroup.reset()
    this.fetchRetrievedData = []
    this.calInterestFetchData = []
    this.calcInterestContainer = false
    this.totalResultSet = 0
    this.groupNoIncr = 1
    this.actionDisabledEnabledButtons(false, true, true, false, true, true)
    this.focusField();
    this.depositDischargeFormGroup.patchValue({
      isProvision: false
    })
    this.disabledFlagExit = false
  }

  calcInterest() {
    if (this.totalResultSet == 0) {
      this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Atleast one row has to be selected", this.error_message)
    }
    else if (this.totalResultSet > 0) {
      if (this.disDateChkValidation.length > 0) {
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "invalid date", document.getElementById(`${this.disDateChkValidation[0]}`)?.focus(), this.error_message)
      }
      else {
        this.getBankCode()
        if (this.isValidationCompletes) {
          this.loaderToggle = true
          this.http.post(`${environment.API_URL}${constant.api_url.depositDischargeCalcInterest}`, { "depositRequestBeanList": this.postCalcInterestData(), isProvision: this.depositDischargeFormGroup.get('isProvision')?.value })
            .pipe(map((res: any, index: any) => {
              //  if(res.status){
              let fromApiCalcIntArr: any = [], calcIntArrList: any = [], calcIntObj = {};
              for (var i = 0; i < res.data.length; i++) {
                fromApiCalcIntArr.push(res.data[i].depositDischargeBeanList)
              }
              calcIntArrList = [].concat(...fromApiCalcIntArr)
              calcIntObj = { data: calcIntArrList, status: res.status, message: res.message }
              return calcIntObj
              // }
            }), take(1))
            .subscribe({
              next: (res: any) => {
                if (res.status) {
                  this.loaderToggle = false
                  this.calInterestFetchData = res.data
                  this.activeDepositsContainer = false
                  this.calcInterestContainer = true
                  this.actionDisabledEnabledButtons(true, true, false, true, false, false)
                  this.setIntialGroupNo()
                  this.fetchRetrievedData = []
                  this.totalResultSet = 0
                  setTimeout(function () {
                    //document.getElementById('bankCode_0')?.focus();
                    (document.getElementById('bankCode_0')?.childNodes[0] as HTMLInputElement)?.focus()
                  }, 50)
                }
                else {
                  this.loaderToggle = false
                  this.modalService.showErrorDialog(constant.ErrorDialog_Title, `${res.message}`, this.error_message)
                }
              },
              error: (error: any) => {
                this.loaderToggle = false
              }
            })

        }
        else if (!this.isValidationCompletes) {
          this.isValidationErrorFieldShow && this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, `${this.isValidationMessage}`, document.getElementById(`${this.isValidationFielsFocus}`)?.focus(), this.error_message)
        }
      }
    }
    this.calcInterestNotClicked = false
    this.isValidationMessage = ''
    this.isValidationFielsFocus = ''
    this.isValidationCompletes = true

  }

  chkInterestRateVal(event: any, receiptNum: any, matDate: any, currentDate: any, index: any, compareIntRate: any) {
    if (currentDate) {
      //  this.fetchIntetrestRate(receiptNum, matDate, currentDate).subscribe((res: any) => {
      if (event.target.value > this.fetchRetrievedData[index].compareIntRate) {

        if (!this.calcInterestNotClicked) {
          this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Interest Rate cannot be above the maximum limit", document.getElementById(`interestRate_${index}`)?.focus(), this.error_message)
        }
        else if (this.calcInterestNotClicked) {
          this.isValidationCompletes = false
          this.isValidationFielsFocus = `interestRate_${index}`
          this.isValidationMessage = "Interest Rate cannot be above the maximum limit"
        }
        event.target.value = this.fetchRetrievedData[index].compareIntRate
      }
      this.fetchRetrievedData[index].intrate = event.target.value
      this.fetchRetrievedData[index].interestrate = event.target.value
      // })
    }
    else {
      event.target.value = 0
      this.fetchRetrievedData[index].compareIntRate = 0
    }
    if (!event.target.value) {
      event.target.value = this.fetchRetrievedData[index].compareIntRate
      this.fetchRetrievedData[index].intrate = event.target.value
      this.fetchRetrievedData[index].interestrate = event.target.value
    }
  }

  getKeyCode(e: any) {
    if (e.altKey && e.keyCode == 67) {
      this.calcInterestNotClicked = true;
    }
  }

  initalFetchUpdatedValue() {
    for (var i = 0; i < this.fetchRetrievedData.length; i++) {
      this.fetchRetrievedData[i].interestrate = 0
      this.fetchRetrievedData[i].matIntRate = this.fetchRetrievedData[i].intrate
    }
  }

  postCalcInterestData() {
    let postCalcIntrArr: any = []
    for (var i = 0; i < this.fetchRetrievedData.length; i++) {
      if (this.fetchRetrievedData[i].isChecked) {
        const copy = JSON.parse(JSON.stringify(this.fetchRetrievedData[i]))
        copy.matdate = this.datePipe.transform(copy.matdate, 'dd/MM/yyyy')
        copy.depdate = this.datePipe.transform(copy.depdate, 'dd/MM/yyyy')
        copy.disdate = this.datePipe.transform(copy.disDate, 'dd/MM/yyyy')
        postCalcIntrArr.push(copy)
      }
    }
    return postCalcIntrArr
  }

  // next group component
  setIntialGroupNo() {
    this.calInterestFetchData.map((res: any) => {
      res.viewGrpNo = this.groupNoIncr
      res.chqDate = new Date(`${res.dischargeDate.split("/")[2]}-${res.dischargeDate.split("/")[1]}-${res.dischargeDate.split("/")[0]}`);
      res.chequeDate = this.datePipe.transform(res.chqDate, 'dd/MM/yyyy');
      res.bankCode = null
      res.cheque = null
      res.isCheckedCalcInt = true
      res.transer = null
    })
  }

  toggleCalcIntChkBox(receiptNum: number, currentIndex: number) {
    this.calInterestFetchData.map((res: any, index: any) => {
      if (res.receiptNumber == receiptNum) {
        let checkedReceiptNum = document.getElementById(`chkCalcInt_${index}`) as HTMLInputElement;
        if (checkedReceiptNum) {
          if (currentIndex != index) {
            checkedReceiptNum.checked ? checkedReceiptNum.checked = false : checkedReceiptNum.checked = true
          }
          if (!checkedReceiptNum.checked) {
            this.calInterestFetchData[index].viewGrpNo = ''
            let bank_code = document.getElementById(`bankCode_${index}`)?.childNodes[0] as HTMLInputElement
            let cheque = document.getElementById(`cheque_${index}`)?.childNodes[0] as HTMLInputElement
            res.bankCode = null
            res.cheque = null
            res.isCheckedCalcInt = false
            bank_code.disabled = true
            cheque.disabled = true
          }
          else {
            this.calInterestFetchData[index].viewGrpNo = this.groupNoIncr
            var bank_code = document.getElementById(`bankCode_${index}`)?.childNodes[0] as HTMLInputElement
            var cheque = document.getElementById(`cheque_${index}`)?.childNodes[0] as HTMLInputElement
            const focusField = document.getElementById(`bankCode_${currentIndex}`)?.childNodes[0] as HTMLInputElement
            bank_code.disabled = false
            cheque.disabled = false
            focusField.focus()
            res.isCheckedCalcInt = true
          }
        }
      }
    })
  }


  groupBankCodeUpdateValue(event: any, index: any, viewGrpNoVal: any) {
    if ((document.getElementById(`chkCalcInt_${index}`) as HTMLInputElement)?.checked) {
      this.calInterestFetchData.map((res: any, i: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          if (event != undefined) {
            res.bankCode = event[0]
            //  res.cheque = this.calInterestFetchData[index].cheque
          }
        }
      })
    }
  }

  getBankCodeFielsValueChange(viewGrpNoVal: any, event: any, index: any) {
    let tempCalFetchDataList = this.calInterestFetchData
    const result = this.bankTableData.dataSet.filter((s: any, i: any) => {
      if (this.bankTableData.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.bankTableData.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (result.length == 0) {
        event.target.value = null;
        if (!this.TabPressedOnChange && !this.onInputAltSPressed) {
          this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid bank Code", (document.getElementById(`bankCode_${index}`)?.childNodes[0] as HTMLInputElement)?.focus(), "error")
        }
        if (this.onInputAltSPressed) {
          this.isAltSValidationFieldFocus = `bankCode_${index}`
          this.isAltSValidationMessage = "Invalid bank Code "
        }
        this.calInterestFetchData.map((res: any, i: any) => {
          if (res.viewGrpNo === viewGrpNoVal) {
            res.bankCode = event?.target?.value
          }
        })
        this.TabPressedOnChange = false
      }
      else {
        event.target.value = result[0][0]
        this.calInterestFetchData.map((res: any, i: any) => {
          if (res.viewGrpNo === viewGrpNoVal) {
            res.bankCode = event?.target?.value
          }
        })
        this.onInputAltSPressed = false
      }
    }
    if (event?.target?.value == "") {
      this.calInterestFetchData.map((res: any, i: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          res.bankCode = null;
          (document.getElementById(`bankCode_${index}`)?.childNodes[0] as HTMLInputElement)?.focus()
        }
      })
    }
    this.calInterestFetchData.map((res: any, i: any) => {
      if (res.viewGrpNo === viewGrpNoVal) {
        res.cheque = null
      }
    })
  }

  groupChequeNoFieldValueChange(viewGrpNoVal: any, event: any, index: any) {
    let tempCalFetchDataList = this.calInterestFetchData
    const chqResult = this.chequeTableData.dataSet.filter((s: any, i: any) => {
      if (this.chequeTableData?.dataSet[i][0].trim() === event?.target?.value.toUpperCase()) {
        return this.chequeTableData?.dataSet[i];
      }
      else {
        return null
      }
    })
    if (event?.target?.value) {
      if (chqResult.length == 0) {
        event.target.value = null
        if (!this.TabPressedOnChange && !this.onInputAltSPressed) {
          this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Cheque No", (document.getElementById(`cheque_${index}`)?.childNodes[0] as HTMLInputElement)?.focus(), "error")
        }
        if (this.onInputAltSPressed) {
          this.isAltSValidationFieldFocus = `cheque_${index}`
          this.isAltSValidationMessage = "Invalid Cheque No"
        }
        this.calInterestFetchData.map((res: any, i: any) => {
          if (res.viewGrpNo === viewGrpNoVal) {
            res.cheque = event?.target?.value
          }
        })
        this.TabPressedOnChange = false
      }
      else {
        event.target.value = chqResult[0][0]
        this.calInterestFetchData.map((res: any, i: any) => {
          if (res.viewGrpNo === viewGrpNoVal) {
            res.cheque = event?.target?.value
          }
        })
        this.onInputAltSPressed = false
      }
    }
    if (event?.target?.value == "") {
      this.calInterestFetchData.map((res: any, i: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          res.cheque = null;
          (document.getElementById(`cheque_${index}`)?.childNodes[0] as HTMLInputElement)?.focus()
        }
      })
    }
  }

  groupChequeUpdateValue(event: any, index: any, viewGrpNoVal: any) {
    if ((document.getElementById(`chkCalcInt_${index}`) as HTMLInputElement)?.checked) {
      this.calInterestFetchData.map((res: any, i: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          if (event != undefined) {
            res.cheque = event[0]
          }
        }
      })
    }
  }

  getChequeList(bankCode: any, i: any) {
    this.chequeTableData = []
    this.chequeQueryCondition = `VCHQ_COY = '${this.coy?.trim()}' and VCHQ_proprietor = '${this.proprietor?.trim()}' and VCHQ_BANK = '${bankCode?.toUpperCase().trim()}'`
    this.dynapop.getDynaPopListObj('CHEQUENUMS', `VCHQ_COY = '${this.coy?.trim()}' and VCHQ_proprietor = '${this.proprietor?.trim()}' and VCHQ_BANK = '${bankCode?.toUpperCase().trim()}'`).subscribe((res: any) => {
      this.chequeColumnHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
      this.chequeTableData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  chequeList(event: any, bankcode: any, index: any) {
    this.getChequeList(bankcode, index)
  }

  clearBankCode(event: any, i: any, viewGrpNoVal: any) {
    if (event.length == 0) {
      this.calInterestFetchData.map((res: any, i: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          res.bankCode = null
        }
      })
      let bank_code: any = document.getElementById(`bankCode_${i}`)?.childNodes[0] as HTMLInputElement
      bank_code?.focus()
    }
  }

  validateChqDate(currentDateVal: any, currIndex: any, event: any, viewGrpNoVal: any, index: any) {
    // get maximum date
    let datesArr: any = []
    this.calInterestFetchData.map((res: any) => {
      datesArr.push(new Date(`${res.dischargeDate.split("/")[2]}-${res.dischargeDate.split("/")[1]}-${res.dischargeDate.split("/")[0]}`))
    })
    const maxDate = new Date(
      Math.max(
        ...datesArr.map((element: any) => {
          return new Date(element);
        }),
      ),
    );


    //var dateString = maxDate
    var dateFormat = new Date(maxDate)
    new Date(dateFormat.setDate(dateFormat.getDate() - 1))
    var oneDayMore = new Date(dateFormat.setDate(dateFormat.getDate() + 1))
    var currentDate = new Date(currentDateVal)
    if (oneDayMore > currentDate) {
      !this.onInputAltSPressed && this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Cheque date cannot be less than  discharge date", (document.getElementById(`chqDate_${index}`) as HTMLInputElement)?.focus(), this.error_message)
      event.target.value = "";
      this.calInterestFetchData.map((res: any, index: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          this.calInterestFetchData[index].chqDate = null
          this.calInterestFetchData[index].chequeDate = null
        }
      })
    }
    else {
      this.calInterestFetchData.map((res: any, index: any) => {
        if (res.viewGrpNo === viewGrpNoVal) {
          this.calInterestFetchData[index].chqDate = event.target.value
          this.calInterestFetchData[index].chequeDate = this.datePipe.transform(event.target.value, 'dd/MM/yyyy')
        }
      })
    }
  }

  banCodeValidation() {
    let validationChk = this.calInterestFetchData
    for (var i = 0; i < validationChk.length; i++) {
      if (!validationChk[i].bankCode) {
        let bankCode = document.getElementById(`bankCode_${i}`)?.childNodes[0] as HTMLInputElement
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, 'Bank code cannot be left blank', bankCode?.focus(), this.error_message)
        return false
      }
    }
    return true
  }
  chequeValidation() {
    let validationChk = this.calInterestFetchData
    for (var i = 0; i < validationChk.length; i++) {
      if (!validationChk[i].cheque) {
        let cheque = document.getElementById(`cheque_${i}`)?.childNodes[0] as HTMLInputElement
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, 'cheque Number cannot be left blank', cheque?.focus(), this.error_message)
        return false
      }
    }
    return true
  }

  chequeDateValidation() {
    let validationChk = this.calInterestFetchData
    for (var i = 0; i < validationChk.length; i++) {
      if (!validationChk[i].chqDate) {
        let chequeDate = document.getElementById(`chqDate_${i}`) as HTMLInputElement
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, 'Invalid Cheque Date', chequeDate?.focus(), this.error_message)
        return false
      }
    }
    return true
  }

  save() {
    let savedDischargeArr = this.calInterestFetchData
    if (this.onInputAltSPressed) {
      if (this.isAltSValidationMessage) {
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, this.isAltSValidationMessage, (document.getElementById(`${this.isAltSValidationFieldFocus}`)?.childNodes[0] as HTMLInputElement)?.focus(), "error")
      }
      else {
        this.onInputAltSPressed = false
      }
    }
    if (this.onInputAltSPressed == false) {
      if (this.banCodeValidation()) {
        if (this.chequeValidation()) {
          if(this.chequeDateValidation()){
          this.disabledFlagSave = true
          this.loaderToggle = true
          let transerData: any = [];
          let tempCalFetchData = this.calInterestFetchData
          let saveApi = { "depositDischargeBeanList": savedDischargeArr, coy: this.coy, depositor: this.depositor, userId: sessionStorage?.getItem('userName'), isProvision: this.depositDischargeFormGroup.get('isProvision')?.value }
          let resData: any
          this.http.post(`${environment.API_URL}${constant.api_url.saveDepositDischargeCalcInterest}`, saveApi).pipe(take(1)).subscribe({
            next: (res: any) => {
              transerData = res.data
              resData = res
              if (res.status) {
                this.loaderToggle = false
                transerData = res.data
                this.afterSaveShowErrorDialog(constant.ErrorDialog_Title, `${res.message}`, "info")
              }
              else {
                this.loaderToggle = false
                this.disabledFlagSave = false
                this.modalService.showErrorDialog(constant.ErrorDialog_Title, `${res.message}`, "error")
              }
            },
            error: (err: any) => {
              this.loaderToggle = false
              this.disabledFlagSave = false
            },
            complete() {
              if (resData.status) {
                tempCalFetchData.map((res: any, i: any) => {
                  for (var index = 0; index < transerData.length; index++) {
                    if (transerData[index].bankCode.trim() === res.bankCode.trim()) {
                      tempCalFetchData[i].transer = transerData[index].transer
                    }
                  }
                })
              }
            }
          })
        }
        }
      }
    }
    this.onInputAltSPressed = false
    this.isAltSValidationMessage = ''
    this.isAltSValidationFieldFocus = ''
  }
  ddCharges(ddCharges: number, deptAmount: number, i: any) {
    if (ddCharges > deptAmount) {
      if (!this.calcInterestNotClicked) {
        this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, 'DD Charges cannot be greater than Deposit Amount', document.getElementById(`ddCharges_${i}`)?.focus(), this.error_message)
      }
      this.fetchRetrievedData[i].ddCharges = 0
      if (this.calcInterestNotClicked) {
        this.isValidationCompletes = false
        this.isValidationFielsFocus = `ddCharges_${i}`
        this.isValidationMessage = "DD Charges cannot be greater than Deposit Amount"
      }
    }
    // else {
    //   if (this.calcInterestNotClicked) {
    //     this.calcInterestNotClicked = false
    //   }
    // }
  }

  onEnterToggleCalcIntChkBox(event: any, receiptNum: any, index: any) {
    event.preventDefault()
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
      this.toggleCalcIntChkBox(receiptNum, index)
    }
  }
  onEnterTriggerCheckedCount(eventKeyCode: any, index: any, event: any, matdate: any) {
    event.preventDefault()
    if (event.key === "Enter") {
      event.preventDefault()
      event.target.checked ? event.target.checked = false : event.target.checked = true
      this.chekedCount(index, event, matdate)
    }
  }
  getKeyCodeCalcInterest(event: any) {
    if (event.keyCode == 9) {
      this.TabPressedOnChange = true
    }
    if (event.altKey && event.keyCode == 83) {
      if (event?.target?.value) {
        console.log("alt+s pressed");
        this.onInputAltSPressed = true
      }
    }
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
        this.depositDischargeFormGroup.patchValue({
          companyCode: ''
        })
      }
      else {
        this.depositDischargeFormGroup.patchValue({
          companyName: result[0][1].trim()
        })
      }
    }
  }
  updateDepositorList() {
    this.deptDyanPop = `deptr_coy='${this.depositDischargeFormGroup.get('companyCode')?.value}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS", `deptr_coy='${this.depositDischargeFormGroup.get('companyCode')?.value}'`)
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
        this.depositDischargeFormGroup.patchValue({
          depositorId: ''
        })
      }
      else {
        this.depositDischargeFormGroup.patchValue({
          name: result[0][1].trim()
        })
      }
    }
  }
  handleExit() {
    this.router.navigate(['/dashboard'])
  }
}