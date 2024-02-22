// Developed By  - 	ninad.s
// Developed on - 29-04-23
// Mode  - Data Entry
// Component Name - auxiliary-receipt-entry-edit-gst-firstComponent
// .Net Form Name -
// PB Window Name -
// Purpose - Outinfra Entry / Edit
// Reports Used -

// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { OutgauxirecgstfirstService } from 'src/app/services/sales/outgauxirecgstfirst.service';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-auxiliary-receipt-entry-edit-gst-first',
  templateUrl: './auxiliary-receipt-entry-edit-gst-first.component.html',
  styleUrls: ['./auxiliary-receipt-entry-edit-gst-first.component.css'],
})
export class AuxiliaryReceiptEntryEditGstFirstComponent implements OnInit {
  initialMode: Boolean = false;
  deleteDisabled: Boolean = true;
  tranMode: String = '';
  isDeleteClicked: boolean = false;
  isBackClicked: boolean = false;
  dtOptions: any;
  showMessageForZeroAmnt:boolean = false; //NS 30.08.2023 it is for 1st time when process button is not pressed
  flagForChqNumIsZero:boolean = false; //NS 01.09.2023 
  flagForChqAmntIsZero:boolean = false; //NS 01.09.2023 
  flagShowMesgForMaintainanceAndAdminRatesAreZero:boolean = false; //NS 08.09.2023
  maintainanceRate = 0;  //NS 08.09.2023
  adminRate = 0; //NS 08.09.2023
  tdsRate = 0 ;  //NS 08.09.2023
  continueAdminRate:boolean = true; //NS 15.09.2023
  continueTDSRate:boolean = true; //NS 15.09.2023

  CGST_on_Admin:number = 0;
  SGST_on_Admin:number = 0;
  IGST_on_Admin:number = 0;

  CGST_rate:number = 0;
  SGST_rate:number = 0;
  IGST_rate:number = 0;

  
  customerdetails = new FormGroup(
    {
      bldgcode: new FormControl<string>('', Validators.required),
      wing: new FormControl<string>(''),
      flatno: new FormControl<string>('', Validators.required),
      flatowner: new FormControl<string>(''),
      receiptdate:new FormControl<Date>(new Date(), Validators.required), //NS 24.05.2023
      receiptNum: new FormControl<string>(''),
      narrative: new FormControl<string>(''),
      startMonth: new FormControl<string>(''),
    },
    {
      updateOn: 'blur',
    }
  );

  outgoingAuxillaryForm = new FormGroup({
    // Form Group for Data Entry / Edit
    pmtacnum: new FormControl<any>('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}'),
    ]),
    gstno: new FormControl<any>('', [
      Validators.maxLength(15),
      Validators.pattern(
        '^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$'
      ),
    ]),
    //1. incheque related fields that are not going into the database.
    totalAmount: new FormControl<string>('0'),
    chqAmount: new FormControl<string>('0'),
    receiptAmount: new FormControl<string>('0'),
    //2. allocation realted fields that are not going into the database.
    tdsAmount: new FormControl<string>(''),
    total_og: new FormControl<string>('0'),
    admin: new FormControl<string>('0'),
    int: new FormControl<string>('0'),
    total_cgst: new FormControl<string>('0'),
    total_sgst: new FormControl<string>('0'),
    total_igst: new FormControl<string>('0'),
    outinfraStartMonth: new FormControl<string>(''),
    endMonth: new FormControl<string>(''),
    totalmonth: new FormControl<string>(''),
    receiptAmt: new FormControl<string>(''),
    adjAmount: new FormControl<string>(''),
    balanceAmount: new FormControl<string>(''),
    tdsAmt: new FormControl<string>(''),
    tdsAdjAmt: new FormControl<string>(''),
    BalanceTdsAmt: new FormControl<string>(''),

    outinfraDetailsBreakUp: new FormArray([this.outinfraItemDetailInitRows()]),

