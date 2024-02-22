import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { finalize, take } from 'rxjs';
import { DataEntryService } from 'src/app/services/purch/data-entry.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { ModalService } from 'src/app/services/modalservice.service';
import * as constant from '../../../../../../constants/constant'
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gst-pass-material-payments',
  templateUrl: './gst-pass-material-payments.component.html',
  styleUrls: ['./gst-pass-material-payments.component.css']
})
export class GstPassMaterialPaymentsComponent implements OnInit {
  btnArray: boolean[] = [false, true, true, true, true] //[retrievebtn,addchequebtn,confirmbtn,backbtn,savebtn]
  loader: boolean = false
  unpassedAuthorisationArray: any = []
  confirmAuthArr: any = []
  eventnone: boolean = false
  addChqContainer: boolean = false
  addChqTblArr: any = []
  gstPassMaterialFormGroup = new FormGroup({
    bank: new FormControl<string | null>({ value: '', disabled: false }, [Validators.required, Validators.maxLength(51)]),
    chequeDate: new FormControl<Date | null>(new Date(), Validators.required),
    chqNo: new FormControl<string | null>({ value: '', disabled: false }, Validators.required),
    outstat: new FormControl('N')
  })
  constructor(private dataEntry: DataEntryService, private tostr: ToasterapiService, private renderer: Renderer2, private modal: ModalService, private dialog: MatDialog) { }
  ngOnInit(): void { }
  triggerFormCheck(i: any, event: any) {
    event.target.checked == true ? (this.unpassedAuthorisationArray[i].tick = true) : (this.unpassedAuthorisationArray[i].tick = false)
  }

