import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { api_url } from 'src/constants/constant';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';



@Component({
  selector: 'app-group-logic-note',
  templateUrl: './group-logic-note.component.html',
  styleUrls: ['./group-logic-note.component.css']
})
export class GroupLogicNoteComponent implements OnInit {
  initialMode: boolean = false;

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  groupLogicNote: FormGroup = this.fb.group({
    project: ['', Validators.required],
    projectName: [{value: '', disabled: true}],
    grouprac: ['', Validators.required],
    groupracName: [{value: '', disabled: true}],
    date: [''],
    desc: [''],
    scopeOfWork: [''],
    technicalDesc: [''],
    justification: ['']
  })

  ngOnInit(): void {
    this.init();
    this.setFocus('logicNote_project')
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String){
    if (event == 'add') {
      this.addLogicNote();
    }
    if (event == 'retrieve') {
      this.fetchLogicNote();      
    }
    if (event == 'save') {
      this.updateLogicNote();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  addLogicNote(){
    if (this.groupLogicNote.value.project != '') {
      this.initialMode = true
      this.groupLogicNote.get('grouprac')?.disable();
      let payload = {}

      // this.http.request('post', api_url., payload, null).subscribe((res: any) => {

      // })
      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    }
    else{
      if (this.groupLogicNote.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', "Please enter project code.", 'info');
      }
    }
  }

  fetchLogicNote(){
    if (this.groupLogicNote.value.project != '' && this.groupLogicNote.value.grouprac != '') {
      this.initialMode = true;

      // this.http.request('get', api_url. , null, null).subscribe((res: any) => {

      // })
      this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, true)
      this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, false)
    }
    else{
      if (this.groupLogicNote.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter project code.', 'info')
      }
      else if (this.groupLogicNote.value.grouprac == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter group rac code.', 'info')
      }
    }
  }

  updateLogicNote(){}

  goBack(){
    this.initialMode = false;
    this.groupLogicNote.reset();
    this.setFocus('project');
    this.groupLogicNote.get('grouprac')?.enable();

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
      if (this.groupLogicNote.value.project == '') {
        this.setFocus('logicNote_project')
      }
      else if (this.groupLogicNote.value.grouprac == '') {
        this.setFocus('logicNote_rac')
      }
    });
  }

}
