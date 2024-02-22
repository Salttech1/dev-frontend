import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-progress-entry',
  templateUrl: './project-progress-entry.component.html',
  styleUrls: ['./project-progress-entry.component.css']
})
export class ProjectProgressEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private http: HttpRequestService,
    private dialog: MatDialog
  ) { }

  projectProgressEntryForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    date: [''],
    engineer: [''],
    engineerName: [{value: '', disabled: true}],
    location: [''],
    locationName: [{value: '', disabled: true}],
    stage:[''],
    group: [''],
    groupName: [{value: '', disabled: true}],
    floor: [''],
    floorName: [{value: '', disabled: true}]
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('projectProgress_project')
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['retrieve', 'save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'exit'], this.buttonsList, false)
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
