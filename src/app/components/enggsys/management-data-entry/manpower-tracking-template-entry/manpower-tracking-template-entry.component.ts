import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-manpower-tracking-template-entry',
  templateUrl: './manpower-tracking-template-entry.component.html',
  styleUrls: ['./manpower-tracking-template-entry.component.css']
})
export class ManpowerTrackingTemplateEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  manpowerTrackingTemplateEntryForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    projectName: [{value: '', disabled: true}],
    groupCode: ['', Validators.required],
    groupCodeName: [{value: '', disabled: true}]
  })

  ngOnInit(): void {
    this.init()
    this.setFocus('manpower_project')
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['add', 'save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String){
    if (event == 'add') {
      
    }
    if (event == 'retrieve') {
      
    }
    if (event == 'save') {
      
    }
    if (event == 'back') {
      
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
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

}
