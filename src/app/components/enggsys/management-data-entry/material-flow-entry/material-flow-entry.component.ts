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
  selector: 'app-material-flow-entry',
  templateUrl: './material-flow-entry.component.html',
  styleUrls: ['./material-flow-entry.component.css']
})
export class MaterialFlowEntryComponent implements OnInit {
  initialMode: boolean = false

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['retrieve', 'save', 'back', 'exit'])

  config = {
    partyType: [
      { id: 'L', name: 'Labour' },
      { id: 'M', name: 'Material' }
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

  materialFlowEntryForm: FormGroup = this.fb.group({
    partyType: ['L', Validators.required],
    project: ['', Validators.required],
    projectName: [{ value: '', disabled: true }],
    group: ['', Validators.required],
    groupName: [{ value: '', disabled: true }],

    addMaterialFlowEntryList: this.fb.array([])
  })

  createMaterialFlowEntry(): FormGroup | any {
    return this.fb.group({
      materialWorkCode: [''],
      partyCode: [''],
      requiredQuantity: [''],
      quotesReceived: [''],
      quotesFloated: [''],
      workOrderDate: [''],
      epcgLincenseNo: [''],
      epcgLincenseDate: [''],
      bankGuaranteeExpiryDate: [''],
      finalSampleRecdDate: [''],
      ctrlRoomDelvyDate: [''],
      finalDeliveryDate: [''],
      remarks: ['']
    })
  }

  addParty() {
    const array = this.materialFlowEntryForm.get('addMaterialFlowEntryList') as FormArray;
    array.push(this.createMaterialFlowEntry())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('materialFlow_project')
    this.addParty();
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'retrieve') {
      this.fetchMaterialFlowEntry();
    }
    if (event == 'save') {
      this.saveMaterialFlowEntry();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  fetchMaterialFlowEntry() {
    if (this.materialFlowEntryForm.value.project != '' && this.materialFlowEntryForm.value.group != '') {
      this.initialMode = true


    } else {
      if (this.materialFlowEntryForm.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', "Please enter project code.", 'info')
      }
      else if (this.materialFlowEntryForm.value.group == '') {
        this.showErrorDialog('K-Raheja ERP', "Please enter group code.", 'info')
      }
    }
  }

  saveMaterialFlowEntry() { }

  goBack() {

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
      if (this.materialFlowEntryForm.value.project == '') {
        this.setFocus('materialFlow_project')
      }
      else if (this.materialFlowEntryForm.value.group == '') {
        this.setFocus('materialFlow_group')
      }
    });
  }

}