  onEnterTriggerFormCheck(i: any, event: any) {
    event.target.checked ? event.target.checked = false : event.target.checked = true
    this.triggerFormCheck(i, event)
  }
  retrieve() {
    this.loader = true
    this.dataEntry.fetchGstPassMaterialDetails().pipe(take(1), finalize(() => { this.loader = false })).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.unpassedAuthorisationArray = res.data
          setTimeout(() => {
            this.renderer.selectRootElement('#tick0')?.focus()
          }, 10)
          this.btnArray = [true, false, false, false, true]
        }
        else {
          this.tostr.showError(res.message)
        }
      }
    })
  }

  documentChecked(errMsg: any, addChqFlag: boolean) {
    let count = 0, authTypeNotC = 0, authTypeC = 0; this.confirmAuthArr = []
    this.unpassedAuthorisationArray.forEach((element: any, index: any) => {
      (!!element.tick && element.tick == true) && (this.confirmAuthArr.push(element), count++);
      addChqFlag && (!!element.tick && element.tick == true && element.authtype?.trim() != 'C') && authTypeNotC++
      addChqFlag && (!!element.tick && element.tick == true && element.authtype?.trim() == 'C') && authTypeC++
    })
    if (count <= 0) {
      return (this.tostr.showInfo(errMsg), false)
    }
    else {
      if (addChqFlag && authTypeNotC > 0) {
        this.tostr.showInfo("You Can't add a cheque,since the particular Authorisation don't have a recovery")
        return false
      }
      else if (addChqFlag && authTypeNotC == 0 && authTypeC > 1) {
        this.tostr.showError("Select Only One Cheque")
        return false
      }
      return true
    }
  }
  back() {
    this.btnArray = [false, true, true, true, true] //[retrievebtn,addchequebtn,confirmbtn,backbtn,savebtn]
    this.unpassedAuthorisationArray = []
    this.eventnone = false
    this.addChqContainer = false
    this.confirmAuthArr = []
  }
  addCheque() {
    if (this.documentChecked('Select the Document', true)) {
      this.addChqTblArr = []
      // this.addChqTblArr = JSON.parse(JSON.stringify(this.confirmAuthArr));
      this.addChqTblArr = this.confirmAuthArr;
      this.addChqTblArr[0].amount = Math.abs(this.addChqTblArr[0].payamount)
      this.addChqTblArr[0].recnum = this.addChqTblArr[0].authnum
      this.gstPassMaterialFormGroup.patchValue({
        bank: this.confirmAuthArr[0]?.bank,
        chequeDate: !this.confirmAuthArr[0]?.chequeDate ? new Date() : new Date(moment(this.confirmAuthArr[0]?.chequeDate).format('YYYY-MM-DD')),
        chqNo: this.confirmAuthArr[0]?.chqnum,
        outstat: !this.confirmAuthArr[0]?.outstat ? 'N' : this.addChqTblArr[0].outstat
      })
      this.addChqContainer = true
      this.eventnone = true
      this.btnArray = [true, true, true, false, true] //[retrievebtn,addchequebtn,confirmbtn,backbtn,savebtn]
      console.log(this.confirmAuthArr, this.unpassedAuthorisationArray);

    }
  }

  chqForRecoveryLoop() {
    for (let i = 0; i < this.unpassedAuthorisationArray.length; i++) {
      if (this.unpassedAuthorisationArray[i].tick && this.unpassedAuthorisationArray[i].authtype.trim() == 'C' && !this.unpassedAuthorisationArray[i].bank && !this.unpassedAuthorisationArray[i].chqDate && !this.unpassedAuthorisationArray[i].chqnum) {
        this.tostr.showError(`Enter the cheque for recovery certificate no - ${this.unpassedAuthorisationArray[i].authnum}`)
        return false
      }
    }
    return true
  }

  confirm(event: any) {
    if (this.documentChecked('No Certificate Selected for Passing', false)) {
      if (this.chqForRecoveryLoop()) {
        this.unpassedAuthorisationArray = this.confirmAuthArr
        this.eventnone = true
        this.btnArray = [true, true, true, false, false]
        console.log("confirm enter", this.unpassedAuthorisationArray);
      }
    }
  }
  chequeAdded() {
    if (this.gstPassMaterialFormGroup.valid) {
      this.addChqTblArr[0].bank = this.gstPassMaterialFormGroup.get('bank')?.value
      this.addChqTblArr[0].chequeDate = new Date(moment(this.gstPassMaterialFormGroup.get('chequeDate')?.value).format('YYYY-MM-DD'))
      this.addChqTblArr[0].chqnum = this.gstPassMaterialFormGroup.get('chqNo')?.value
      this.addChqTblArr[0].outstat = this.gstPassMaterialFormGroup.get('outstat')?.value
      this.addChqTblArr[0].chqDate = moment(this.gstPassMaterialFormGroup.get('chequeDate')?.value).format('DD/MM/YYYY')
      this.eventnone = false
      this.btnArray = [true, false, false, false, true]
      this.addChqContainer = false
      setTimeout(() => {
        this.renderer.selectRootElement('#tick0')?.focus()
      }, 300)
    }
    else {
      this.gstPassMaterialFormGroup.markAllAsTouched()
    }
  }
  delete() {
    this.addChqTblArr[0].bank = null
    this.addChqTblArr[0].chequeDate = new Date()
    this.addChqTblArr[0].chqnum = null
    this.addChqTblArr[0].chqDate = null
    this.addChqTblArr[0].outstat = 'N'
    this.addChqContainer = false
    this.eventnone = false
    this.btnArray = [true, false, false, false, true]
    setTimeout(() => {
      this.renderer.selectRootElement('#tick0')?.focus()
    }, 300)
  }
  save() {
    let requestBody: Object = { materialPaymentRequestBeanList: this.unpassedAuthorisationArray }
    this.loader = true
    let response: any
    this.dataEntry.savePassMaterialPayments(requestBody).pipe(take(1), finalize(() => { this.loader = false })).subscribe({
      next: (res: any) => {
        response = res
      },
      complete: () => {
        if (response.status) {
          let transerArr = response.data
          let transerArrRes: any = []
          this.unpassedAuthorisationArray.map((res: any, i: any) => {
            Object.entries(transerArr).map(([key, val]) => {
              if (key == this.unpassedAuthorisationArray[i].authnum?.trim()) {
                this.unpassedAuthorisationArray[i].transer = val
                transerArrRes.push(val)
              }
            })
          })
          this.btnArray = [false, true, true, true, true]
          this.afterSaveShowErrorDialog(constant.ErrorDialog_Title, `${response.message}${transerArrRes}`, "info")
        }
        else {
          this.modal.showErrorDialog(constant.ErrorDialog_Title, `${response.message}`, "error")
        }
      }
    })
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
    dialogRef.afterClosed().subscribe(() => {
      this.back()
    })
  }
}
