import { Component, OnInit, Input, ChangeDetectorRef , Renderer2, AfterViewInit} from '@angular/core';
import { DynapopService } from 'src/app/services/dynapop.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import  * as constant from '../../../../../../constants/constant'
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient , HttpErrorResponse} from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { ModalService } from 'src/app/services/modalservice.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-depositrenewals',
  templateUrl: './depositrenewals.component.html',
  styleUrls: ['./depositrenewals.component.css'],
})
export class DepositrenewalsComponent implements OnInit, AfterViewInit {
 depositEntryTabVal!:any
 recieptNumList: any[] =[];
  // @ViewChild(DepositrenewalseditComponent) private rc!: DepositrenewalseditComponent
  isRetrieveFlag: any
  constructor(private dynapop: DynapopService,  private dialog: MatDialog, private renderer : Renderer2,
    private actionService: ActionservicesService, private changeDetector: ChangeDetectorRef,
   private modalService: ModalService ,private http:HttpClient, private router: Router) {

    this.actionService.isReterieveClickedFlagUpdate.subscribe((res: any) => {
      this.isRetrieveFlag = res
      console.log("Retrieve Called")
    })
   }
  accessRightArr: any;
  compHeader!: any[];
  recieptColumnHeader!: any[];
  deptColumnHeader!: any[];
  compData: any;
  depositorTableData: any;
  bringBackColumn!: number;
  coy_condition="coy_fdyn='Y'"
  recieptDyanPop: any
  paramsPost:any;
  deptDyanPop: any;
  receivedData:any;
  recieptTableData: any;
  passRetrieveApiUrl:string = "";
  renewDepositAPI: any = constant.Renew_Deposit;
  tabContentFlag:boolean=false
  receiveDepositData!:FormGroup;
  depositFetchedData: any;
  addChkApi=constant.RecieptNumber_Chk
  rt: boolean = true;
  origin: string = ""
  payTo: string = ""
  depositDate!: any
  maturityDate!: any;
  rateOfInterest!: any;
  dob!: any;
  age!: any;
  payto_condition = "ent_class = 'PAYTO'"
  broker_condition = "brok_code LIKE 'UNIQ%'"
  originColumnHeader!: any[];
  payToColumnHeader!: any[];
  durationColumnHeader!: any[];
  voucherColumnHeader!: any[];
  brokerColumnHeader!: any[];
  inFreqColumnHeader!: any[];
  liquidityColumnHeader!: any[];
  bankTableData: any;
  originTableData: any;
  durationTableDate: any;
  payToTableDate: any;
  voucherData: any;
  brokerTableDate: any;
  inFreqTableDate: any;
  liquidityTableDate: any;
  liquidity!: any
  datePipe = new DatePipe('en-US')
  interest_condtion = ""
  duration_condition = ""
  test1: boolean = true
  isRetrieveClicked: boolean = false;
  backClick: boolean = true;
  renewClick: boolean = false;
  saveClick: boolean = true;
  dataRenewable:boolean = false
  readonlyAttr:boolean = true;
  loader: boolean = false;

  ngOnInit(): void {
    this.getCompanyList();
  }

  ngAfterViewInit(): void {
    this.focusField('company12');
  }

  //To add default focus on input field
  focusField(id : any) {
    let el = document.getElementById(id)?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }

  focusInterestRateField() {
    setTimeout(() => {
      let interestRateField = document.getElementById("interestRate") as HTMLElement
      this.renderer.selectRootElement(interestRateField).focus();
    }, 100);
  }

  ngOnChanges(){
    this.receiveDepositEntryData(this)
  }

  accessRightCheck(){
    this.accessRightArr = sessionStorage.getItem('accessRight')?.split(',')
    this.accessRightArr = [...this.accessRightArr]
  }

