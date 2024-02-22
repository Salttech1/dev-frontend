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
  selector: 'app-party-info-entry',
  templateUrl: './party-info-entry.component.html',
  styleUrls: ['./party-info-entry.component.css']
})
export class PartyInfoEntryComponent implements OnInit {
  initialMode: boolean = false
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['retrieve', 'save', 'back', 'exit'])

  config = {
    partyType: [
      {id: 'L', name: 'Labour'},
      {id: 'M', name: 'Material'}
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

  partyInfoEntry: FormGroup = this.fb.group({
    partyType: ['L',Validators.required],
    project: ['', Validators.required],
    projectName: [{value: '', disabled: true}],
    group: ['', Validators.required],
    groupName: [{value: '', disabled: true}],

    addPartyInfoEntryList: this.fb.array([])
  })

  createPartyInfoEntry(): FormGroup |any {
    return this.fb.group({
      matCertCode: [''],
      matCertName: [''],
      partyCode: [''],
      partyName: [''],
      brand: [''],
      address: ['']
    })
  }

  addParty(){
    const array = this.partyInfoEntry.get('addPartyInfoEntryList') as FormArray;
    array.push(this.createPartyInfoEntry())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('partyInfo_project')
    this.addParty();
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String){
    if (event == 'retrieve') {
      this.fetchPartyInfoEntry();
    }
    if (event == 'save') {
      this.savePartyInfoEntry();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  fetchPartyInfoEntry(){
    if (this.partyInfoEntry.value.project != '' && this.partyInfoEntry.value.group != '') {
      this.initialMode = true

    } else {
      if (this.partyInfoEntry.value.project == '') {
        this.showErrorDialog('K-Raheja ERP', 'Please enter project code.','info')
      }
      else if(this.partyInfoEntry.value.group == ''){
        this.showErrorDialog('K-Raheja ERP', 'Please enter group code.','info')
      }
    }
  }

  savePartyInfoEntry(){

  }

  goBack(){

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
     if (this.partyInfoEntry.value.project == '') {
      this.setFocus('partyInfo_project')
     }
     else if (this.partyInfoEntry.value.group == '') {
      this.setFocus('partyInfo_group')
     }
    });
  }

}
