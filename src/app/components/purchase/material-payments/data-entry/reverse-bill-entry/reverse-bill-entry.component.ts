import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { DynapopService } from 'src/app/services/dynapop.service';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import { DatePipe } from '@angular/common';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { F1Component } from 'src/app/shared/generic/f1/f1.component';
import { ModalService } from 'src/app/services/modalservice.service';
import  * as constant from '../../../../../../constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reverse-bill-entry',
  templateUrl: './reverse-bill-entry.component.html',
  styleUrls: ['./reverse-bill-entry.component.css'],
})
export class ReverseBillEntryComponent implements OnInit {

  @ViewChild(F1Component) comp!: F1Component;
  bringBackColumn: any;
  supplier_condition = "par_partytype = 'S'";
  loaderToggle: boolean = false;
  formName!: string;
  readonlyAttr: boolean = true;
  supplierData: any;
  buildingData: any;
  supplierBillData: any;
  bldg_condition = '';
  suppBill_condition='';
  reverseBillDetails: boolean = false;
  datePipe = new DatePipe('en-US');
  reverseBillType : any;
  loader: boolean = false;
  saveDisable: boolean = true;

  constructor(
    private toastr: ToasterapiService,
    private dynapop: DynapopService,
    private dataEntryService: DataEntryService,
    private modalService: ModalService,
    private dialog: MatDialog,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // get formname from pagedata Observable
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
   this.setCondition();

  }
  reverBillForm : FormGroup = new FormGroup({
    suppCode: new FormControl<string[] | string>('', Validators.required),
    supplierName: new FormControl(''),
    bldgCode: new FormControl<string[] | string>('', Validators.required),
    bldgName: new FormControl(''),
    suppBillNo: new FormControl<string[] | string>('',  Validators.required),
    name: new FormControl(''),
    matgroup: new FormControl(''),
    matgroupName: new FormControl(''),
    ser: new FormControl(''),
    supBilldt: new FormControl(''),
    tranSerialNo: new FormControl(''),
    debitamt: new FormControl(''),
    quantity: new FormControl(''),
    crdays: new FormControl(''),
    retention: new FormControl(''),
    tdsperc: new FormControl(''),
    tdsamount: new FormControl(''),
    rate: new FormControl(''),
    dequantity: new FormControl(''),
    derate: new FormControl(''),
    sku: new FormControl(''),
    uom: new FormControl(''),
    authnum: new FormControl(''),
    authdate: new FormControl(''),
    itemcode: new FormControl(''),
    matcode: new FormControl(''),
    matcodeName: new FormControl(''),
    proprietorName: new FormControl(''),
    itemcodeName: new FormControl(''),
    companyName: new FormControl(''),
    projectName: new FormControl(''),
    property: new FormControl(''),
    amount: new FormControl(''),
    narration: new FormControl('')
  });

  getDataName(dynapopId: any, searchText: any, query: any, controlName: string){
    this.dynapop.getDynaPopSearchListObj(dynapopId , query , searchText).subscribe((res: any) => {
      this.reverBillForm.get(controlName)?.setValue(res.data.dataSet.length!=0 ? res.data.dataSet[0][1].trim() : "") ;
    })
  }

  getSupplierList() {
    this.dynapop.getDynaPopListObj('PARTYCODE', this.supplier_condition).subscribe((res: any) => {
      this.supplierData = res.data;
      this.bringBackColumn = res.data.bringBackColumn;
    });
  }