  depositRenewalForm = new FormGroup({
    depmonths: new FormControl('', Validators.required),
    intrate: new FormControl('', [Validators.required]),
    payeecode: new FormControl('', Validators.required),
    broker: new FormControl(''),
    jowner1: new FormControl(''),
    jowner2: new FormControl(''),
    jowner3: new FormControl(''),
    nominee: new FormControl(''),
    instructions: new FormControl(''),
    depamount: new FormControl(''),
    matdate: new FormControl(),
    depdate: new FormControl(),
    intfreq: new FormControl('', [Validators.required]),
    depmonthnew: new FormControl(''),
    intrateold: new FormControl(''),
    liqtype: new FormControl(''),
    staffyn: new FormControl(''),
    warbank: new FormControl(''),
    waracc: new FormControl(''),
    receiptnum: new FormControl(''),
    origreceipt: new FormControl('')
  })

  ngAfterContentChecked(){
    this.changeDetector.detectChanges();
    this.payLoadData();

  }

  scrollPage(height: number){
    window.scrollTo(0, height);
  }

  scrollToEnd(){
    window.scrollTo(0, document.body.scrollHeight);
  }

  setRetrieveData(){
    this.setOrigin();
    this.setPayeToList();
    this.getDepositorAgeAndBirthDate();
    this.getLiquidityList();
    this.getBrokersList();
    this.getInFreqList();
    this.checkIfRecieptIsMatured();
    this.getDurationist();
    this.renewalSectionForm.controls.companyCode.disable();
    this.renewalSectionForm.controls.depositorId.disable();
    this.renewalSectionForm.controls.recieptNum.disable();
    this.depositDate = this.getFormattedDate(this.depositEntryTabVal.depdate);
    this.maturityDate = this.getFormattedDate(this.depositEntryTabVal.matdate);
  }
  
  renewalSectionForm=new FormGroup({
    companyCode: new FormControl('',Validators.required),
    companyName:new FormControl(''),
    depositorId: new FormControl('',Validators.required),
    depositorName:new FormControl(''),
    recieptNum: new FormControl('', Validators.required)
  })