    inchqDetailsBreakUp: new FormArray([this.inchqItemDetailInitRows()]),
  });

  outinfraItemDetailInitRows() {
    return this.fb.group({
      recnum: new FormControl<string | null>(null),
      ownerid: new FormControl<string | null>(null),
      bldgcode: new FormControl<string | null>(null),
      wing: new FormControl<string | null>(null),
      flatnum: new FormControl<string | null>(null),
      month: new FormControl<string | null>(null),
      coy: new FormControl<string | null>(null),
      amtdue: new FormControl<string>('0'),
      amtpaid: new FormControl<string>('0'),
      amtos: new FormControl<string>('0'),
      amtint: new FormControl<string>('0'),
      origint: new FormControl<string>('0'),
      chargecode: new FormControl<string | null>(null),
      recdate: new FormControl<Date | null>(null),
      recprintyn: new FormControl<string | null>(null),
      recprinton: new FormControl<Date | null>(null),
      recrev: new FormControl<string>('0'),
      narrcode: new FormControl<string | null>(null),
      canceldate: new FormControl<Date | null>(null),
      cancelledyn: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
      servtax: new FormControl<string>('0'),
      admincharges: new FormControl<string>('0'),
      rectype: new FormControl<string | null>(null),
      swachhcess: new FormControl<string>('0'),
      krishicess: new FormControl<string>('0'),
      gstyn: new FormControl<string | null>(null),
      cgst: new FormControl<string>('0'),
      sgst: new FormControl<string>('0'),
      igst: new FormControl<string>('0'),
      cgstperc: new FormControl<string>('0'),
      sgstperc: new FormControl<string>('0'),
      igstperc: new FormControl<string>('0'),
      tds: new FormControl<string>('0'),
    });
  }

  inchqItemDetailInitRows() {
    return this.fb.group({
      paymode: new FormControl<string | null>(null),
      num: new FormControl<string>('0', Validators.required),
      amount: new FormControl<string>('0', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      bank: new FormControl<string | null>(null),
      slipnum: new FormControl<string | null>(null),
      transer: new FormControl<string | null>(null),
      outstat: new FormControl<string | null>('N'),
      reconstmt: new FormControl<string | null>(null),
      recondate: new FormControl<Date | null>(null),
      bouncedate: new FormControl<Date | null>(null),
      bounrevyn: new FormControl<string | null>(null),
      bounrevon: new FormControl<Date | null>(null),
      canceledate: new FormControl<Date | null>(null),
      resubdate: new FormControl<Date | null>(null),
      resubcount: new FormControl<string>('0'),
      remark: new FormControl<string | null>(null),
      proprietor: new FormControl<string | null>(null),
      coy: new FormControl<string | null>(null),
      origsys: new FormControl<string | null>(null),
      partycode: new FormControl<string | null>(null),
      recnum: new FormControl<string | null>(null),
      fund: new FormControl<string | null>('1', Validators.required),
      actype: new FormControl<string | null>('1', Validators.required),
      loanyn: new FormControl<string | null>(null),
      coybank: new FormControl<string | null>(null),
    });
  }
  constructor(
    private outgauxirecgstfirstService: OutgauxirecgstfirstService,
    private actionService: ActionservicesService,
    private dynapop: DynapopService,
    private cdref: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
      
    let receiptDate = this.customerdetails.get("receiptdate")?.value;
    console.log("receipt date", receiptDate);
    let datee = moment(new Date()).format('YYYY/MM');
    console.log("yyyy/mm=",datee);
    
  }
  // ngAfterContentChecked() {
  // 	this.cdref.detectChanges();
  //   }

  // testing(){
  //   console.log("validation", this.outgoingAuxillaryForm.controls.inchqDetailsBreakUp.controls[0].controls['num']);
  // }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      lengthChange: true,
      pageLength: 10,
      Info: true,
      scrollY: '50vh',
      scrollCollapse: false,
      scrollX: true,
    };
    this.customerdetails.get("flatno")?.valueChanges.subscribe(val => {//NS 15.05.2023
      this.retrieveFlatonwerDetails();//NS 16.05.2023 it will retrieve details of the flatowner upon the tab 
    });
    
  }

  addOutinfraDetails() {
    // User clicks on Add button
    this.tranMode = 'A';
    this.initialMode = true;
    for (let i = 1; i < 50; i++) {
      this.outinfraItemBreakUpFormArr.push(this.outinfraItemDetailInitRows());
    }
    for (let i = 1; i < 50; i++) {
      this.inchqItemBreakUpFormArr.push(this.inchqItemDetailInitRows());
    }
    //this..disable();
    this.setFocus('Replace with First TextBox Control Name to set focus');
  }

  get outinfraItemBreakUpFormArr() {
    return this.outgoingAuxillaryForm.get(
      'outinfraDetailsBreakUp'
    ) as FormArray;
  }

  get inchqItemBreakUpFormArr() {
    return this.outgoingAuxillaryForm.get('inchqDetailsBreakUp') as FormArray;
  }

  retrieveOutinfraDetails() {
    // this.actionService.getReterieveClickedFlagUpdatedValue(true);
    // let bldgcode = this.customerdetails.get('bldgCode')?.value[0][0];
    // let flatno = this.customerdetails.get('flatno')?.value[0][0];
    // let ownerid = bldgcode+" "+flatno;
    // let recnumber =
    // if () {
    // 	this.outgauxirecgstfirstService
    // 		.getOutinfraDetailsByBldgcodeAndOwneridAndRecnumAndMonthAndNarrcode()
    // 		.pipe(take(1))
    // 		.subscribe({
    // 			next: (res) => {
    // 			if (res.data) {
    // 			this.initialMode = true;
    // 			this.deleteDisabled = false;
    // 			this.bindInputValuesWithResponseBean(res);
    // 			for (var i = 0; i < res.data[0].outinfraResponseBeanList?.length; i++) {
    // 				res.data[0].outinfraResponseBeanList[i].recdate = moment(res.data[0]?.outinfraResponseBeanList[i]?.recdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].outinfraResponseBeanList[i].recprinton = moment(res.data[0]?.outinfraResponseBeanList[i]?.recprinton, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].outinfraResponseBeanList[i].canceldate = moment(res.data[0]?.outinfraResponseBeanList[i]?.canceldate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].outinfraResponseBeanList?.length - 1 == i
    // 					? ''
    // 					: this.outinfraItemBreakUpFormArr.push(this.outinfraItemDetailInitRows());
    // 				this.outgoingAuxillaryForm.controls?.outinfraDetailsBreakUp.patchValue(
    // 					res.data[0].outinfraResponseBeanList
    // 				);
    // 			}
    // 			for (var i = 0; i < res.data[0].inchqResponseBeanList?.length; i++) {
    // 				res.data[0].inchqResponseBeanList[i].date = moment(res.data[0]?.inchqResponseBeanList[i]?.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList[i].recondate = moment(res.data[0]?.inchqResponseBeanList[i]?.recondate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList[i].bouncedate = moment(res.data[0]?.inchqResponseBeanList[i]?.bouncedate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList[i].bounrevon = moment(res.data[0]?.inchqResponseBeanList[i]?.bounrevon, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList[i].canceledate = moment(res.data[0]?.inchqResponseBeanList[i]?.canceledate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList[i].resubdate = moment(res.data[0]?.inchqResponseBeanList[i]?.resubdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    // 				res.data[0].inchqResponseBeanList?.length - 1 == i
    // 					? ''
    // 					: this.inchqItemBreakUpFormArr.push(this.inchqItemDetailInitRows());
    // 				this.outgoingAuxillaryForm.controls?.inchqDetailsBreakUp.patchValue(
    // 					res.data[0].inchqResponseBeanList
    // 				);
    // 			}
    // 			this.tranMode = 'R';
    // 			this.setFocus('Replace with First TextBox Control Name to set focus');
    // 		} else {
    // 			this.toastr.error('Outinfra Not Found');
    // 				}
    // 					this..disable();
    // 			},
    // 			error: (error) => {
    // 			this.toastr.error(error.error.errors[0].defaultMessage);
    // 			},
    // 			});
    // 	} else {
    // 		this.toastr.error('Please Select Outinfra');
    // }
  }


  subidBldgcode?: string; //NS 15.05.2023
  subidBldgcodeAndWing?: string = ''; //NS 15.05.2023
  setSubidBldgcode() { //NS 15.05.2023
    //let bldgcode = this.customerdetails.get('bldgcode')?.value?.[0]?.[0];
    if(typeof this.customerdetails.get('bldgcode')?.value == "object")
    {
      this.subidBldgcode =
      "flat_bldgcode='" +
      this.customerdetails.get('bldgcode')?.value?.[0]?.[0] +
      "'";
    }
    else if(typeof this.customerdetails.get('bldgcode')?.value == "string")
    {
      this.subidBldgcode =
      "flat_bldgcode='" +
      this.customerdetails.get('bldgcode')?.value +
      "'";
    }    
  }

  setSubidBldgcodeAndWing() { //NS 15.05.2023
    let wing: string | undefined;
    if (
      this.customerdetails.get('wing')?.value?.[0]?.[0] == undefined ||
      this.customerdetails.get('wing')?.value?.[0]?.[0] == '' ||
      this.customerdetails.get('wing')?.value?.[0]?.[0] == null
    ) {
      this.subidBldgcodeAndWing = this.subidBldgcode + " and flat_wing=' '";
    } else {
      this.subidBldgcodeAndWing =
        this.subidBldgcode +
        " and flat_wing='" +
        this.customerdetails.get('wing')?.value?.[0]?.[0] +
        "'";
    }
    console.log('wingandbldgcode', this.subidBldgcodeAndWing);
  }

  retrieveFlatonwerDetails() { //NS 15.05.2023
    let bldgcode:String|null|undefined ;//= this.customerdetails.get('bldgcode')?.value?.[0]?.[0]; //new improvement "input custom component" value?.[0]?. NS 16.05.2023
    if (typeof this.customerdetails.get('bldgcode')?.value == 'object') { //NS 18.05.2023
      bldgcode = this.customerdetails.get('bldgcode')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('bldgcode')?.value == 'string'
    ) {
      bldgcode = this.customerdetails.get('bldgcode')?.value;
    }

    let wing:undefined|null|string ;//= this.customerdetails.get('wing')?.value?.[0]?.[0]; //NS 18.05.2023
    if (typeof this.customerdetails.get('wing')?.value == 'object') { //NS 18.05.2023
      wing = this.customerdetails.get('wing')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('wing')?.value == 'string'
    ) {
      wing = this.customerdetails.get('wing')?.value;
    }

    let flatno:undefined|null|string;//NS 18.05.2023 = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    if (typeof this.customerdetails.get('flatno')?.value == 'object') { //NS 18.05.2023
      flatno = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('flatno')?.value == 'string'
    ) {
      flatno = this.customerdetails.get('flatno')?.value;
    }

    
    if(wing == undefined || wing == "" || wing == null)
    {
      wing = ""; //NS 18.05.2023 here sending this blank string instead of white space because Yash chaudhary write the API with code that convert this blank string into white space at springboot end.
    } 
    console.log("wingwala",wing);
    
    this.outgauxirecgstfirstService
      .getFlatOwnerByBldgcodeAndFlatnumAndWing(bldgcode?.trim(), flatno?.trim(), wing)
      .subscribe({next:(res: any) => {
        if(res.status){
          this.customerdetails.get('flatowner')?.setValue(res.data.trim());
        }
        else{
          this.toastr.error("Please Enter Proper Flat No.");
        }
      },
      error:()=>{ //NS 20.05.2023

              },
      complete:()=>{ //NS 20.05.2023
        this.retrieveStartDate();
      }  
    }
      );
  }
  retrieveStartDate():void{
    let bldgcode:String|null|undefined ;// NS 20.05.2023
    if (typeof this.customerdetails.get('bldgcode')?.value == 'object') { //NS 20.05.2023
      bldgcode = this.customerdetails.get('bldgcode')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('bldgcode')?.value == 'string'
    ) {
      bldgcode = this.customerdetails.get('bldgcode')?.value;
    }

    let wing:undefined|null|string ;
    if (typeof this.customerdetails.get('wing')?.value == 'object') { //NS 20.05.2023
      wing = this.customerdetails.get('wing')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('wing')?.value == 'string'
    ) {
      wing = this.customerdetails.get('wing')?.value;
    }

    let flatno:undefined|null|string;//NS 20.05.2023 = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    if (typeof this.customerdetails.get('flatno')?.value == 'object') { //NS 20.05.2023
      flatno = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('flatno')?.value == 'string'
    ) {
      flatno = this.customerdetails.get('flatno')?.value;
    }

    
    if(wing == undefined || wing == "" || wing == null)
    {
      wing = " "; //NS 20.05.2023
    } 
    this.outgauxirecgstfirstService.getStartDateByBldgcodeAndWingAndFlatnumAndBilltype(bldgcode?.trim(), wing, flatno?.trim(), "F").subscribe( //where "F"(fourth parameter of method is billtype)//NS 20.05.2023
          {
            next:(res:any) =>{
              if(res.status)
              {
                this.customerdetails.get("startMonth")?.setValue(res.data);
              }
              else
              {
                this.toastr.error(res.status.message);
              }
            },
            error:(err) =>{
              
            },
            complete:()=>{
              
            }
          }
        );
  }

  validateCode()
  {
    
  }
  calculateSumOfChequeAmntInGridColmn():void{ //NS 21.08.2023
    let sumOfChqAmnt = 0;
    for (let i = 0; i < this.inchqItemBreakUpFormArr?.length; i++) {
      let tempChqAmnt = this.inchqItemBreakUpFormArr.controls[i].get('amount')?.value;
      let tempChqAmntToNumber = Number(tempChqAmnt);
      sumOfChqAmnt = sumOfChqAmnt + tempChqAmntToNumber;
    }
    //---------------------------------
    let total_receipt_amount:number = sumOfChqAmnt;
    //taken temporary variables as followed in order to determine whether number is decimal or not.
    let temp1 = total_receipt_amount;
    let temp2:string[] = temp1.toString().split(".");
    let temp3:string ="";
    if(temp2[0] != temp1.toString())
    {
      temp3 = temp1.toFixed(2); //if sum is in decimal then round it upto two digits. 
    }
    else
    {
      temp3 = total_receipt_amount.toString();  //if sum is not in decimal then keep the whole number as it is.
    }
    this.outgoingAuxillaryForm.controls.chqAmount.setValue(temp3.toString());
  }
