import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-lc-authorisation-entry',
  templateUrl: './lc-authorisation-entry.component.html',
  styleUrls: ['./lc-authorisation-entry.component.css']
})
export class LcAuthorisationEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'lcDetails', 'save', 'back', 'exit'])

  config: any = {
    isLoading: false
  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpRequestService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  lcAuthorisationEntryForm: FormGroup = this.fb.group({
    supplier: ['', Validators.required],
    bldg: ['', Validators.required],
    authType: [{value: 'A', disabled: true}],
    lcAuthNo: [''], 

    proprietor: [{value: '', disabled: true}],
    proprietorName: [{value: '', disabled: true}],
    company: [{value: '', disabled: true}],
    companyName: [{value: '', disabled: true}],
    project: [{value: '', disabled: true}],
    projectName: [{value: '', disabled: true}],
    misProject: [{value: '', disabled: true}],
    misProjectName: [{value: '', disabled: true}],

    isCheck: [''],
    preparedBy: [''],
    authDate: [''],
    matGroup: [''],
    noDays:[''],
    paymode: [''],
    quantity: [''],
    uom:[''],
    masterAuthNo: [''],
    currency: [''],
    amt: [''],
    bankCharges: [''],
    payAmt: [''],
    docNo: [''],
    documentDate:[''],
    category:[''],
    lcNo: [''],
    fileNo: [''],
    countryOrigin:[''],
    cityOrigin:[''],
    remarks: [''],
    purpose: [''],
    debitParty: [''],
    debitAmt: [''],
    debitCurr: [''],
    debitConvRate: [''],
    debitingReason: [''],
    lcOpenDate: [''],
    lastShipmentDate: [''],
    lcExpiryDate: [''],
    epcgNo: [''],
    epcgDate: [''],
    dutyFreeNo: [''],
    dutyFreeDate: [''],

    addLcAuthorisationEntryList: this.fb.array([])
  })

  createLcAuthorisationEntry(): FormGroup | any{
    return this.fb.group({
      epcgNo: [''],
      dutyFreeNo: [''],
      lcno: [''],
      inspectionDate: [''],
      shipDate: [''],
      docsRecdDate: [''],
      boeNo: [''],
      boeDate: [''],
      certdt:['']
    })
  }

  addRow(){
    const oneRowAdd = this.lcAuthorisationEntryForm.get('addLcAuthorisationEntryList') as FormArray
    oneRowAdd.push(this.createLcAuthorisationEntry())
  }

  deleteRow(index: number){
    const oneRowDelete = this.lcAuthorisationEntryForm.get('addLcAuthorisationEntryList') as FormArray
    oneRowDelete.removeAt(this.createLcAuthorisationEntry())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('lcauth_supplier');
    this.addRow();
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'lcDetails', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: string){
    if (event == 'add') {
      
    }
    if (event == 'retrieve') {
      
    }
    if (event == 'lcDetails') {
      
    }
    if (event == 'save') {
      
    }
    if (event == 'back') {
      
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
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
}
