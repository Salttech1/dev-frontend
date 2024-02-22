import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { api_url } from 'src/constants/constant';


@Component({
  selector: 'app-estimate-and-contract-entry',
  templateUrl: './estimate-and-contract-entry.component.html',
  styleUrls: ['./estimate-and-contract-entry.component.css']
})
export class EstimateAndContractEntryComponent implements OnInit {
  initialMode: boolean = false

  filters: any = {
    getRacNo: ''
  }

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  estimateAndContractEntry: FormGroup = this.fb.group({
    project: ['', Validators.required],
    projectName: [{ value: '', disabled: true }],
    racno: ['', Validators.required],
    racName: [{ value: '', disabled: true }],

    addEstimateAndContractList: this.fb.array([])
  })

  createEstimateAndEntry(): FormGroup | any {
    return this.fb.group({
      partyType: [{ value: '', disabled: true }],
      partyCode: [{ value: '', disabled: true }],
      partyName: [{ value: '', disabled: true }],
      actWorkDone: [''],
      otherDebit: [''],
      estimateAmt: [''],
      contractVal: ['']
    })
  }

  addEstimate(){
    const array = this.estimateAndContractEntry.get('addEstimateAndContractList') as FormArray;
    array.push(this.createEstimateAndEntry())
  }

  ngOnInit(): void {
    this.init();
    this.addEstimate();
    this.setFocus('estimate_project');
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {
      this.addEstimateAndContract();
    }
    if (event == 'retrieve') {
      this.getEstimateAndContract();
    }
    if (event == 'save') {
      this.updateEstimateAndContract();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  addEstimateAndContract() {
    if ((this.estimateAndContractEntry.value.project != '' && this.estimateAndContractEntry.value.racno != '') && this.estimateAndContractEntry.valid) {
      this.initialMode = true;
      this.estimateAndContractEntry.get('project')?.disable();
      this.estimateAndContractEntry.get('racno')?.disable();

      // this.http.request('post', api_url. ,null,null).subscribe((res: any) => {
      //   console.log("Save estimate And Contract :", res);
        
      // })

      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    }
    else{
      if (this.estimateAndContractEntry.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', "Please enter project code.","info")
      }
      else if(this.estimateAndContractEntry.value.racno == ''){
        this.showErrorDialog('K-Raheja ERP', "Please enter logic note no.","info")
      }
      else if(this.estimateAndContractEntry.invalid){
      this.showErroPopup();
      }
    }
  }

  showErroPopup() {
    this.markFormGroupAndArrayAsTouched(this.estimateAndContractEntry);

    // Check if any form control is invalid
    if (this.estimateAndContractEntry.invalid) {
      this.toastr.error('Please fill in all required fields.');
    }

  }

  markFormGroupAndArrayAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupAndArrayAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getEstimateAndContract() {
    if ((this.estimateAndContractEntry.value.project != '' && this.estimateAndContractEntry.value.racno != '') && this.estimateAndContractEntry.valid) {
      this.initialMode = true;
      this.estimateAndContractEntry.get('project')?.disable();
      this.estimateAndContractEntry.get('racno')?.disable();

      // this.http.request('get', api_url. , null, null).subscribe((res: any) => {
      //   console.log("Get estimate And Contract :", res);
        
      // })
      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    }
    else{
      if (this.estimateAndContractEntry.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', "Please enter project code.","info")
      }
      else if(this.estimateAndContractEntry.value.racno == ''){
        this.showErrorDialog('K-Raheja ERP', "Please enter logic note no.","info")
      }
    }
  }

  updateEstimateAndContract() {

  }

  goBack(){
    this.initialMode = false;
    this.estimateAndContractEntry.reset();
    this.estimateAndContractEntry.get('project')?.enable();
    this.estimateAndContractEntry.get('racno')?.enable();
    this.setFocus('estimate_project')

    // const reset = this.estimateAndContractEntry.get('project')
    // reset?.setValidators(null)
    // reset?.updateValueAndValidity()

    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  onLeaveProject(val: String) {
    this.filters.getRacNo = "mclh_projcode='" + val + "'";
    console.log("get rac no", this.filters.getRacNo);
  }

   // setFocus to object on form
   setFocus(id: string) {
    // Method to set focus to object on form
    setTimeout(() => {
      this.renderer.selectRootElement(`#${id}`).focus();
    }, 100);
  }

  focusById(id: string) {
    this.renderer.selectRootElement(`#${id}`)?.focus();
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
      console.log("Dialog Opened")
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.estimateAndContractEntry.value.project == '') {
        this.setFocus('estimate_project')
      }
      else if(this.estimateAndContractEntry.value.racno == ''){
        this.setFocus('estimate_racno')
      }
    });
  }

}