  getCompanyList(){
    this.dynapop.getDynaPopListObj("COMPANY","coy_fdyn='Y'").subscribe((res:any)=>{
      this.compHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
      this.compData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }
  updateCompanyList(compData:any){
    this.renewalSectionForm.patchValue({
      companyName:compData[this.bringBackColumn].trim()
    })
    this.getDepositorList(compData[this.bringBackColumn - 1]);
  }

  getDepositorList(companyCode: any){
    this.deptDyanPop = `deptr_coy='${companyCode}'`
    this.dynapop.getDynaPopListObj("DEPOSITORS",`deptr_coy='${companyCode}'`)
    .subscribe((res:any)=>{
     this.deptColumnHeader=[res.data.colhead1,res.data.colhead2,res.data.colhead3,res.data.colhead4,res.data.colhead5]
     this.depositorTableData = res.data
   })
  }

 getDepositRenewalData(){
  if(this.checkIsFormDataValid()){
    let  getRetrieveAPI='deposit/fetch-deposit-by-companycode-and-depositorid-and-receiptno' + '?depositorId='
    + this.renewalSectionForm.value.depositorId?.trim() + '&companyCode=' + this.renewalSectionForm.value.companyCode?.toString().trim()
    + '&recieptNo=' + this.renewalSectionForm.value.recieptNum?.toString().trim();
    this.http.get(`${environment.API_URL}${getRetrieveAPI}`).subscribe((res: any) => {
      if(res.data == undefined){
        this.showErrorDialog(constant.ErrorDialog_Title, res.message , "error");
      }
      if(res.data.disdate!=null || res.data.disdate!=undefined){
        this.showErrorDialog(constant.ErrorDialog_Title, "Reciept Number "+ this.renewalSectionForm?.value.recieptNum?.trim()+ " is already Renewed" , "error");
      }
      else{
        this.isRetrieveClicked = true;
        this.backClick = false;
        this.depositEntryTabVal = res.data
        this.setRetrieveData();
      }
    })
  }
 }

 setRenewableData(){
  this.focusInterestRateField();
  let maturityDate  = new Date(this.depositEntryTabVal?.matdate);
  let depositDate = new Date(this.depositEntryTabVal?.depdate);
  maturityDate.setMonth(maturityDate.getMonth()+ Number(this.depositEntryTabVal?.depmonths))
  // depositDate.setMonth(maturityDate.getMonth()+ Number(this.depositEntryTabVal?.depmonths))
  //change by kalpana on 01/08/2023 since when end of the month date is there than wrong date was coming.
  depositDate.setMonth(depositDate.getMonth()+ Number(this.depositEntryTabVal?.depmonths))
  
  this.depositRenewalForm.patchValue({
    depamount: this.depositEntryTabVal?.depamount,
    intrate: this.rateOfInterest,
    matdate: this.getFormattedDate(maturityDate),
    depdate: this.getFormattedDate(depositDate),
    depmonths: this.depositEntryTabVal?.depmonths,
    depmonthnew: this.depositEntryTabVal?.depmonths,
    payeecode: this.depositEntryTabVal?.payeecode ,
    intfreq: this.depositEntryTabVal?.intfreq,
    receiptnum: this.depositEntryTabVal?.receiptnum,
    intrateold: this.rateOfInterest,
    liqtype: this.depositEntryTabVal?.liqtype,
    staffyn: this.depositEntryTabVal?.staffyn,
    warbank: this.depositEntryTabVal?.warbank,
    waracc: this.depositEntryTabVal?.waracc,
    instructions : this.depositEntryTabVal?.instructions == undefined ? this.depositRenewalForm.value.instructions : this.depositEntryTabVal.instructions.trim(),
    jowner1: this.depositEntryTabVal?.jowner1 == undefined ? this.depositRenewalForm.value.jowner1 : this.depositEntryTabVal.jowner1.trim(),
    jowner2: this.depositEntryTabVal?.jowner2 == undefined ? this.depositRenewalForm.value.jowner2 : this.depositEntryTabVal.jowner2.trim(),
    jowner3: this.depositEntryTabVal?.jowner3 == undefined ? this.depositRenewalForm.value.jowner3 : this.depositEntryTabVal.jowner3.trim(),
    nominee: this.depositEntryTabVal?.nominee == undefined ? this.depositRenewalForm.value.nominee : this.depositEntryTabVal.nominee.trim(),
    broker : this.depositEntryTabVal?.broker == undefined ? this.depositRenewalForm.value.broker : this.depositEntryTabVal.broker,
 })
 this.dataRenewable = true
 this.saveClick = false;
 this.renewClick = false;
 }

 resetData(){
  if(!this.renewClick){
    this.renewalSectionForm.reset();
    this.focusField('company12');
  }
 }

 checkIsFormDataValid(): boolean{
  if(this.renewalSectionForm?.value.companyCode == null || this.renewalSectionForm?.value.companyCode == ''){
    this.focusField('company12');
    this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Company Name Cannot Be Left Blank", "error");
    return false;
  }
  else if(this.renewalSectionForm?.value.depositorId == null || this.renewalSectionForm?.value.depositorId == ''){
    this.focusField('depositor12434');
    this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Depositor Code Cannot Be Left Blank", "error");
    return false;
  }
  else if(this.renewalSectionForm?.value.recieptNum == null || this.renewalSectionForm?.value.recieptNum == ''){
    this.focusField('receiptNum12');
    this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Reciept Number Cannot Be Left Blank", "error");
    return false;
  }
  if(!this.recieptNumList.includes(this.renewalSectionForm?.value.recieptNum.trim())){
    this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Invalid Receipt Number", this.focusField("receipt4"), "error");
    this.renewalSectionForm.patchValue({
        recieptNum: ''
    })
    return false;
  }
  else{
    return true;
  }
 }
  updateDepositorList(depData: any){
    this.renewalSectionForm.patchValue({
      depositorName:depData[this.bringBackColumn].trim()
    })
    this.getRecieptNumbers();
  }
  receiveDepositEntryData($event:any){
    this.receiveDepositData= $event
  }
  updateReciept(data:any){
    this.passRetrieveApiUrl ='deposit/fetch-deposit-by-companycode-and-depositorid-and-receiptno' + '?depositorId='
   + this.renewalSectionForm.value.depositorId?.trim() + '&companyCode=' + this.renewalSectionForm.value.companyCode?.toString().trim()
   + '&recieptNo=' + data[0].toString().trim();
  }

  getRecieptNumbers(){
    this.recieptNumList =  [];
    this.recieptDyanPop = `dep_coy='${this.renewalSectionForm.value.companyCode}'` + ` AND dep_depositor='${this.renewalSectionForm.value.depositorId}'` + " AND dep_disdate is null"
    this.dynapop.getDynaPopListObj("FDRECEIPTNUM ",this.recieptDyanPop)
      .subscribe((res:any)=>{
       this.recieptColumnHeader=[res.data.colhead1,res.data.colhead2]
       for(let i=0; i< res.data.dataSet.length; i++){
        this.recieptNumList.push(res.data.dataSet[i][0].trim())
       }
       this.recieptTableData = res.data
     })
  }


  payLoadData(){
    this.receivedData = {
      userid: sessionStorage.getItem("userName"),
      coy: this.renewalSectionForm?.getRawValue().companyCode,
      proprietor: this.renewalSectionForm?.getRawValue().companyCode,
      depositor: this.renewalSectionForm?.getRawValue().depositorId,
      recieptno:  this.renewalSectionForm?.getRawValue().recieptNum,
      receiptnum:  this.renewalSectionForm?.getRawValue().recieptNum,
      depmonthnew : this.depositRenewalForm?.value.depmonthnew,
      depmonths: this.depositRenewalForm?.value.depmonths,
      intrate2: this.depositRenewalForm?.value.intrate,
      intrate: this.depositRenewalForm?.value.intrate,
      intrateold: this.depositRenewalForm?.value.intrate,
      payeecode: this.depositRenewalForm?.value.payeecode,
      broker: this.depositRenewalForm?.value.broker,
      matdate: this.depositRenewalForm?.value.matdate,
      depdate: this.getFormattedDate(this.depositEntryTabVal?.depdate),
      depdatenew: this.depositRenewalForm?.value.depdate,
      intfreq: this.depositRenewalForm?.value.intfreq,
      instructions: this.depositRenewalForm?.value.instructions,
      nominee: this.depositRenewalForm?.value.nominee,
      jowner1: this.depositRenewalForm?.value.jowner1,
      jowner2: this.depositRenewalForm?.value.jowner2,
      jowner3: this.depositRenewalForm?.value.jowner3,
      depamount: this.depositRenewalForm?.value.depamount,
      deporigin: 'R',
      staffyn: this.depositEntryTabVal?.staffyn,
      accint: this.depositEntryTabVal?.accint,
      bankcode: this.depositEntryTabVal?.bankcode,
      brokerage: this.depositEntryTabVal?.brokerage,
      instbp: this.depositEntryTabVal?.instbp,
      instfdr: this.depositEntryTabVal?.instfdr,
      instip: this.depositEntryTabVal?.instip,
      liqtype: this.depositEntryTabVal?.liqtype,
      origsite: this.depositEntryTabVal?.origsite,
      site: this.depositEntryTabVal?.site,
      broktds: this.depositEntryTabVal?.broktds,
      intpaidytd: this.depositEntryTabVal?.intpaidytd,
      printrev: this.depositEntryTabVal?.printrev,
      taxpaidytd: this.depositEntryTabVal?.taxpaidytd,
      ddCharges: this.depositEntryTabVal?.ddCharges,
      interest: this.depositEntryTabVal?.interest,
      isChecked: this.depositEntryTabVal?.isChecked,
      origreceipt:  this.renewalSectionForm?.getRawValue().recieptNum,
      matamount: this.depositEntryTabVal?.matamount,
      grossint: this.depositEntryTabVal?.grossint,
      slipnum: this.depositEntryTabVal?.inchqRequestBean!=undefined ?  this.depositEntryTabVal?.inchqRequestBean[0].slipnum : ""
    }
    return this.receivedData;
  }

  tabContainerFlagRefresh(flagVal:any){
    this.tabContentFlag = flagVal
  }

handleBackClick(){
  this.isRetrieveClicked= false;
  this.backClick = true;
  this.renewClick= false;
  this.saveClick= true;
  this.dataRenewable = false
  this.renewalSectionForm.enable();
  this.renewalSectionForm.reset();
  this.depositRenewalForm.reset();
  this.focusField('company12');

}

checkIfRecieptIsMatured() {
    let maturityDate = new Date(this.depositEntryTabVal?.matdate)
    console.log("Maturity Date: ", maturityDate)
    let todayDate : Date = new Date()
    let startDate = new Date(new Date(this.depositEntryTabVal?.matdate).setDate(new Date(this.depositEntryTabVal?.matdate).getDate() - 15))
    console.log("Start Date: ", startDate)
    if(!(todayDate >= startDate)){
      this.showErrorDialog(constant.ErrorDialog_Title, "Cannnot renew prematured reciepts",
       "info")
    }
    else{
      this.renewClick = true
    }
  }

  setOrigin(){
    this.dynapop.getDynaPopListObj("ORIGIN","ent_class = 'ORIG'")
    .subscribe((res:any)=>{
      for(let i = 0; i< res.data.dataSet.length; i++){
        if(res.data.dataSet[i][0].trim() === this.depositEntryTabVal.deporigin){
          this.origin = res.data.dataSet[i][1].trim()
        }
      }
    })
  }

  setInstruction(event:any){
    this.depositRenewalForm.patchValue({
      instructions : event.target.value
    })
  }

  setNominee(event:any){
    this.depositRenewalForm.patchValue({
      nominee : event.target.value
    })
 }

setJointOwner1(event:any){
    this.depositRenewalForm.patchValue({
      jowner1 : event.target.value
    })
 }

 setJointOwner2(event:any){
  this.depositRenewalForm.patchValue({
    jowner2 : event.target.value
  })
}
setJointOwner3(event:any){
  this.depositRenewalForm.patchValue({
    jowner3 : event.target.value
  })
}

getBrokersList(){
    this.dynapop.getDynaPopListObj("BROKERS",this.broker_condition)
    .subscribe((res:any)=>{
      this.brokerColumnHeader=[res.data.colhead1,res.data.colhead2]
      this.brokerTableDate = res.data
    })
}

  updateDuration(val:any){
    this.depositRenewalForm.patchValue({
      depmonthnew: val[0].trim()
    })
    this.setMaturityDate();
  }

  checkInterestValid(){
    if(Number(this.depositRenewalForm?.value.intrate) > 100){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Interest rate cannot be greater than 100",  this.focusInterestRateField(), "error")
      this.depositRenewalForm.patchValue({
        intrate: this.depositEntryTabVal?.intrate
      })
    }
    if(this.depositRenewalForm?.value.intrate == "" || this.depositRenewalForm?.value.intrate == null){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Enter Interest Rate",  this.focusInterestRateField(), "error")
    }
  }

  setMaturityDate(){
    let d:any
    let d1:any
    d1 = this.depositRenewalForm?.value.depdate?.split("/")
    d = new Date()
    d.setFullYear(Number(d1[2]))
    d.setMonth(Number(d1[1]))
    d.setDate(Number(d1[0]))
    d.setMonth(d.getMonth()+ Number(this.depositRenewalForm?.value.depmonthnew) - 1);
    d.setDate(d.getDate()-1)
    console.log("Date: ", d1)
    this.depositRenewalForm.patchValue({
        matdate: this.getFormattedDate(d)
    })
  }

  getDurationist(){
    this.dynapop.getDynaPopListObj("DURATION","")
    .subscribe((res:any)=>{
      this.durationColumnHeader=[res.data.colhead1,res.data.colhead2]
      this.durationTableDate = res.data
      if(this.isRetrieveFlag){
        this.depositRenewalForm.patchValue({
          depmonthnew : this.depositEntryTabVal.depmonths.toString()
        })
      }
    })
  }

  setPayeeCode(){
    this.depositRenewalForm.patchValue({
      payeecode: this.depositEntryTabVal.payeecode
    })
  }
  setPayeToList(){
    this.dynapop.getDynaPopListObj("PAYEETO","")
    .subscribe((res:any)=>{
      this.payToColumnHeader=[res.data.colhead1,res.data.colhead2]
      this.payToTableDate = res.data
      for(let i = 0; i< res.data.dataSet.length; i++){
        if(res.data.dataSet[i][0].trim() === this.depositEntryTabVal.payeecode){
          this.payTo = res.data.dataSet[i][1].trim()
        }
      }
    })
  }


  getLiquidityList(){
    this.dynapop.getDynaPopListObj("LIQUIDITY","")
    .subscribe((res:any)=>{
      this.liquidityColumnHeader=[res.data.colhead1,res.data.colhead2]
      this.liquidityTableDate = res.data
      for(let i = 0; i< res.data.dataSet.length; i++){
        if(res.data.dataSet[i][0].trim() === this.depositEntryTabVal.liqtype){
          this.liquidity = res.data.dataSet[i][1].trim()
        }
      }

    })
  }

  getDepositorAgeAndBirthDate(){
    let fetchRequestAPI: any = "depositor/age-by-depositorid-and-companycode?depositorId="+this.renewalSectionForm.value.depositorId+"&companyCode="+this.renewalSectionForm.value.companyCode
    this.actionService.getAgeAndBirthDate(fetchRequestAPI).subscribe((res:any)=>{
        this.dob =  res.data.birthDate ?  res.data.birthDate : "",
        this.age = res.data.age ? res.data.age[0].toString() : "",
        this.rateOfInterest = res.data.rateOfInterest
    })
  }

  updateInterestFreq(event: any){
    this.depositRenewalForm.patchValue({
      intfreq: event[0].toString().trim()
    })
  }

  updatePayTo(event:any){
    this.depositRenewalForm.patchValue({
      payeecode: event[0].toString().trim()
    })
  }

  updateBrokerList(event:any){
    this.depositRenewalForm.patchValue({
      broker: event[0].toString().trim()
    })
  }

  getInFreqList(){
    this.dynapop.getDynaPopListObj("INTFREQ","")
    .subscribe((res:any)=>{
      this.inFreqColumnHeader=[res.data.colhead1,res.data.colhead2]
      this.inFreqTableDate = res.data
    })
  }

  getFormattedDate(date: any){
   return this.datePipe.transform(date, 'dd/MM/yyyy')
  }
  showErrorDialog(titleVal:any , message: string, type: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose:true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: "",
        type: type
      },
    });
    dialogRef.afterOpened().subscribe(()=>{
       console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result:any) => {
      this.handleBackClick();
    });
  }

  checkIsRenewDataValid():boolean{
    if(this.depositRenewalForm?.value.depmonthnew == ""){
      this.modalService.showErrorDialog(constant.ErrorDialog_Title, "Duration Cannot Be Left Blank", "error");
      return false;
    }
    if(this.depositRenewalForm?.value.intrate == ""){
      this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, "Enter Interest Rate", this.focusInterestRateField(), "error");
      return false;
    }
    else{
      return true;
    }
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  renewDepositDetails(){
    if(this.checkIsRenewDataValid()){
      this.loader = true;
    this.http.post(`${environment.API_URL}${this.renewDepositAPI}`,this.receivedData).subscribe((res:any)=>{
      this.loader = false;
      this.saveClick = true;
      if(res.status){
        this.showErrorDialog(constant.ErrorDialog_Title, res.message, "info")
      }
      else{
        this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message, "error")
      }
    },
    (error:HttpErrorResponse)=>{
      this.loader = false;
      this.saveClick = false;
      if(error.status===400){
        console.log("error",error.error.errors[0].defaultMessage)
        this.modalService.showErrorDialog(constant.ErrorDialog_Title, error.error.errors[0].defaultMessage, "error")
      }
    })
  }
}
}