//------start NS. 01.09.2023 bellongs to cheque number field of datagrid of cheques------------------------------------
  chqNumCanNotBeZero(event:any):void{ //NS 01.09.2023
    if(event.target.value == "0")
    {
      this.flagForChqNumIsZero = true;
    }
    else if(event.target.value == "")
    {
      this.flagForChqNumIsZero = false;
    }
  }
  removeMesgOfInvalidChqNo(event:any){
    if(event.target.value == "")
    {
      this.flagForChqNumIsZero = false;
    }
  }
//------end NS. 01.09.2023 ------------------------------------

//------start NS 01.09.2023 belongs to cheque amount field of datagrid of cheques------------------------------------
chqAmntCanNotBeZero(event:any):void{ //NS 01.09.2023
  if(event.target.value == "0")
  {
    this.flagForChqAmntIsZero = true;
  }
  else if(event.target.value == "")
  {
    this.flagForChqAmntIsZero = false;
  }
}
removeMesgOfInvalidChqAmnt(event:any){
  if(event.target.value == "")
  {
    this.flagForChqAmntIsZero = false;
  }
}
//------end NS 01.09.2023 belongs to cheque amount field of datagrid of cheques------------------------------------
//------start NS 11.09.2023  it calculate data to be filled inside the rows in the data grid of "Allocation" section of the UI //NS 15.09.2023 add the parameter by reordering it in parameter list --------------------------------------------
calculateAllocation(total_receipt_amount:number, maintainanceRate:number, prevMaintCharges:number ,adminRate:number, prevAdminCharges:number, tdsRate:number, prevCGSTTax:number, prevSGSTTax:number, prevIGSTTax:number, currentTDSReceiptAmnt:number, prevTDSAmnt:number, prevMonth:number, prevIntestAmnt:number, billType:string):number{
  if(total_receipt_amount <= 0)
  {
      return total_receipt_amount;
  }
  if(billType == "F")
  {
    //'Calculate GST ON ADMIN using current rates
    //this.outgauxirecgstfirstService.
    //this.CGST_on_Admin = 
  }
  return 0;
}
//------end NS 11.09.2023 --------------------------------------------
  processAmountForBreakup():void{
    let startDateOfOutrate = "";
    let endDateOfOutrate = "";
    
  if(this.showMessageForZeroAmnt == true) //30.08.2023 it is for every time after 1st time when process button is pressed after module gets loaded in order to display the validation message in red coloour below the field.
  {
      this.showMessageForZeroAmnt = false;
  }


  if(this.customerdetails.valid && this.inchqItemBreakUpFormArr.valid && this.flagForChqAmntIsZero == false && this.flagForChqNumIsZero == false) //if inchq details grid data is valid and customer details form is valid then only processing is done
  {
    let wing:undefined|null|string;
    if (typeof this.customerdetails.get('wing')?.value == 'object') { //NS 20.05.2023
      wing = this.customerdetails.get('wing')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('wing')?.value == 'string'
    ) {
      wing = this.customerdetails.get('wing')?.value;
    }
    //let wing = this.customerdetails.get("wing")?.value;
    if(wing == "" || wing == undefined || wing == null)
    {
      wing = " "; //there is one occurance where wing is send in the form of "" at api instead of whitespace (for fectching name of flat owner)
    }

    let flatno:undefined|null|string;//NS 20.05.2023 = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    if (typeof this.customerdetails.get('flatno')?.value == 'object') { //NS 20.05.2023
      flatno = this.customerdetails.get('flatno')?.value?.[0]?.[0];
    } else if (
      typeof this.customerdetails.get('flatno')?.value == 'string'
    ) {
      flatno = this.customerdetails.get('flatno')?.value;
    }
    let bldgcode1: string | null | undefined;
      if (typeof this.customerdetails.get('bldgcode')?.value == 'object') { //NS 20.05.2023
        bldgcode1 = this.customerdetails.get('bldgcode')?.value?.[0]?.[0];
      } else if (
        typeof this.customerdetails.get('bldgcode')?.value == 'string'
      ) {
        bldgcode1 = this.customerdetails.get('bldgcode')?.value;
      }
      //set the ownerid
      let ownerid  = bldgcode1 + wing + flatno;

      

      let startDate:string;
      let endDate:string;
      let receiveStartAndEndDates:string;
      let dates:string[] ;
      this.outgauxirecgstfirstService.getStartdateAndEnddateFromOutrate(bldgcode1, wing, flatno, "F").subscribe({
        next:(res) =>{
          if(res.status)
          {
             receiveStartAndEndDates = res.data;
             dates = receiveStartAndEndDates.split("/");
             startDate = dates[0];
             endDate = dates[1];  
          }
          else
          {
            this.modalService.showErrorDialog("error", res.message, "error");
          }    
        },
        error:()=>
        {
      
        },
        complete:() =>{
          let tempStartDateOfRec = this.customerdetails.get("startMonth")?.value;
          let startDateOfRec = "";
          if(tempStartDateOfRec == undefined){
            this.showConfirmation("KR-ERP", "Start date is undefined", "error", true);
          }
          else
          {
            startDateOfRec  = tempStartDateOfRec;
            this.outgauxirecgstfirstService.getPrevOgRecords(ownerid, startDateOfRec, "AUXI", "F").subscribe({
              next:(res) =>{
                  //collecting input for the further processing.

                  //------input for receipt amount---------
                  let total_receipt_amount:number = Number(this.outgoingAuxillaryForm.controls.chqAmount.value); 
                  //---------------------------------------
            
                  //-----------input for TDS amount--------
                  let tempTDSAmount = this.outgoingAuxillaryForm.get('tdsAmount')?.value?.toString();
                  let TDS_amount:number=  0;
                  if(tempTDSAmount != undefined)
                  {
                    TDS_amount = Number(tempTDSAmount);
                  }
                  //--------------------------------------
                  if(res.status)
                  {
                    for(let index=0; index<res.data.length; index++)
                    {
                      let month:string = res.data[index].month;
                      if(!((Number(month) >= Number(startDate)) && (Number(month) <= Number(endDate))))
                      {
                        this.flagShowMesgForMaintainanceAndAdminRatesAreZero = true;
                        break;
                      }
                    }
                    if(this.flagShowMesgForMaintainanceAndAdminRatesAreZero)
                    {
                      this.showConfirmation(constant.ErrorDialog_Title, "Both Admin and Maintenance Rates does not exist for the period(yyyymm). Please enter required rates.", "error", false);//monish has given message that "both admin and maintainace rates are zero." means period does not exist between start date and end date of the building(invalid period), hence obviously rates can not exist for that period in database.
                    }
                    else
                    {
                      this.outgauxirecgstfirstService.getMaintainanceRate(bldgcode1, wing, flatno, "F").subscribe({
                        next:(res) =>{
                          if(res.status){
                            if(res.data != undefined)
                            {
                              this.maintainanceRate = res.data;
                            }
                            else
                            {
                              this.showConfirmation(constant.ErrorDialog_Title, "Maintainance rate has not been defined in the database.", "error", false);
                              return;
                            }                        
                          }
                          else{
                            this.showConfirmation(constant.ErrorDialog_Title, "Problem in retrieving maintainance rate.", "error", false);
                            return;
                          }
                        },
                        error:() =>{

                        },
                        complete:()=>{
                          this.outgauxirecgstfirstService.getAdminRate(bldgcode1, wing, flatno, "F").subscribe({
                            next:(res) =>{
                              if(res.status){
                                if(res.data != undefined)
                                {
                                  this.adminRate = res.data;
                                }
                                else
                                {
                                  this.showConfirmation(constant.ErrorDialog_Title, "Admin rate has not been defined in the database.", "error", false);
                                  return;
                                }                             
                              }
                              else{
                                this.showConfirmation(constant.ErrorDialog_Title, "Problem in retrieving admin rate.", "error", false);
                                return;
                              }
                            },
                            error:()=>
                            {

                            },
                            complete:()=>
                            {
                              this.outgauxirecgstfirstService.getTDSRate(bldgcode1, wing, flatno, "F").subscribe({
                                next:(res) =>{
                                  if(res.status){
                                    if(res.data != undefined)
                                    {
                                      this.tdsRate = res.data;
                                    }
                                    else
                                    {
                                      this.tdsRate = 0;
                                    } 
                                  }
                                  else{
                                    this.showConfirmation(constant.ErrorDialog_Title, "Problem in retrieving TDS rate.", "error", false);
                                    return;
                                  }
                                },
                                error:()=>
                                {
      
                                },
                                complete:()=>
                                {
                                  let bldgcode  = this.customerdetails.get("bldgcode")?.value;
                                  let wing = this.customerdetails.get("wing")?.value;
                                  let flatnum = this.customerdetails.get("flatno")?.value;
                                  if(bldgcode != undefined && wing != undefined && flatnum!= undefined)
                                  {
                                    this.outgauxirecgstfirstService.getPrevOgRecords(bldgcode+wing+flatnum, startDateOfRec, "AUXI", "F").subscribe({
                                      next:(res) =>{
                                        for(let index=0; index<res.data.length; index++)
                                        {
                                          let prev_Month:number = res.data[index].month;
                                          let prev_AmtPaidForAdminCharges:number = res.data[index].admincharges;
                                          let prev_CGST:number = res.data[index].cgst;
                                          let prev_SGST:number = res.data[index].sgst;
                                          let prev_IGST:number = res.data[index].igst;
                                          let prev_Amtint:number = res.data[index].amtint;
                                          let prev_AmtPaidForMaintainance:number = res.data[index].amtpaid;
                                          let prev_TDS:number =  res.data[index].tds;
                                          let currentTDSReceiptAmnt:number = 0;
                                          if(this.outgoingAuxillaryForm.get("tdsAmount")?.value != undefined || this.outgoingAuxillaryForm.get("tdsAmount")?.value != null || this.outgoingAuxillaryForm.get("tdsAmount")?.value != "") //NS 15.09.2023
                                          {
                                            currentTDSReceiptAmnt = Number(this.outgoingAuxillaryForm.get("tdsAmount")?.value);
                                          }
                                          else
                                          {
                                            currentTDSReceiptAmnt = 0;
                                          }
                                               
                                          
                                          if(total_receipt_amount > 0)
                                          {
                                             //no = this.calculateAllocation(total_receipt_amount, this.maintainanceRate, prev_AmtPaidForMaintainance, this.adminRate, prev_AmtPaidForAdminCharges, this.tdsRate, prev_CGST, prev_SGST, prev_IGST, currentTDSReceiptAmnt, prev_TDS, prev_Month, prev_Amtint, billType);
                                          }
                                        }
                                      },
                                      error:() =>{
  
                                      },
                                      complete:() =>{
  
                                      }
                                    
                                    });
                                  }
                                  else
                                  {
                                    this.showConfirmation("KR-ERP", "Building code or wing or flat number is undefined.", "error", true);
                                    return;
                                  }                                                                    
                                }
                              });

                            }
                          });
                        }

                          
                        });
                      }

                  }
                  else
                  {
                    this.showConfirmation(constant.ErrorDialog_Title, "", "error", false);
                  }
              },
              error:()=>{
              
              },
              complete:() =>{
                
              }
            });
          }
        }
      });

    }
    else{
      this.modalService.showErrorDialog("Error", "Please enter valid cheque details(cheque amount & cheque number) and/or cutstomer details.", "error");
  
    }

}

  bindInputValuesWithResponseBean(res: any) {
    // Initialise form values from response bean
    this.outgoingAuxillaryForm.patchValue({
      pmtacnum: res.data[0].partyResponseBean?.pmtacnum,
      gstno: res.data[0]?.partyResponseBean?.gstno,
    });
  }

  addOutinfraRow() {
    this.outinfraItemBreakUpFormArr.push(this.outinfraItemDetailInitRows());
  }

  addInchqRow() {
    this.inchqItemBreakUpFormArr.push(this.inchqItemDetailInitRows());
  }

  deleteOutinfraRow(rowIndex: any) {
    this.outinfraItemBreakUpFormArr.removeAt(rowIndex);
  }

  deleteInchqRow(rowIndex: any) {
    this.inchqItemBreakUpFormArr.removeAt(rowIndex);
  }

  setFocus(id: any) {
    // Method to set focus to object on form
    let elementToFocus = document.getElementById(id)
      ?.childNodes[0] as HTMLInputElement;
    elementToFocus?.focus();
  }

  convertValuesToUpper(formgroup: any) {
    // Method to convert all string input values to uppercase
    for (const obj of Object.keys(formgroup)) {
      if (formgroup[obj] && typeof formgroup[obj] == 'string') {
        formgroup[obj] = formgroup[obj].toUpperCase();
      }
    }
    return formgroup;
  }

  saveOutinfra() {
    // Method to save data entered by user
    if (this.outgoingAuxillaryForm.valid) {
      // Check whether data is entered properly
      let valuesToUpper = this.convertValuesToUpper(
        this.outgoingAuxillaryForm.value
      );
      let userid = sessionStorage.getItem('userName');

      // let partyRequestBean = {
      // 	partyname: valuesToUpper.name,
      // 	userid,
      // 	city: addressRequestBean.city,
      // 	pmtacnum: valuesToUpper.pmtacnum,
      // 	title: valuesToUpper.title,
      // 	gstno: valuesToUpper.gstno,
      // };

      let savePayload = {
        // 	...this.outgoingAuxillaryForm.value,
        //userid,
      };

      if (this.tranMode == 'R') {
        // Retrieve Mode
        //savePayload['Replace with Key Value'] = this..get('')?.value;
        this.outgauxirecgstfirstService.updateOutinfra(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Outinfra Updated',
                res['message'],
                'info'
              );

              this.back();
            }
          },
          error: (error) => {
            if (error.status == 400) {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                error.error.errors[0].defaultMessage,
                'error'
              );
            } else {
              this.toastr.error('Something went wrong');
            }
          },
        });
      } else if (this.tranMode == 'A') {
        // New Entry Mode
        this.outgauxirecgstfirstService.addOutinfra(savePayload).subscribe({
          next: (res) => {
            if (res.status) {
              this.modalService.showErrorDialog(
                'Outinfra Added',
                res['message'],
                'info'
              );

              this.back();
            }
          },
          error: (error) => {
            if (error.status == 400) {
              this.modalService.showErrorDialog(
                constant.ErrorDialog_Title,
                error.error.errors[0].defaultMessage,
                'error'
              );
            } else {
              this.toastr.error('Something went wrong');
            }
          },
        });
      }
    } else {
      this.toastr.error('Please fill the form properly'); // Data not entered properly
    }
  }

  handleDeleteClick() {
    this.isDeleteClicked = true;
    this.showConfirmation(
      constant.ErrorDialog_Title,
      'Are you sure want to delete this entry',
      'question',
      true
    );
  }

  handleBackClick() {
    this.isBackClicked = true;
    if (this.outgoingAuxillaryForm.dirty) {
      this.showConfirmation(
        constant.ErrorDialog_Title,
        'Do you want to ignore the changes done?',
        'question',
        true
      );
    } else {
      this.back();
    }
  }

  showConfirmation(
    titleVal: any,
    message: string,
    type: string,
    confirmationDialog: boolean
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      disableClose: true,
      data: {
        isF1Pressed: false,
        title: titleVal,
        message: message,
        template: '',
        type: type,
        confirmationDialog: confirmationDialog,
      },
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.isDeleteClicked) {
          this.isDeleteClicked = false;
        }
        if (this.isBackClicked) {
          this.back();
        }
      }
    });
  }

  back() {
    // User clicks on Back button
    this.customerdetails.get("receiptdate")?.setValue(new Date());//NS 22.05.2023 
    this.isBackClicked = false;
    this.isDeleteClicked = false;
    this.resetFormArray();
    //this..reset();
    this.outgoingAuxillaryForm.reset();
    this.initialMode = false;
    this.deleteDisabled = true;
    //this..controls['Replace with control name to be enabled'].enable();
    this.setFocus('Replace with Control Name to set focus'); // Set focus on first column in selection form group
  }

  resetFormArray() {
    this.outinfraItemBreakUpFormArr.clear();
    this.outgoingAuxillaryForm.controls?.outinfraDetailsBreakUp.reset();
    this.outinfraItemBreakUpFormArr.push(this.outinfraItemDetailInitRows());
    this.inchqItemBreakUpFormArr.clear();
    this.outgoingAuxillaryForm.controls?.inchqDetailsBreakUp.reset();
    this.inchqItemBreakUpFormArr.push(this.inchqItemDetailInitRows());
  }

  addOutDetails() {}

  retrieveDetails() {}

  deleteDetails() {}

  saveDetails() {}
  handleExit() {}
}
