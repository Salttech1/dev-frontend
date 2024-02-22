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
  selector: 'app-mep-progress-entry',
  templateUrl: './mep-progress-entry.component.html',
  styleUrls: ['./mep-progress-entry.component.css']
})
export class MepProgressEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonservice.getButtonsByIds(['add', 'save', 'back', 'exit'])

  constructor(
    private commonservice: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  mepProgressForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    stage: ['', Validators.required]
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('mepProgress_project')
  }

  init(){
    this.commonservice.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonservice.enableDisableButtonsByIds(['add', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String){

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
    });
  }

}
