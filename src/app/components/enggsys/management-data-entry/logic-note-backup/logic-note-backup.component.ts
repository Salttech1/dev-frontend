import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-logic-note-backup',
  templateUrl: './logic-note-backup.component.html',
  styleUrls: ['./logic-note-backup.component.css']
})
export class LogicNoteBackupComponent implements OnInit {

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

  logicNoteBackupForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    racno: ['', Validators.required],
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('otherDebit_project')
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['save', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {

    }
    if (event == 'retrieve') {

    }
    if (event == 'save') {
      this.saveOtherDebitBreakup();
    }
    if (event == 'back') {

    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  saveOtherDebitBreakup(){

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
      if (this.logicNoteBackupForm.value.project == '') {
        this.setFocus('otherDebit_project')
      }
      else if (this.logicNoteBackupForm.value.racno == '') {
        this.setFocus('otherDebit_racno')
      }
    });
  }

}
