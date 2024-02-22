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
  selector: 'app-logic-note-addtional-information',
  templateUrl: './logic-note-addtional-information.component.html',
  styleUrls: ['./logic-note-addtional-information.component.css']
})
export class LogicNoteAddtionalInformationComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['process', 'retrieve', 'save', 'back', 'exit'])

  filters: any = {
    getracno: ''
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

  logicNoteAdditionalInformationForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    racno: ['', Validators.required],
    racnoDesc: [{value: '', disabled: true}],
    file: ['', Validators.required],
    fileDesc: ['']
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('logicNote_project')
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['process', 'retrieve', 'save', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {

    }
    if (event == 'retrieve') {

    }
    if (event == 'save') {

    }
    if (event == 'back') {

    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard');
    }
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

}
