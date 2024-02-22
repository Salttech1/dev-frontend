import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { busttonsList } from 'src/constants/commonconstant';

@Component({
  selector: 'app-logic-note-vendor-orderno',
  templateUrl: './logic-note-vendor-orderno.component.html',
  styleUrls: ['./logic-note-vendor-orderno.component.css']
})
export class LogicNoteVendorOrdernoComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  filters: any = {
    getracno: ''
  }

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  logicNoteVendorForm: FormGroup = this.fb.group({
    Building: ['', Validators.required],
    racno: ['', Validators.required],
    racnoName: [{ value: '', disabled: true }],

    addLogicNoteVendorList: this.fb.array([])
  })

  createLogicNoteVendor(): FormGroup | any {
    return this.fb.group({
      srno: [''],
      vendorName: [''],
      vendorOrderNo: ['']
    })
  }

  addLogicNoteVendor(){
    const addArray = this.logicNoteVendorForm.get('addLogicNoteVendorList') as FormArray;
    addArray.push(this.createLogicNoteVendor())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('logicNoteVendor_building')
    this.addLogicNoteVendor();
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['add', 'back'], busttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'save', 'exit'], busttonsList, false)
  }

  buttonAction(val: String) {
    if (val == 'add') {

    }
    if (val == 'retrieve') {
      this.fetchLogicNoteVendorOrderNo();
    }
    if (val == 'save') {
      this.saveLogicNoteVendorOrderNo();
    }
    if (val == 'back') {
      this.goBack();
    }
    if (val == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  fetchLogicNoteVendorOrderNo(){
    if (this.logicNoteVendorForm.value.Building != '' && this.logicNoteVendorForm.value.racno != '') {
      
    } else {
      if (this.logicNoteVendorForm.value.Building == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter building code.', 'info')
      }
      else if (this.logicNoteVendorForm.value.racno == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter rac no.', 'info')
      }
    }
  }

  saveLogicNoteVendorOrderNo(){

  }

  goBack(){

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

  onLeaveProject(val: String) {
    this.filters.getracno = "mclh_projcode='" + val + "'";
    console.log("getproject :", this.filters.getracno);
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
      if (this.logicNoteVendorForm.value.Building == '') {
        this.setFocus('logicNoteVendor_building')
      }
      else if (this.logicNoteVendorForm.value.racno == '') {
        this.setFocus('logicNoteVendor_racno')
      }
    });
  }

}
