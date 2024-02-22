import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';

@Component({
  selector: 'app-partywise-narration-entry',
  templateUrl: './partywise-narration-entry.component.html',
  styleUrls: ['./partywise-narration-entry.component.css']
})
export class PartywiseNarrationEntryComponent implements OnInit {
  initialMode: boolean = false
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  config = {
    partyType: [
      { id: 'L', name: 'Labour' },
      { id: 'M', name: 'Material' },
    ]
  }

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  partywiseNarrationEntry: FormGroup = this.fb.group({
    partyType: ['L', Validators.required],
    project: ['', Validators.required],
    projectName: [{ value: '', disabled: true }],
    group: ['', Validators.required],
    groupName: [{ value: '', disabled: true }],

    addPartywisenarrationentry: this.fb.array([])
  })

  createPartywiseNarration(): FormGroup | any {
    return this.fb.group({
      matCertCode: [''],
      matCertName: [''],
      partyCode: [''],
      partyName: [''],
      narration: ['']
    })
  }

  addParty() {
    const array = this.partywiseNarrationEntry.get('addPartywisenarrationentry') as FormArray;
    array.push(this.createPartywiseNarration())
  }

  // deleteParty(index: number){
  //   const addRow = this.partywiseNarrationEntry.get('addPartywisenarrationentry') as FormArray;
  //   addRow.removeAt(this.createPartywiseNarration())
  // }

  ngOnInit(): void {
    this.init();
    this.addParty();
    this.setFocus('party_project')
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {
      this.addPartywiseNarration();
    }
    if (event == 'retrieve') {
      this.fetchPartywiseNarration();
    }
    if (event == 'save') {
      this.updatePartywiseNarration();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  addPartywiseNarration() {
    if ((this.partywiseNarrationEntry.value.project != '' && this.partywiseNarrationEntry.value.group != '') && this.partywiseNarrationEntry.valid) {
      this.initialMode = true
      this.partywiseNarrationEntry.get('project')?.disable();
      this.partywiseNarrationEntry.get('group')?.disable();

      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    } else {
      if (this.partywiseNarrationEntry.value.project == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter project code.', 'info')
      }
      else if (this.partywiseNarrationEntry.value.group == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter group code.', 'info')
      }
    }
  }

  fetchPartywiseNarration() {
    let param = {
      project: this.commonService.convertArryaToString(this.partywiseNarrationEntry.get('project')?.value),
      group: this.commonService.convertArryaToString(this.partywiseNarrationEntry.get('group')?.value),
    }
    if ((this.partywiseNarrationEntry.value.project != '' && this.partywiseNarrationEntry.value.group != '') && this.partywiseNarrationEntry.valid) {
      this.initialMode = true;
      this.partywiseNarrationEntry.get('project')?.disable();
      this.partywiseNarrationEntry.get('group')?.disable();

      // this.http.request('get', api_url. , null, param).subscribe((res: any) => {
      //   console.log("Get party wise narration :", res);
        
      // })
      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)

    } else {
      if (this.partywiseNarrationEntry.value.project == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter project code.', 'info')
      }
      else if (this.partywiseNarrationEntry.value.group == '') {
        this.showErrorFieldDialog('K-Raheja ERP', 'Please enter group code.', 'info')
      }
    }
  }

  updatePartywiseNarration() {

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
      console.log('Dialog Opened');
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (this.partywiseNarrationEntry.value.project == '') {
        this.setFocus('party_project')
      }
      else if (this.partywiseNarrationEntry.value.group == '') {
        this.setFocus('party_group')
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
        this.initialMode = false,
          this.partywiseNarrationEntry.reset();
        this.setFocus('party_project');
        this.partywiseNarrationEntry.get('project')?.enable();
        this.partywiseNarrationEntry.get('group')?.enable();

        const reset = this.partywiseNarrationEntry.get('project');
        reset?.setValidators(null)
        reset?.updateValueAndValidity()

        this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
        this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
      }
    });
  }

}
