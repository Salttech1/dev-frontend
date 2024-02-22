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
  selector: 'app-other-debits-breakup-entry',
  templateUrl: './other-debits-breakup-entry.component.html',
  styleUrls: ['./other-debits-breakup-entry.component.css']
})
export class OtherDebitsBreakupEntryComponent implements OnInit {
  initialMode: boolean = false;

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  filters: any = {
    getracno: ''
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

  otherDebitBreakupForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    projectName: [{ value: '', disabled: true }],
    racno: ['', Validators.required],
    racnoName: [{ value: '', disabled: true }],

    addOtherDebitBreakupEntryList: this.fb.array([])
  })

  createOtherDebitEntry(): FormGroup | any {
    return this.fb.group({
      partyType: [''],
      partyCode: [''],
      partyName: [''],
      othDebitReason: [''],
      othDebitAmt: [''],
      cvAdj: ['']
    })
  }

  addOtherDebit() {
    const array = this.otherDebitBreakupForm.get('addOtherDebitBreakupEntryList') as FormArray;
    array.push(this.createOtherDebitEntry())
  }

  deleteOtherDebit(index: number) {
    const deleteRow = this.otherDebitBreakupForm.get('addOtherDebitBreakupEntryList') as FormArray;
    deleteRow.removeAt(this.createOtherDebitEntry())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('otherDebit_project');
    this.addOtherDebit()
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {
      this.addOtherDebitBreakup();
    }
    if (event == 'retrieve') {
      this.fetchOtherDebitBreakup();
    }
    if (event == 'save') {
      this.saveOtherDebitBreakup();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  addOtherDebitBreakup() {
    if (this.otherDebitBreakupForm.value.project != '' && this.otherDebitBreakupForm.value.racno != '') {
      this.setFocus('otherDebit_partyType')
      this.initialMode = true;

      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    } else {
      if (this.otherDebitBreakupForm.value.project == '') {
        this.showErrorDialog("K-Raheja ERP", "Please enter project code.", "info")
      }
      else if (this.otherDebitBreakupForm.value.racno == '') {
        this.showErrorDialog("K-Raheja ERP", "Please enter rac no.", "info")
      }
    }
  }

  fetchOtherDebitBreakup() {
    if (this.otherDebitBreakupForm.value.project != '' && this.otherDebitBreakupForm.value.racno != '') {
      this.setFocus('otherDebit_partyType')
      this.initialMode = true;

      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    } else {
      if (this.otherDebitBreakupForm.value.project == '') {
        this.showErrorDialog("K-Raheja ERP", "Please enter project code.", "info")
      }
      else if (this.otherDebitBreakupForm.value.racno == '') {
        this.showErrorDialog("K-Raheja ERP", "Please enter rac no.", "info")
      }
    }
  }

  saveOtherDebitBreakup() {

  }

  goBack() {
    this.initialMode = false;
    this.otherDebitBreakupForm.reset();
    this.otherDebitBreakupForm.enable();
    this.otherDebitBreakupForm.get('projectName')?.disable();
    this.otherDebitBreakupForm.get('racnoName')?.disable();
    this.setFocus('otherDebit_project')

    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
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
      if (this.otherDebitBreakupForm.value.project == '') {
        this.setFocus('otherDebit_project')
      }
      else if (this.otherDebitBreakupForm.value.racno == '') {
        this.setFocus('otherDebit_racno')
      }
    });
  }


}
