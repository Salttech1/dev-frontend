import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { api_url } from 'src/constants/constant';
import { ToastrService } from 'ngx-toastr';
import { data } from 'jquery';

@Component({
  selector: 'app-lc-certificate-entry',
  templateUrl: './lc-certificate-entry.component.html',
  styleUrls: ['./lc-certificate-entry.component.css']
})
export class LcCertificateEntryComponent implements OnInit {
  initialMode: boolean = false
  transMode: String = ''
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'lcDetails', 'save', 'back', 'exit'])

  config = {
    isLoading: false
  }

  filters: any = {

  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private renderer: Renderer2
  ) { }

  lcCertificateForm: FormGroup = this.fb.group({
    isCheck: [''],
    recId: ['', Validators.required], //B42588M
    certType: ['', Validators.required], //R
    runSer: [''],
    lcCertNo: [''], //LCC0000175

    proprietor: [''],
    proprietorName: [{ value: '', disabled: true }],
    company: [''],
    companyName: [{ value: '', disabled: true }],
    project: [''],
    projectName: [{ value: '', disabled: true }],
    bldg: [''],
    bldgName: [{ value: '', disabled: true }],
    workCode: [''],
    workCodeName: [{ value: '', disabled: true }],
    partyCode: [''],
    partyCodeName: [{ value: '', disabled: true }],
    totalAmt: [''],
    durationFrom: [''],
    durationUpto: [''],

    preparedBy: [''],
    certDate: [new Date()],
    noOfDays: [''],
    durFrom: [''],
    durUpto: [''],
    paymode: [''],
    quantity: [''],
    uom: [''],
    currency: [''],
    amt: [''],
    bankCharges: [''],
    payAmt: [{ value: '', disabled: true }],
    docNo: [''],
    docDate: [''],
    masterCertNo: [''],
    category: [''],
    lcNo: [''],
    fileNo: [''],
    remark: [''],
    purpose: [''],

    addLcCertificateEntryList: this.fb.array([])
  })

  createLcCertificateEntry(data: any): FormGroup | any {
    return this.fb.group({
      epcgNo: [data ? data.lcDetailsList?.epcgNo : ''],
      dutyFreeNo: [data ? data.lcDetailsList?.dutyFreeNo : ''],
      lcno: [data ? data.lcDetailsList?.lcNo : ''],
      inspectionDate: [data ? data.lcDetailsList?.inspectionDate : ''],
      shipDate: [data ? data.lcDetailsList?.shipDate : ''],
      docsRecdDate: [data ? data.lcDetailsList?.docDate : ''],
      boeNo: [data ? data.lcDetailsList?.boeNo : ''],
      boeDate: [data ? data.lcDetailsList?.boeDate : '']
    })
  }

  addRow(data: any) {
    const oneRowAdd = this.lcCertificateForm.get('addLcCertificateEntryList') as FormArray
    oneRowAdd.push(this.createLcCertificateEntry(data))
  }

  deleteRow(index: number) {
    const oneRowDelete = this.lcCertificateForm.get('addLcCertificateEntryList') as FormArray
    oneRowDelete.removeAt(this.createLcCertificateEntry(data))
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('lcCert_recId');
    this.addRow(data);
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['lcDetails', 'save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {
      this.addLcCertificate();
    }
    if (event == 'retrieve') {
      this.fetchLcCertificate();
    }
    if (event == 'lcDetails') {
      document.getElementById('printProcess')?.click();
    }
    if (event == 'save') {
      this.saveLcCertificate();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  // Get Lc Cert Num
  getLcCertNum() {
    let param = {
      recId: this.commonService.convertArryaToString(this.lcCertificateForm.get('recId')?.value).trimEnd()
    }
    if (this.lcCertificateForm.get('recId')?.value) {
      this.http.request('get', api_url.fetchLcCertNum , null, param).subscribe((res: any) =>{
        this.lcCertificateForm.patchValue({
          lcCertNo: res.prvCertNum
        })
      })
    }
  }

  // Add Lc Certificate Entry
  addLcCertificate() {
    let param = {
      recId: this.commonService.convertArryaToString(this.lcCertificateForm.get('recId')?.value)?.trimEnd(),
      certType: this.commonService.convertArryaToString(this.lcCertificateForm.get('certType')?.value)?.trimEnd(),
      lcerCertnum: this.commonService.convertArryaToString(this.lcCertificateForm.get('lcCertNo')?.value)?.trimEnd(),
    }

    if (this.lcCertificateForm.valid) {
      if (this.lcCertificateForm.value.recId != '' && this.lcCertificateForm.value.certType != '') {
        this.transMode = 'S'
        this.initialMode = true
        this.config.isLoading = true
        this.setFocus('lcCert_preparedBy');

        this.http.request('get', api_url.fetchContractDetails, null, param).subscribe({
          next: (res: any) => {
            this.config.isLoading = false;
            console.log("check", res);

            this.lcCertificateForm.patchValue({
              runSer: res.prvRunSer,
              proprietor: res.proprietor,
              company: res.company,
              project: res.project,
              bldg: res.building,
              workCode: res.workCode,
              partyCode: res.partyCode,
              totalAmt: res.totalAmtCertified,
              durationFrom: res.durationFrom,
              durationUpto: res.durationUpto,
            })
            this.lcCertificateForm.get('recId')?.disable();
            this.lcCertificateForm.get('certType')?.disable();
            this.lcCertificateForm.get('runSer')?.disable();
            this.lcCertificateForm.get('lcCertNo')?.disable();
            this.lcCertificateForm.get('proprietor')?.disable();
            this.lcCertificateForm.get('company')?.disable();
            this.lcCertificateForm.get('project')?.disable();
            this.lcCertificateForm.get('bldg')?.disable();
            this.lcCertificateForm.get('workCode')?.disable();
            this.lcCertificateForm.get('partyCode')?.disable();
            this.lcCertificateForm.get('totalAmt')?.disable();
            this.lcCertificateForm.get('durationFrom')?.disable();
            this.lcCertificateForm.get('durationUpto')?.disable();
          }, error: () => {
            this.config.isLoading = false
          }
        })

        this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
        this.commonService.enableDisableButtonsByIds(['lcDetails', 'save', 'back'], this.buttonsList, false)
      }
    }
    else {
      if (this.lcCertificateForm.value.recId == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter Rec Id.', 'error')
      }
      else if (this.lcCertificateForm.value.certType == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Certificate type is not entered...', 'error')
      }
    }
  }

  // Get Lc Certificate Entry
  fetchLcCertificate() {
    let param = {
      recId: this.commonService.convertArryaToString(this.lcCertificateForm.get('recId')?.value).trimEnd(),
      certType: this.commonService.convertArryaToString(this.lcCertificateForm.get('certType')?.value).trimEnd(),
      lcerCertnum: this.commonService.convertArryaToString(this.lcCertificateForm.get('lcCertNo')?.value).trimEnd(),
    }

    if (this.lcCertificateForm.valid) {
      if (this.lcCertificateForm.value.lcCertNo != '' && this.lcCertificateForm.value.certType != '') {

        this.config.isLoading = true
        this.http.request('get', api_url.fetchContractDetails, null, param).subscribe({
          next: (res: any) => {
            console.log("check", res);

            this.lcCertificateForm.patchValue({
              proprietor: res.proprietor,
              company: res.company,
              project: res.project,
              bldg: res.building,
              workCode: res.workCode,
              partyCode: res.partyCode,
              totalAmt: res.totalAmtCertified,
              durationFrom: res.durationFrom,
              durationUpto: res.durationUpto,
            })
            this.lcCertificateForm.get('recId')?.disable();
            this.lcCertificateForm.get('certType')?.disable();
            this.lcCertificateForm.get('runSer')?.disable();
            this.lcCertificateForm.get('lcCertNo')?.disable();
            this.lcCertificateForm.get('proprietor')?.disable();
            this.lcCertificateForm.get('company')?.disable();
            this.lcCertificateForm.get('project')?.disable();
            this.lcCertificateForm.get('bldg')?.disable();
            this.lcCertificateForm.get('workCode')?.disable();
            this.lcCertificateForm.get('partyCode')?.disable();
            this.lcCertificateForm.get('totalAmt')?.disable();
            this.lcCertificateForm.get('durationFrom')?.disable();
            this.lcCertificateForm.get('durationUpto')?.disable();
          }, error: () => {
            this.config.isLoading = false
          }
        })

        this.http.request('get', api_url.fetchLcCertificate, null, param).subscribe({
          next: (res: any) => {
            this.initialMode = true
            this.config.isLoading = false
            this.lcCertificateForm.patchValue({
              preparedBy: res.preparedBy,
              certDate: res.certificateDate,
              noOfDays: res.noOfDays,
              durFrom: res.durationFrom,
              durUpto: res.durationUpto,
              paymode: res.payMode,
              quantity: res.quantity,
              uom: res.uom,
              currency: res.currency,
              amt: res.amount,
              bankCharges: res.bankCharges,
              payAmt: res.payAmount,
              docNo: res.documentNo,
              docDate: res.documentDate,
              masterCertNo: res.masterCertificateYN,
              category: res.category,
              lcNo: res.lcNo,
              fileNo: res.fileNo,
              remark: res.remarks,
              purpose: res.purpose
            })

            res.lcDetailsList.map((item: any) => {
              this.createLcCertificateEntry(item);
            })

            this.toastr.success('Data fetch successfully.', 'Data fetch.')

            this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
            this.commonService.enableDisableButtonsByIds(['lcDetails', 'save', 'back'], this.buttonsList, false)
          }, error: () => {
            this.config.isLoading = false
          }
        })
      }
    }
    else {
      if (this.lcCertificateForm.value.recId == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter Rec Id.', 'error')
      }
      else if (this.lcCertificateForm.value.certType == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Certificate type is not entered...', 'error')
      }
    }
  }

  // Save And Update Lc Certificate Entry
  saveLcCertificate() {
    let param = {
      recId: this.commonService.convertArryaToString(this.lcCertificateForm.get('recId')?.value)?.trimEnd(),
      certType: this.commonService.convertArryaToString(this.lcCertificateForm.get('certType')?.value)?.trimEnd(),
      lcerCertnum: this.commonService.convertArryaToString(this.lcCertificateForm.get('lcCertNo')?.value)?.trimEnd(),
    }

    let payload = {
      tranType: 'E',
      preparedBy: this.commonService.convertArryaToString(this.lcCertificateForm.get('preparedBy')?.value)?.trimEnd(),
      certificateDate: this.lcCertificateForm.get('certDate')?.value,
      noOfDays: this.lcCertificateForm.get('noOfDays')?.value,
      durationFrom: this.lcCertificateForm.get('durFrom')?.value,
      durationUpto: this.lcCertificateForm.get('durUpto')?.value,
      payMode: this.commonService.convertArryaToString(this.lcCertificateForm.get('paymode')?.value)?.trimEnd(),
      quantity: this.lcCertificateForm.get('quantity')?.value,
      uom: this.commonService.convertArryaToString(this.lcCertificateForm.get('uom')?.value)?.trimEnd,
      currency: this.commonService.convertArryaToString(this.lcCertificateForm.get('currency')?.value)?.trimEnd(),
      amount: this.lcCertificateForm.get('amt')?.value,
      bankCharges: this.lcCertificateForm.get('bankCharges')?.value,
      payAmount: this.lcCertificateForm.get('payAmt')?.value,
      documentNo: this.lcCertificateForm.get('docNo')?.value,
      documentDate: this.lcCertificateForm.get('docDate')?.value,
      masterCertificateNo: this.commonService.convertArryaToString(this.lcCertificateForm.get('masterCertNo')?.value)?.trimEnd(),
      category: this.commonService.convertArryaToString(this.lcCertificateForm.get('category')?.value)?.trimEnd(),
      lcNo: this.commonService.convertArryaToString(this.lcCertificateForm.get('lcNo')?.value)?.trimEnd(),
      fileNo: this.lcCertificateForm.get('fileNo')?.value,
      remarks: this.lcCertificateForm.get('remark')?.value,
      purpose: this.lcCertificateForm.get('purpose')?.value,
      lcDetailsList: [
        {
          epcgDate: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('epcgNo')?.value,
          dutyFreeNo: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('dutyFreeNo')?.value,
          lcNo: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('lcno')?.value,
          inspectionDate: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('inspectionDate')?.value,
          shipDate: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('shipDate')?.value,
          docsRecdDate: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('docsRecdDate')?.value,
          boeNo: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('boeNo')?.value,
          boeDate: this.lcCertificateForm.controls['createLcCertificateEntry']?.get('boeDate')?.value,
        }
      ]
    }

    if (this.transMode == 'S') {
      this.config.isLoading = true
      this.http.request('post', api_url.createLcCertificate, payload, param).subscribe({
        next: (res: any) => {
          this.initialMode = true
          this.config.isLoading = false;
          console.log("save data", res);
          this.toastr.success("Data saved.", "Data save successfully");
          this.initialMode = false;
        }, error: () => {
          this.config.isLoading = true
        }
      })

      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['lcDetails', 'save', 'back'], this.buttonsList, false)
    }
    else if (this.transMode == 'U') {

    }
  }

  goBack() {
    this.showConfirmation('K-Raheja ERP', 'Do you want to ignore the changes done?', 'info', true)
  }

  setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
  }

  // error dailog box
  showErrorFieldDialog(titleVal: any, message: string, type: string) {
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
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.lcCertificateForm.reset();
        this.initialMode = false;
        this.setFocus('lcCert_recId')
      }

      if (this.lcCertificateForm.value.recId == '') {
        this.setFocus('lcCert_recId')
      }
      else if (this.lcCertificateForm.value.certType == '') {
        this.setFocus('lcCert_certType')
      }
    });
  }

  // confirm dailog box
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
        this.initialMode = false;
        this.lcCertificateForm.reset();
        this.setFocus('lcCert_recId')
        this.lcCertificateForm.get('recId')?.enable();
        this.lcCertificateForm.get('certType')?.enable();
        this.lcCertificateForm.get('runSer')?.enable();
        this.lcCertificateForm.get('lcCertNo')?.enable();

        const resetDetails = this.lcCertificateForm.get('addLcCertificateEntryList') as FormArray;
        resetDetails.clear();

        this.commonService.enableDisableButtonsByIds(['lcDetails', 'save', 'back'], this.buttonsList, true)
        this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
      }
    });
  }

}
