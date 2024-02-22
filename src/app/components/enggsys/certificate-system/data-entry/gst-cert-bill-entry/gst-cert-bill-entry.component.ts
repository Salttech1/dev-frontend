import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { finalize, merge, take } from 'rxjs';
import { DataEntryService } from 'src/app/services/enggsys/data-entry.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-gst-cert-bill-entry',
  templateUrl: './gst-cert-bill-entry.component.html',
  styleUrls: ['./gst-cert-bill-entry.component.css']
})
export class GstCertBillEntryComponent implements OnInit {
  qf!: FormGroup
  loaderToggle: boolean = false
  bldgSQ = `(bmap_closedate >= to_date('${moment().format('DD.MM.yyyy')}','dd.mm.yyyy') or bmap_closedate is null)`
  conttorSQ = `par_partytype = 'E'`
  serQ: string | null | undefined | any = ``
  loader: boolean = false;
  cbcontainer: boolean = true;
  actionBtn = [false, false, false, true, true] // Add,Retrieve,Add Row,save,back
  modalTitle = 'K Raheja'
  maxDate=moment()
  constructor(
    private fb: FormBuilder,
    private ds: DataEntryService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalComponent>,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      advanceadj: [0],
      advancetoadj: [0],
      contract: ['', Validators.required],
      bldgcode: [''],
      workcode: [''],
      partycode: [''],
      partytype: ["E"],
      ser: ['', Validators.required],
      coy: [{value:'',disabled:true}],
      contbilldt: ['',Validators.required],
      contbillno: ['',Validators.required],
      durfrom: [],
      durto: [],
      amount: [],
      tdsperc: [],
      tdsamount: [],
      retention: [],
      freight: [],
      transport: [],
      packing: [],
      othercharges: [],
      debsocyn: [''],
      narration: [''],
      totalAdvance:[0],
      balanceAdvance:[0],
      gstno:[{value:'',disabled:true}],
      statecode:[{value:'',disabled:true}],
      cbilldRequestBean: this.fb.array([])
    })
    this.codeChg()
  }

  // modal dialog
  // show modal popup for dialogRef Object
  openDialog(
    titleVal: any,
    templateField: any,
    isF1PressedFlag: boolean,
    type: string | null,
    msg: string
  ) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        isF1Pressed: isF1PressedFlag,
        title: titleVal,
        message: msg,
        template: templateField,
        type: type,
      },
    });
    this.dialogRef = dialogRef;
  }

  get cbillD() {
    return this.qf.controls['cbilldRequestBean'] as FormArray;
  }

  cbillDForm() {
    return this.fb.group({
      amount: [0],
      cgstperc: [0],
      cgstamt: [0],
      discountamt: [0],
      igstperc: [0],
      igstamt: [0],
      quantity: [0],
      rate: [0],
      saccode: [''],
      sacdesc: [''],
      sgstperc: [0],
      sgstamt: [0],
      taxableamt: [0],
      ugstamt: [0],
      ugstperc: [0],
      uom: [null],
    })
  }

  retrieve() {
    if (this.qf.get('ser')?.valid) {
      this.loader = true
      let ser = this.qf.get('ser')?.value?.[0]?.trim();
      this.ds.fetchBillEntry(ser).pipe(take(1), finalize(() => { this.loader = false })).subscribe({
        next: (res: any) => {
          if (res?.status) {
            this.cbcontainer = true;
            this.cbillD.clear()
            if(res?.message){
              this.openDialog(this.modalTitle, '', false, 'error', res.message)
              this.dialogRef.afterClosed().subscribe((res: any) => {
                this.renderer.selectRootElement('#taxinvoice')?.focus()
              })
            }
            setTimeout(() => {
              this.qf.patchValue(res?.data)
              this.qf.get('contbilldt')?.patchValue(moment(res?.data.contbilldt, 'DD/MM/yyyy').format('yyyy-MM-DD'));
              this.qf.get('durfrom')?.patchValue(moment(res?.data.durfrom, 'DD/MM/yyyy').format('yyyy-MM-DD'));
              this.qf.get('durto')?.patchValue(moment(res?.data.durto, 'DD/MM/yyyy').format('yyyy-MM-DD'));
              this.cbillD.push(this.cbillDForm())
              this.qf.get('cbilldRequestBean')?.patchValue(res?.data?.cbilldResponseBean)
            })
            this.edField(['contract', 'bldgcode', 'workcode', 'partycode', 'ser'], false)
            this.actionBtn = [true, true, false, false, false]
            this.renderer.selectRootElement('#taxinvoice')?.focus()
          }
          else {
            this.openDialog(this.modalTitle, '', false, 'error', res.message)
            this.dialogRef.afterClosed().subscribe((res: any) => {
              this.renderer.selectRootElement('#serid')?.focus()
              this.qf.get('ser')?.patchValue('')
            })

          }
        }
      })
    }
    else {
      this.qf.get('ser')?.markAsTouched()
    }
  }

  codeChg() {
    // creating query codition for ser based on 'contract', 'bldgcode', 'workcode', 'partycode' controls
    const reqControl = ['contract', 'bldgcode', 'workcode', 'partycode'];
    merge(
      ...reqControl.map((name: any) => this.qf.get(name)?.valueChanges)
    ).subscribe((val) => {
      let re = this.qf.get('contract')?.value?.[0];
      let bc = this.qf.get('bldgcode')?.value?.[0];
      let wc = this.qf.get('workcode')?.value?.[0];
      let p = this.qf.get('partycode')?.value?.[0]
      let strLocFilter: String | undefined | null = '';
      let strLoc = ''
      let strAnd: String | undefined | null = ''
      if (bc) {
        strLoc += `${strLocFilter} ${strAnd} cblh_bldgcode = '${bc?.trim()}'`
        console.log(strLocFilter, "strLocFilter");
        strAnd = 'AND'
      }
      if (re) {
        strLoc += `${strLocFilter} ${strAnd} cblh_contract = '${re?.trim()}'`
        strAnd = 'AND'
      }
      if (wc instanceof Object) {
        strLoc += `${strLocFilter} ${strAnd} cblh_workcode = '${wc?.[0]?.trim()}'`
        strAnd = 'AND'
      }
      if (p instanceof Object) {
        strLoc += `${strLocFilter} ${strAnd} cblh_partycode = '${p?.[0]?.trim()}'`
      }
      this.serQ = strLoc
    })
  }

  //generic enable/disable fields
  edField(arr: string[], flag: boolean) {
    arr.forEach((e: any) => {
      flag ? this.qf.get(e)?.enable() : this.qf.get(e)?.disable()
    });
  }

  back() {
    this.qf.reset()
    this.qf.enable()
    this.cbillD.clear()
    this.actionBtn = [false,false,false,true,true]
  }
  addRow() {
    this.cbillD.push(this.cbillDForm())
  }
  deleteRow(i: number) {
    this.cbillD.removeAt(i)
  }
  add() {
    console.log(this.qf.get('contbilldt'),"billdt");
    
    if (this.qf.get('contract')?.valid) {
      let rowsLen = 10;
      for (let i = 0; i < rowsLen; i++) {
        this.cbillD.push(this.cbillDForm())
      }
      this.cbcontainer = true
    }

  }
}