  getBuldingList(){
    this.dynapop.getDynaPopListObj("BUILDINGS",this.bldg_condition).subscribe((res:any)=>{
      this.buildingData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }

  getSuppBillNos(){
    this.dynapop.getDynaPopListObj("SUPPBILLNO",this.suppBill_condition).subscribe((res:any)=>{
      this.supplierBillData = res.data
      this.bringBackColumn = res.data.bringBackColumn
    })
  }


  updateSupplierCodeList(supplierCodeData: any) {
    this.reverBillForm.patchValue({
      suppCode: supplierCodeData[0].trim(),
      supplierName: supplierCodeData[this.bringBackColumn].trim(),
    });
  }


  setCondition(){
    let mgc = this.reverBillForm?.get('bldgCode');
    let mc = this.reverBillForm?.get('suppBillNo');
    mgc?.valueChanges.subscribe((val: any) => {
     !val && mc?.setValue(null);
      this.suppBill_condition = `pblh_bldgcode = '${
        val ? val instanceof Object && val[0][0].trim() : ''
      }' AND pblh_partycode  = '${this.reverBillForm.get('suppCode')?.value[0][0].trim()}' `;
    });
  }


  fetchBillSerNo(){
    if(this.reverBillForm.valid){
    this.dataEntryService.fetchBillSerByPartyAndBuildingAndSuppBillNum(
      this.reverBillForm.get('suppCode')?.value[0][0].trim(), this.reverBillForm.get('bldgCode')?.value[0][0].trim(),this.reverBillForm.get('suppBillNo')?.value[0][0].trim()
    ).pipe(take(1)).subscribe({
      next: (res: any) => {
        if(res.status){
          this.retrieveReverseBillData(res.data);
          this.reverBillForm.patchValue({
            ser: res.data
          })
        }
      },
      error: () => {
      },
      complete: () => {
      },
    })
  }
  else {
    this.reverBillForm.markAllAsTouched();
    this.setFocusOnValidation();
  }
  }

  focusField(fieldId: any) {
    let el = document.getElementById(fieldId)
      ?.childNodes[0] as HTMLInputElement;
    el?.focus();
  }


  retrieveReverseBillData(ser: any){

    if(this.reverBillForm.valid){
      this.loader = true;
      this.dataEntryService.fetchPurchaseBillForReversal(ser).pipe(take(1), finalize(() => {
        this.loader = false;
      })).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.reverBillForm.get('suppCode')?.disable();
            this.reverBillForm.get('bldgCode')?.disable();
            this.reverBillForm.get('suppBillNo')?.disable();
            this.reverseBillType = res.extraData != undefined ? res.extraData : ""
            if(res.message!=''){
              this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message,"error")
            }
            else{
              this.saveDisable = false;
            }
            this.setRetrievedData(res.data);
            this.reverseBillDetails = true;
           
          }
          else {
            this.loader = false;
            if(res.data.isBillAuthorized){
              this.modalService.showErrorDialogCallBack(constant.ErrorDialog_Title, res.message, this.el.nativeElement.querySelector('input[id="suppBill123"]')?.focus(), "info")
              this.reverBillForm.get('suppBillNo')?.patchValue('');
            }
            else{
              this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message, "error")
              this.back();
            }
           
          }
        }
      })
    }
    

  }


  handleSaveClick(){
    let message =  this.reverseBillType == 'BOTH' ? "This bill has active debit note. Do you want to reverse bill and debit note?" : "Do you want to reverse bill ?"
    this.showDialog(constant.ErrorDialog_Title, message, "info", true)
  }

  handleExitClick(){
    this.router.navigate(['/dashboard'])
  }

  reverseBill(){
    this.loader = true;
    this.saveDisable = true;
    this.dataEntryService.reverseBill(this.reverBillForm.get('ser')?.value.trim(), this.reverseBillType.trim()).pipe(take(1), finalize(() => {
      this.loader = false;
    })).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status) {
          this.showDialog(constant.ErrorDialog_Title, res.message, "info", false)
        }
        else {
          this.toastr.showError("Something Went Wrong")
          this.saveDisable = false;
        }
      }, error: () => {
        this.saveDisable = false;
      }
    })
  }



  setRetrievedData(billData: any){
    this.reverBillForm.patchValue({
      tranSerialNo: billData.pbilldResponseBean.ser.trim(),
      debitamt: billData.debitamt !=undefined ?  billData.debitamt : '0',
      supBilldt: billData.suppbilldt,
      authnum: billData.pbilldResponseBean.authnum !=undefined ? billData.pbilldResponseBean.authnum : '',
      authdate: billData.pbilldResponseBean.authdate !=undefined ? this.datePipe.transform(billData.pbilldResponseBean.authdate, 'dd/MM/yyyy') : '',
      quantity: billData.pbilldResponseBean.quantity,
      crdays: billData.crdays !=undefined ? billData.crdays : '0',
      retention: billData.retention !=undefined ?  billData.retention : '0',
      tdsperc: billData.tdsperc !=undefined ? billData.tdsperc.toFixed(2) : '0.00',
      tdsamount: billData.tdsamount !=undefined ? billData.tdsamount :'0' ,
      rate: billData.pbilldResponseBean.rate !=undefined ?  billData.pbilldResponseBean.rate : '0',
      dequantity: billData.pbilldResponseBean.dequantity !=undefined ? billData.pbilldResponseBean.dequantity : '0',
      sku: billData.pbilldResponseBean.uom !=undefined ? billData.pbilldResponseBean.uom : '',
      uom: billData.pbilldResponseBean.uom !=undefined ? billData.pbilldResponseBean.uom : '',
      itemcode: billData.pbilldResponseBean.itemcode !=undefined ? billData.pbilldResponseBean.itemcode  : '',
      matgroup: billData.pbilldResponseBean.matgroup !=undefined ? billData.pbilldResponseBean.matgroup  : '',
      matcode: billData.pbilldResponseBean.matcode !=undefined ? billData.pbilldResponseBean.matcode  : '',
      property: billData.pbilldResponseBean.property !=undefined ? billData.pbilldResponseBean.property  : '',
      derate:  billData.pbilldResponseBean.derate !=undefined ?  billData.pbilldResponseBean.derate : '0',
      amount:  billData.amount,
      narration: billData.narration != undefined ? billData.narration : ''
    })
    console.log("Project:", billData.project.trim())
    this.getDataName('MATGROUPS',this.reverBillForm.get('matgroup')?.value?.trim(), "", 'matgroupName');
    this.getDataName('MATCODES',this.reverBillForm.get('matcode')?.value?.trim(), "", 'matcodeName');
    this.getDataName('ITEMCODES',this.reverBillForm.get('itemcode')?.value?.trim(), "", 'itemcodeName');
    this.getDataName('PROJECTS',billData.project.trim(), "", 'projectName');
    this.getDataName('COMPANY',billData.coy.trim(), "", 'companyName');
    this.getDataName('PROPRIETORS',billData.coy.trim(), "", 'proprietorName');
    this.getDataName('PROPERTY', billData.property!=undefined ? billData.property: null , "", 'property');
    this.loader = false;
  }
  
  back(){
    this.reverBillForm.get('suppCode')?.enable();
    this.reverBillForm.get('bldgCode')?.enable();
    this.reverBillForm.get('suppBillNo')?.enable();
    this.reverBillForm.reset();
    this.supplierBillData = ''
    this.reverseBillDetails = false;
    this.loader = false
    this.suppBill_condition = '';
    this.bldg_condition = ''
    this.saveDisable = true;
    setTimeout(function() {
      document.getElementById("suppCode123")?.focus();
   }, 100);
  }

  showDialog(
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
    dialogRef.afterClosed().subscribe((result: any) => {
      if(confirmationDialog && result){
        this.reverseBill();
      }
      else{
        if(!confirmationDialog){
          this.back();
        }
      }
      
    });
  }

  setFocusOnValidation(){
    if(!this.reverBillForm.get('suppCode')?.value.length){
      setTimeout(function() {
        document.getElementById("suppCode123")?.focus();
     }, 100);
    }
    else if(!this.reverBillForm.get('bldgCode')?.value.length){
      setTimeout(function() {
        document.getElementById("bldgCode123")?.focus();
     }, 100);
    }
    else if(!this.reverBillForm.get('suppBillNo')?.value.length){
      setTimeout(function() {
        document.getElementById("suppBill123")?.focus();
     }, 100);
    }

  }
}


