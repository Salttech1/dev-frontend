import { Component, OnInit, ViewChild , Renderer2, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynapopService } from 'src/app/services/dynapop.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import * as constant from '../../../../../../constants/constant';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modalservice.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { Router } from '@angular/router';
import { AddressComponent } from 'src/app/components/common/address/address.component';
import { PartyComponent } from 'src/app/components/common/party/party.component';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { finalize, take } from 'rxjs';
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
  selector: 'app-deposittransfer',
  templateUrl: './deposittransfer.component.html',
  styleUrls: ['./deposittransfer.component.css'],
  providers: [
    AddressComponent,
    PartyComponent,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DeposittransferComponent implements OnInit {
  @ViewChild(AddressComponent) addressComponent!: any;
  @ViewChild(PartyComponent) partyComponent!: any;
  cityValueChangeFlag: boolean = false
  @Input() passCityData!: string
  @Input() getCityUpdatedFlag: boolean = false
  @ViewChild(F1Component) comp!: F1Component;
  @ViewChild(F1Component) chIn!: F1Component;
  titleValueChangeField: boolean = false
  _15gTDS: any
  _15hTDS: any
  none: any;
  constructor(
    private dynapop: DynapopService,
    private route: Router,
    private http: HttpClient,
    private actionService: ActionservicesService,
    private dialog: MatDialog,
    private modalService: ModalService,
    private cdref: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}
  datePipe = new DatePipe('en-US');
  compHeader!: any[];
  recieptColumnHeader!: any[];
  _depositorTitleColHeader!: any[];
  _depositorTypeTable: any;
  _depositorTypeColHeader!: any[];
  payToColumnHeader!: any[];
  deptColumnHeader!: any[];
  liquidityColumnHeader!: any[];
  compData: any;
  payToTableDate: any;
  liquidityTableDate: any;
  depositorTableData: any;
  _depositorTitleTable: any;
  bringBackColumn!: number;
  coy_condition = "coy_fdyn='Y'";
  saveDisabled: boolean = false;
  deptDyanPop: any;
  recieptDyanPop: any;
  recieptTableData: any;
  isRetrieveClicked: boolean = false;
  backClick: boolean = true;
  renewClick: boolean = false;
  saveClick: boolean = true;
  printClick: boolean = true;
  depositData!: any;
  origin: any;
  payto: any;
  liquidity: any;
  addressTabVal: any;
  depositorData!: any;
  depositorRetrieveAPI: string =
    'depositor/fetch-depositor-by-depositorid-and-companycode';
  newDepositorSelected: boolean = false;
  isDepositClicked: boolean = false;
  isDepositorClicked: boolean = true;
  showDepsoitor: boolean = false;
  showDeposit: boolean = false;
  depositRequestData: any;
  depositorRequestData: any;
  existingDepositorSelect: boolean = true;
  addressResponseBean!: FormGroup;
  existDepSelCount = 0;
  depositTransfer!: any;
  getPartyFormGroup!: FormGroup;
  payto_condition = "ent_class = 'PAYTO'";
  readonlyAttr: boolean = true;
  loader: boolean = false;

  ngOnInit(): void {
    this.transferSectionForm?.controls.companyName.disable();
    this.transferSectionForm?.controls.depositorName.disable();
    this.transferSectionForm.patchValue({
      transferDate: new Date(),
    });
    if (this.depositorDetailsForm.get('tds15gyn')?.value != undefined && this.depositorDetailsForm.get('tds15gyn')?.value != null && this.depositorDetailsForm.get('tds15gyn')?.value != "" && this.depositorDetailsForm.get('tds15gyn')?.value == "Y") {
      this._15gTDS = true
      this._15hTDS = false
      this.none = false
    }
    else if (this.depositorDetailsForm.get('tds15hyn')?.value != undefined && this.depositorDetailsForm.get('tds15hyn')?.value != null && this.depositorDetailsForm.get('tds15hyn')?.value != "" && this.depositorDetailsForm.get('tds15hyn')?.value == "Y") {
      this._15gTDS = false
      this._15hTDS = true
      this.none = false
    }
    else if (this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15hyn')?.value == null || this.depositorDetailsForm.get('tds15hyn')?.value == "" || this.depositorDetailsForm.get('tds15hyn')?.value == "N" && this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15gyn')?.value == null || this.depositorDetailsForm.get('tds15gyn')?.value == "" || this.depositorDetailsForm.get('tds15gyn')?.value == "N") {
      this._15gTDS = false
      this._15hTDS = false
      this.none = true
    }
    this.getCompanyList();
  }

  ngOnChanges() {
    if (this.depositorDetailsForm.get('tds15gyn')?.value != undefined && this.depositorDetailsForm.get('tds15gyn')?.value != null && this.depositorDetailsForm.get('tds15gyn')?.value != "" && this.depositorDetailsForm.get('tds15gyn')?.value == "Y") {
      this._15gTDS = true
      this._15hTDS = false
      this.none = false
    }
    else if (this.depositorDetailsForm.get('tds15hyn')?.value != undefined && this.depositorDetailsForm.get('tds15hyn')?.value != null && this.depositorDetailsForm.get('tds15hyn')?.value != "" && this.depositorDetailsForm.get('tds15hyn')?.value == "Y") {
      this._15gTDS = false
      this._15hTDS = true
      this.none = false
    }
    else if (this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15hyn')?.value == null || this.depositorDetailsForm.get('tds15hyn')?.value == "" || this.depositorDetailsForm.get('tds15hyn')?.value == "N" && this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15gyn')?.value == null || this.depositorDetailsForm.get('tds15gyn')?.value == "" || this.depositorDetailsForm.get('tds15gyn')?.value == "N") {
      this._15gTDS = false
      this._15hTDS = false
      this.none = true
    }
    this.getReceiveAddressData(this);
  }

  
  ngAfterViewInit(): void {
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus(); //To add default focus on input field
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    this.depositorDetailsForm.patchValue({
      pannum1: this.depositorDetailsForm.get('pannum1')?.value?.toUpperCase(),
      pannum2: this.depositorDetailsForm.get('pannum2')?.value?.toUpperCase()
    })
   this.depositTransferPayload();
    if(this.transferSectionForm.get('companyCode')?.value == ''){
      this.transferSectionForm.patchValue({
        companyName:''
      })
    }
    if(this.transferSectionForm.get('depositorId')?.value == ''){
      this.transferSectionForm.patchValue({
        depositorName:''
      })
    }
  }

  getReceiveAddressData(data: any) {
    this.addressResponseBean = data;
  }

  focusInputs() {
    setTimeout(() => {
      let focusElement3 = document.getElementById("newDepositor12")?.firstChild as HTMLElement
      this.renderer.selectRootElement(focusElement3).focus();
    }, 100);
  }

  
  
  inputFieldValueChangeTitle() {
    this.todayUpdateValue()
    this.titleValueChangeField = true
  }

  focusDepositorNameField(){
    setTimeout(() => {
    let depositorNameField = document.getElementById("depositorName")?.firstChild as HTMLElement
    this.renderer.selectRootElement(depositorNameField).focus();
    }, 100)
  }

  depositorPayLoadData() {
    this.addressComponent.addressForm.patchValue({'addressResponseBean':{
      userid: sessionStorage.getItem("userName")
    }
  });
  this.partyComponent.party.patchValue({
    userid: sessionStorage.getItem("userName")
  });

    this.depositorRequestData = {
      companyCode:
        this.depositorData == undefined
          ? this.transferSectionForm?.value.companyCode
          : this.depositorData?.coy,
      proprietor:
        this.depositorData != undefined && this.depositorData?.proprietor!=undefined
        ? this.depositorData?.proprietor 
          : this.depositorData?.proprietor,
      birthdate: this.depositorDetailsForm?.value.dbirthdate,
      title:  this.depositorDetailsForm?.value.title,
      name: this.depositorDetailsForm?.value.name,
      deptype: this.depositorDetailsForm?.value.deptype,
      remarks: this.depositorDetailsForm?.value.remarks,
      pannum1: this.depositorDetailsForm?.value.pannum1,
      pannum2: this.depositorDetailsForm?.value.pannum2,
      depamount:
        this.depositorData != undefined && this.depositData != undefined
          ? this.setDepositorAmount()
          : 0,
      grossint: 0,
      accint: 0,
      tds: 0,
      taxalwaysyn: this.depositorData == undefined
      ? 'Y'
      : this.depositorData.taxalwaysyn,
      tds15gyn:this.depositorDetailsForm?.value.tds15gyn,
      tds15hyn: this.depositorDetailsForm?.value.tds15hyn,
      today: this.depositorDetailsForm?.value.today,
      depositorId:
        this.depositorData == undefined
          ? ''
          : this.transferDataForm?.value.newDepositorId,
      addressRequestBean:
        this.addressResponseBean?.value.addressResponseBean.today == null &&
        this.depositorData != undefined
          ? this.depositorData.addressResponseBean
          : this.addressResponseBean?.value.addressResponseBean,
      partyRequestBean:
       this.getPartyFormGroup?.value.today == null && 
        this.depositorData != undefined
          ? this.depositorData.partyResponseBean
          : this.getPartyFormGroup?.value,
      isTransferSeries: true,
      city: this.addressResponseBean?.value.addressResponseBean.city,
      userid: sessionStorage.getItem('userName'),
    };
    return this.depositorRequestData;
  }


  updateCityFieldValueChange(event: boolean) {
    this.cityValueChangeFlag = event
  }

  depositPayLoadData() {
    this.depositRequestData = {
      oldDepositor: this.isRetrieveClicked
        ? this.transferSectionForm?.value.depositorId
        : '',
      receiptnum: this.isRetrieveClicked
        ? this.transferSectionForm?.value.recieptNum
        : '',
      depositor: this.existingDepositorSelect
        ? this.transferDataForm?.value.newDepositorId
        : '',
      receiptdate:
        this.depositData != undefined
          ? this.getFormattedDate(this.depositData?.receiptdate)
          : '',
      proprietor:
        this.depositData != undefined ? this.depositData?.proprietor : '',
      coy: this.depositData != undefined ? this.depositData?.coy : '',
      staffyn: this.transferDataForm?.value.staffyn,
      bankcode: this.depositData != undefined ? this.depositData?.bankcode : '',
      depdate:
        this.depositData != undefined
          ? this.getFormattedDate(this.depositData?.depdate)
          : '',
      liqtype: this.depositData != undefined ? this.depositData?.liqtype : '',
      depmonths:
        this.depositData != undefined ? this.depositData?.depmonths : '',
      intrate: this.depositData != undefined ? this.depositData?.intrate : '',
      intfreq: this.depositData != undefined ? this.depositData?.intfreq : '',
      broker:
        this.depositData != undefined && this.depositData.broker != undefined
          ? this.depositData.broker
          : null,
      brokcheq:
        this.depositData != undefined && this.depositData.brokcheq != undefined
          ? this.depositData.brokcheq
          : null,
      brokcheqdate:
        this.depositData != undefined &&
        this.depositData.brokcheqdate != undefined
          ? this.getFormattedDate(this.depositData.brokcheqdate)
          : null,
      brokerage:
        this.depositData != undefined && this.depositData.brokerage != undefined
          ? this.depositData.brokerage == 0
            ? null
            : this.depositData.brokerage
          : '',
      broktds:
        this.depositData != undefined && this.depositData.broktds != undefined
          ? this.depositData.broktds == 0
            ? null
            : this.depositData.broktds
          : '',
      tds: this.depositData != undefined ? this.depositData?.tds : 0,
      matdate:
        this.depositData != undefined
          ? this.getFormattedDate(this.depositData?.matdate)
          : '',
      canceldate:
        this.depositData != undefined
          ? this.getFormattedDate(this.depositData?.canceldate)
          : null,
      printedon:
        this.depositData != undefined && this.depositData.printedon != undefined
          ? this.depositData?.printedon
          : null,
      matamount:
        this.depositData != undefined ? this.depositData?.matamount : '',
      depamount:
        this.depositData != undefined ? this.depositData?.depamount : '',
      grossint: this.depositData != undefined ? this.depositData?.grossint : 0,
      accint: this.depositData != undefined ? this.depositData?.accint : 0,
      disdate:
        this.depositData != undefined ? this.getFormattedDate(new Date()) : '',
      intpaidytd:
        this.depositData != undefined &&
        this.depositData.intpaidytd != undefined
          ? this.depositData?.intpaidytd
          : 0,
      taxpaidytd:
        this.depositData != undefined &&
        this.depositData.taxpaidytd != undefined
          ? this.depositData?.taxpaidytd
          : 0,
      origreceipt: this.transferSectionForm?.value.recieptNum,
      jowner1: this.transferDataForm?.value.jowner1,
      jowner2: this.transferDataForm?.value.jowner2,
      jowner3: this.transferDataForm?.value.jowner3,
      nominee: this.transferDataForm?.value.nominee,
      deporigin: 'T',
      payeecode: this.transferDataForm?.value.payeecode,
      instructions:
        'Transfered from ' +
        this.transferSectionForm?.value.depositorId?.trim(),
      brokper: this.depositData != undefined ? this.depositData?.brokper : 0,
      instbp: this.depositData != undefined ? this.depositData?.instbp : '',
      instfdr: this.depositData != undefined ? this.depositData?.instfdr : '',
      instip: this.depositData != undefined ? this.depositData?.instip : '',
      waracc:
        this.depositData != undefined && this.depositData.waracc != undefined
          ? this.depositData.waracc
          : '',
      warbank:
        this.depositData != undefined && this.depositData.warbank != undefined
          ? this.depositData.warbank
          : '',
      intrate2: 0,
      intrateold:
        this.depositData != undefined &&
        this.depositData.intrateold != undefined
          ? this.depositData.intrateold
          : 0,
      transfer:
        this.depositData != undefined
          ? this.getFormattedDate(this.transferSectionForm?.value.transferDate)
          : '',
      userid: sessionStorage.getItem('userName'),
    };
    return this.depositRequestData;
  }

  depositTransferPayload() {
    this.depositTransfer = {
      depositRequestBean: this.depositPayLoadData(),
      depositorRequestBean: this.depositorPayLoadData(),
    };
    return this.depositTransfer;
  }

  selectDepositorType(selectedOption: any) {
    if (selectedOption == 'e') {
      this.existingDepositorSelect = true;
      
      this.actionService.getAddFlagUpdatedValue(false);
      this.actionService.getReterieveClickedFlagUpdatedValue(true);
      this.existDepSelCount = this.existDepSelCount + 1;
      this.showDepsoitor = false;
      this.showDeposit = true;
      this.focusInputs();
    }
    if (selectedOption == 'n') {
      if (this.addressComponent != undefined) {
        this.addressComponent.resetAddress();
        this.getPartyFormGroup?.reset();
        this.depositorData = undefined;
      }
      this.focusDepositorNameField();
      this.actionService.getAddFlagUpdatedValue(true);
      this.actionService.getReterieveClickedFlagUpdatedValue(false);
      this.existingDepositorSelect = false;
      this.getDepositorTitleList();
      this.getDepositorTypeList();
      this.showDepsoitor = true;
      this.showDeposit = false;
      this.isDepositClicked = true;
      this.isDepositorClicked = false;
      this.newDepositorSelected = true;
      this.depositorDetailsForm.reset();
      this.transferDataForm.get('jowner1')?.reset();
      this.transferDataForm.get('jowner2')?.reset();
      this.transferDataForm.get('jowner3')?.reset();
      this.transferDataForm.get('ngid1')?.reset();
      this.transferDataForm.get('ngid2')?.reset();
      this.transferDataForm.get('ngid3')?.reset();
      this.transferDataForm.patchValue({
        newDepositorId: '',
      });
      this.depositorDetailsForm.patchValue({
        tds15gyn: 'Y',
        tds15hyn: 'N'
      });
    }
  }
  setDepositorAmount() {
    if (this.newDepositorSelected) {
      return Number(this.depositData.depamount);
    } else {
      return Number(this.depositorData.depamount + this.depositData.depamount);
    }
  }

  transferSectionForm = new FormGroup({
    companyCode: new FormControl('', Validators.required),
    companyName: new FormControl(''),
    depositorId: new FormControl('', Validators.required),
    depositorName: new FormControl(''),
    recieptNum: new FormControl('', Validators.required),
    transferDate: new FormControl(),
  });

  transferDataForm = new FormGroup({
    coy: new FormControl(''),
    payeecode: new FormControl(''),
    jowner1: new FormControl(''),
    jowner2: new FormControl(''),
    jowner3: new FormControl(''),
    depmonths: new FormControl(''),
    ngid1: new FormControl(''),
    ngid2: new FormControl(''),
    ngid3: new FormControl(''),
    intrate: new FormControl(''),
    nominee: new FormControl(''),
    intfreq: new FormControl(''),
    newDepositorId: new FormControl(''),
    newReceiptNum: new FormControl(''),
    transDate: new FormControl(''),
    staffyn: new FormControl(''),
  });

  depositorDetailsForm = new FormGroup({
    name: new FormControl(''),
    dbirthdate: new FormControl(),
    depAmount: new FormControl(''),
    grossInt: new FormControl(''),
    tds: new FormControl(''),
    remarks: new FormControl(''),
    deptype: new FormControl(),
    title: new FormControl(''),
    deptypeName: new FormControl(),
    tds15gyn: new FormControl('Y'),
    tds15hyn: new FormControl('N'),
    today: new FormControl(),
    pannum1: new FormControl('', [Validators.maxLength(10),
      Validators.minLength(10), Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
      pannum2: new FormControl('', [Validators.maxLength(10),
      Validators.minLength(10), Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
  });
  getCompanyList() {
    this.dynapop
      .getDynaPopListObj('COMPANY', "coy_fdyn='Y'")
      .subscribe((res: any) => {
        this.compHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.compData = res.data;
        this.bringBackColumn = res.data.bringBackColumn;
      });
  }

  updateCompanyList(compData: any) {
    this.transferSectionForm.patchValue({
      companyName: compData[this.bringBackColumn].trim(),
    });
    this.getDepositorList(compData[this.bringBackColumn - 1]);
  }

  updateListControl(val: any, formControl: any) {
    formControl.setValue(val[this.bringBackColumn]);
  }

  scrollToEnd(){
    window.scrollTo(0, 440);
    
  }

  updateCalcs(event: any, id: any) {
    var datepipe = new DatePipe("en-IN")
    var yearVal: any = datepipe.transform(this.depositorDetailsForm.get('dbirthdate')?.value, 'yyyy')
    if (parseInt(yearVal) < 1900 || parseInt(yearVal) > 2049) {
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Year in between 1900 to 2050", document.getElementById(`${id}`)?.focus(), "error");
      event.target.value = ""
    }

    console.log("moment(event.target.value, 'yyyy-MM-dd', true).isValid())", event.target.value)
    if (!moment(event.target.value, 'yyyy-MM-dd', true).isValid()) {
      event.target.value = ""
    }
    this.todayUpdateValue()
  }

  getDepositorList(companyCode: any) {
    this.deptDyanPop = `deptr_coy='${companyCode}'`;
    this.dynapop
      .getDynaPopListObj('DEPOSITORS', `deptr_coy='${companyCode}'`)
      .subscribe((res: any) => {
        this.deptColumnHeader = [
          res.data.colhead1,
          res.data.colhead2,
          res.data.colhead3,
          res.data.colhead4,
          res.data.colhead5,
        ];
        this.depositorTableData = res.data;
      });
  }

  receivePartFG(event: any) {
    console.log('Event Called');
    this.getPartyFormGroup = event;
  }

  updateDepositorList(depData: any) {
    this.transferSectionForm.patchValue({
      depositorName: depData[this.bringBackColumn].trim(),
    });
    this.getRecieptNumbers();
  }

  fieldValueChange() {
    this.todayUpdateValue();
    console.log(' ddeatil change field');
  }
  inputFieldValueChange() {
    this.todayUpdateValue();
    console.log('ddeatil field change');
  }

  todayUpdateValue() {
    this.depositorDetailsForm.patchValue({
      today: this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
    });
  }

  getRecieptNumbers() {
    this.recieptDyanPop =
      `dep_coy='${this.transferSectionForm.value.companyCode}'` +
      ` AND dep_depositor='${this.transferSectionForm.value.depositorId}'` +
      ' AND dep_disdate is null';
    this.dynapop
      .getDynaPopListObj('FDRECEIPTNUM ', this.recieptDyanPop)
      .subscribe((res: any) => {
        this.recieptColumnHeader = [res.data.colhead1, res.data.colhead2];
        // for (let i = 0; i < res.data.dataSet.length; i++) {
        //   res.data.dataSet[i][1] = this.datePipe.transform(
        //     res.data.dataSet[i][1],
        //     'dd/MM/yyyy'
        //   );
        // }
        this.recieptTableData = res.data;
      });
  }

  updateReciept(data: any) {
    console.log('Reciept Number is Updated', data);
  }

  setTransferDate() {
    console.log('Transfer Date is Updated');
  }

  retreieveDepositData() {
    if (this.checkIsFormDataValid()) {
      let getRetrieveAPI =
        'deposit/fetch-deposit-by-companycode-and-depositorid-and-receiptno' +
        '?depositorId=' +
        this.transferSectionForm.value.depositorId?.trim() +
        '&companyCode=' +
        this.transferSectionForm.value.companyCode?.toString().trim() +
        '&recieptNo=' +
        this.transferSectionForm.value.recieptNum?.toString().trim();
        this.loader = true;
      this.http
        .get(`${environment.API_URL}${getRetrieveAPI}`)
        .pipe(
          take(1),
          finalize(() => {
            this.loader = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.data == undefined) {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                res.message,
                'error'
              );
              this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
            }
            if (res.data.disdate != null || res.data.disdate != undefined) {
              this.showErrorDialog(
                constant.ErrorDialog_Title,
                'Invalid receipt number',
                'error'
              );
              this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
            } else {
              this.isRetrieveClicked = true;
              this.backClick = false;
              this.saveClick = false;
              this.depositData = res.data;
              this.saveDisabled = false;
              this.transferSectionForm.disable();
              this.setRetrieveData();
              this.focusInputs();
            }
          }, 
          error: () => {
          }
        }
      );
    }
  }

  setRetrieveData() {
    this.setOrigin();
    this.getPayeToList();
    this.getLiquidityList();
    this.transferDataForm.patchValue({
      coy: this.transferSectionForm?.value.companyCode,
      depmonths: this.depositData.depmonths,
      intfreq: this.depositData.intfreq,
      intrate: this.depositData.intrate,
      transDate: this.getFormattedDate(
        this.transferSectionForm?.value.transferDate
      ),
      staffyn: this.depositData.staffyn,
      nominee:
        this.depositData.nominee != undefined ? this.depositData.nominee : '',
    });
  }

  getPayeToList() {
    this.dynapop.getDynaPopListObj('PAYEETO', '').subscribe((res: any) => {
      this.payToColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.payToTableDate = res.data;
      for (let i = 0; i < res.data.dataSet.length; i++) {
        if (res.data.dataSet[i][0].trim() === this.depositData.payeecode) {
          this.payto = res.data.dataSet[i][1].trim();
        }
      }
      this.transferDataForm.patchValue({
        payeecode: this.depositData.payeecode,
      });
    });
  }

  getLiquidityList() {
    this.dynapop.getDynaPopListObj('LIQUIDITY', '').subscribe((res: any) => {
      this.liquidityColumnHeader = [res.data.colhead1, res.data.colhead2];
      this.liquidityTableDate = res.data;
      for (let i = 0; i < res.data.dataSet.length; i++) {
        if (res.data.dataSet[i][0].trim() === this.depositData.liqtype) {
          this.liquidity = res.data.dataSet[i][1].trim();
        }
      }
    });
  }

  checkIsFormDataValid(): boolean {
    if (this.transferSectionForm?.value.companyCode == null) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Company Name Cannot Be Left Blank',
        'error'
      );
      return false;
    } else if (this.transferSectionForm?.value.depositorId == null) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Depositor Code Cannot Be Left Blank',
        'error'
      );
      return false;
    } else if (this.transferSectionForm?.value.recieptNum == null) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Reciept Number Cannot Be Left Blank',
        'error'
      );
      return false;
    } else {
      return true;
    }
  }

  showErrorDialog(titleVal: any, message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      this.handleBackClick();
    });
  }

  handleChange(event: any, targetAtt: any) {
    if (targetAtt == '15G') {
      event.target.value = 'Y'
      this.depositorDetailsForm.patchValue({ tds15gyn: event.target.value })
      this.depositorDetailsForm.patchValue({ tds15hyn: 'N' })
      this.todayUpdateValue()
    }
    else if (targetAtt == '15H') {
      event.target.value = 'Y'
      this.depositorDetailsForm.patchValue({ tds15hyn: event.target.value })
      this.depositorDetailsForm.patchValue({ tds15gyn: 'N' })
      this.todayUpdateValue()
    }
    else if (targetAtt == 'none') {
      this.depositorDetailsForm.patchValue({ tds15hyn: 'N' })
      this.depositorDetailsForm.patchValue({ tds15gyn: 'N' })
      this.todayUpdateValue()
    }
  }

  getFormattedDate(date: any) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  handleBackClick() {
    this.isRetrieveClicked = false;
    this.newDepositorSelected = false;
    this.transferSectionForm.enable();
    this.transferSectionForm.reset();
    this.depositorDetailsForm.reset();
    this.transferSectionForm.patchValue({
      transferDate: new Date(),
    });
    this.isDepositClicked = false;
    this.isDepositorClicked = true;
    this.showDepsoitor = false;
    this.showDeposit = false;
    this.existingDepositorSelect = true;
    this.newDepositorSelected = false;
    this.transferDataForm.reset();
    this.renderer.selectRootElement(this.comp.fo1.nativeElement).focus();
    this.transferSectionForm?.controls.companyName.disable();
    this.transferSectionForm?.controls.depositorName.disable();
  }

  handleExitClick() {
    this.route.navigate(['/dashboard']);
  }

  openDepositorScreen() {
    const url = this.route.serializeUrl(
      this.route.createUrlTree([
        'fd/depositentry/dataentry/depositordetailsentry/edit',
      ])
    );
    window.open(url, '_blank');
  }

  setOrigin() {
    this.dynapop
      .getDynaPopListObj('ORIGIN', "ent_class = 'ORIG'")
      .subscribe((res: any) => {
        for (let i = 0; i < res.data.dataSet.length; i++) {
          if (res.data.dataSet[i][0].trim() === this.depositData.deporigin) {
            this.origin = res.data.dataSet[i][1].trim();
          }
        }
      });
  }

  getDepositorTitleList() {
    this.dynapop.getDynaPopListObj('TITLES', ``).subscribe((res: any) => {
      this._depositorTitleColHeader = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      this._depositorTitleTable = res.data;
      console.log('Value: ', this.newDepositorSelected);
      if (this.existingDepositorSelect) {
        this.depositorDetailsForm.patchValue({
          title: this.depositorData?.title,
        });
      }
      if (!this.existingDepositorSelect) {
        this.depositorDetailsForm.patchValue({
          title: "MR",
        });
      }
    });
  }

  getDepositorTypeList() {
    this.dynapop.getDynaPopListObj('CUSTTYPE', ``).subscribe((res: any) => {
      this._depositorTypeTable = res.data;
      this.bringBackColumn = res.data.bringBackColumn;
      this._depositorTypeColHeader = [
        res.data.colhead1,
        res.data.colhead2,
        res.data.colhead3,
        res.data.colhead4,
        res.data.colhead5,
      ];
      if (this.existingDepositorSelect) {
        this.depositorDetailsForm.patchValue({
          deptype: this.depositorData?.deptype,
        });
        this._depositorTypeTable.dataSet.filter((itemId: any) => {
          if (
            itemId[0].trim() ==
            this.depositorDetailsForm.get('deptype')?.value.trim()
          ) {
            this.depositorDetailsForm.patchValue({
              deptypeName: itemId[1],
            });
          }
        });
      }
      if (!this.existingDepositorSelect) {
        this.depositorDetailsForm.patchValue({
          deptype: "I"
        });
        this._depositorTypeTable.dataSet.filter((itemId: any) => {
          if (itemId[0].trim() == this.depositorDetailsForm.get("deptype")?.value.trim()) {
            this.depositorDetailsForm.patchValue({
              deptypeName: itemId[1]
            })
          }
        })
      }
    });
  }

  depositorClicked() {
    if (
      this.existingDepositorSelect &&
      (this.transferDataForm?.value.newDepositorId == null ||
        this.transferDataForm?.value.newDepositorId == '')
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Enter depositor code',
        'error'
      );
    } else {
      this.showDepsoitor = true;
      this.showDeposit = false;
      this.isDepositClicked = true;
      this.isDepositorClicked = false;
      this.focusDepositorNameField();
    }
  }

  depositClicked() {
    this.showDepsoitor = false;
    this.showDeposit = true;
    this.isDepositorClicked = true;
    this.isDepositClicked = false;
  }

  retrieveDepositorData(event: any) {
    console.log('Saved Called', event);
    if (
      this.transferSectionForm?.value.depositorId?.trim() ===
      this.transferDataForm?.value.newDepositorId?.trim()
    ) {
      
      this.modalService.showErrorDialogCallBack(
        constant.ErrorDialog_Title,
        'New depositor id cannot be same as old depositor ID', this.focusInputs(),
        'error'
      );
      this.transferDataForm.patchValue({
        newDepositorId: '',
      });
    } else {
      this.actionService.getReterieveClickedFlagUpdatedValue(true);
      this.actionService.getAddFlagUpdatedValue(false)
      this.http
        .post(`${environment.API_URL}${this.depositorRetrieveAPI}`, {
          companyCode: this.transferSectionForm.get('companyCode')?.value,
          depositorId: event[0].trim()
        })
        .subscribe((res: any) => {
          if (res.status == true) {
            this.depositorData = res.data;
            this.addressTabVal = res.data?.addressResponseBean;
            console.log("Depositor Data:", this.depositorData)
            this.focusDepositorNameField();
            this.newDepositorSelected = true;
            this.depositorDetailsForm.patchValue({
              name: this.depositorData?.name,
              remarks: this.depositorData?.remarks,
              tds: this.depositData?.tds,
              dbirthdate: new Date(this.depositorData?.birthdate),
              pannum1: this.depositorData?.panum1?.trim(),
              pannum2: this.depositorData?.panum2?.trim(),
              depAmount: this.setDepositorAmount().toString(),
              tds15gyn: this.depositorData?.tds15gyn,
              tds15hyn: this.depositorData?.tds15hyn,
              
              grossInt:
                this.depositData?.grossint == undefined
                  ? '0'
                  : this.depositData?.grossint,
            });
            if (this.depositorDetailsForm.get('tds15gyn')?.value != undefined && this.depositorDetailsForm.get('tds15gyn')?.value != null && this.depositorDetailsForm.get('tds15gyn')?.value != "" && this.depositorDetailsForm.get('tds15gyn')?.value == "Y") {
              this._15gTDS = true
              this._15hTDS = false
              this.none = false
            }
            else if (this.depositorDetailsForm.get('tds15hyn')?.value != undefined && this.depositorDetailsForm.get('tds15hyn')?.value != null && this.depositorDetailsForm.get('tds15hyn')?.value != "" && this.depositorDetailsForm.get('tds15hyn')?.value == "Y") {
              this._15gTDS = false
              this._15hTDS = true
              this.none = false
            }
            else if (this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15hyn')?.value == null || this.depositorDetailsForm.get('tds15hyn')?.value == "" || this.depositorDetailsForm.get('tds15hyn')?.value == "N" && this.depositorDetailsForm.get('tds15hyn')?.value == undefined || this.depositorDetailsForm.get('tds15gyn')?.value == null || this.depositorDetailsForm.get('tds15gyn')?.value == "" || this.depositorDetailsForm.get('tds15gyn')?.value == "N") {
              this._15gTDS = false
              this._15hTDS = false
              this.none = true
            }
            this.transferDataForm.patchValue({
              ngid1: this.depositData.ngid1,
              ngid2: this.depositData.ngid2,
              ngid3: this.depositData.ngid3,
              jowner1: this.depositData.jowner1,
              jowner2: this.depositData.jowner2,
              jowner3: this.depositData.jowner3,
            });
            this.isDepositClicked = true;
            this.isDepositorClicked = false;
            this.showDepsoitor = true;
            this.showDeposit = false;
            this.getDepositorTitleList();
            this.getDepositorTypeList();
          
            this.addressComponent.addressForm.patchValue({'addressResponseBean':{
              ad1: this.addressTabVal.adline1,
              ad2: this.addressTabVal?.adline2,
              ad3: this.addressTabVal?.adline3,
              ad4: this.addressTabVal?.adline4,
              ad5: this.addressTabVal?.adline5,
              email: this.addressTabVal?.email,
              fax: this.addressTabVal?.fax,
              phoneoff: this.addressTabVal?.phoneoff,
              phoneres: this.addressTabVal?.phoneres,
              pincode: this.addressTabVal?.pincode,
              phonemobile:this.addressTabVal?.phonemobile
          }});
          this.partyComponent.party.patchValue({
            aadharno: this.depositorData?.partyResponseBean.aadharno,
            payeeacNum1:res.data?.partyResponseBean.payeeacnum1,
            payeebankcode1:res.data?.partyResponseBean.payeebankcode1,
            payeeBranch1: res.data?.partyResponseBean.payeebranch1,
            payeeIfsc1:res.data?.partyResponseBean.payeeifsc1,
          })
          this.partyComponent.getBankCodeList();
          }
        });
    }
  }



  addClass = 'col-xl-6';

  transferDeposit() {
    if (this.checkIsDepositorDataValid()) {
      if (this.addressComponent.validationField()) {
        this.loader = true;
        this.saveDisabled = true;
        this.http
          .post(
            `${environment.API_URL}${constant.api_url.depositTransfer}`,
            this.depositTransfer
          )
          .pipe(
            take(1),
            finalize(() => {
              this.loader = false;
            })
          )
          .subscribe({
            next: (res : any) => {
              this.saveDisabled = true;
              if (res.status) {
                this.showErrorDialog(
                  constant.ErrorDialog_Title,
                  res.message,
                  'info'
                );
              } else {
                this.modalService.showErrorDialog(
                  constant.ErrorDialog_Title,
                  res.message,
                  'error'
                );
              }
            }
            ,
            error: () => {
              this.saveDisabled = false;
            },
          });
      }
    }
  }

  checkIsDepositorDataValid() {
    if (
      this.depositorDetailsForm.value.name == '' ||
      this.depositorDetailsForm.value.name == null
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Depositor Name cannot be left blank',
        'error'
      );
      return false;
    }
    if (
      this.depositorDetailsForm.value.title == null ||
      this.depositorDetailsForm.value.title == ''
    ) {
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Title cannot be left blank',
        'error'
      );
      return false;
    } 
    else if(this.depositorDetailsForm.controls['pannum1'].errors && this.depositorDetailsForm.controls['pannum1'].errors?.['pattern']){
      console.log(document.getElementById("pmtaccNo1")?.focus());
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Invalid PAN',
        'error'
      );
      return false;
    }
    else if(this.depositorDetailsForm.controls['pannum2'].errors && this.depositorDetailsForm.controls['pannum2'].errors?.['pattern']){
      this.modalService.showErrorDialog(
        constant.ErrorDialog_Title,
        'Invalid PAN',
        'error'
      );
      return false;
    }else {
      return true;
    }
  }

 // this.existingDepositorSelect


  // getDepositorTypeList() {
  //   this.dynapop.getDynaPopListObj("CUSTTYPE", ``).subscribe((res: any) => {
  //     this._depositorTypeTable = res.data
  //     this.bringBackColumn = res.data.bringBackColumn
  //     this._depositorTypeColHeader = [res.data.colhead1, res.data.colhead2, res.data.colhead3, res.data.colhead4, res.data.colhead5]
  //     this.depositorDetailsForm.patchValue({
  //       deptype: "I"
  //     })
      
  //     // if (this.isRetrieveFlag) {
  //     //   this.depositorDetailForm.patchValue({
  //     //     deptype: this.depositFetchedData?.deptype
  //     //   })
  //     // }
  //     // if (this.isAddClicked) {
  //     //   this.depositorDetailForm.patchValue({
  //     //     deptype: "I"
  //     //   })
  //     // }

  //     this._depositorTypeTable.dataSet.filter((itemId: any) => {
  //       if (itemId[0].trim() == this.depositorDetailsForm.get("deptype")?.value.trim()) {
  //         this.depositorDetailsForm.patchValue({
  //           deptypeName: itemId[1]
  //         })
  //       }
  //     })
  //   })
  // }

 
}
