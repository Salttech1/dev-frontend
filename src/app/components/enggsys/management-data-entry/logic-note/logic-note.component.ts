import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-logic-note',
  templateUrl: './logic-note.component.html',
  styleUrls: ['./logic-note.component.css']
})
export class LogicNoteComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  config: any = {
    getFilterParty: "ent_id in('E','S','U')"
  }

  filters = {
    getPartyCode: ''
  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  logicNoteForm: FormGroup = this.fb.group({
    project: ['SHRV', Validators.required],
    racno: [''],
    racnoDesc: [{ value: '', disabled: true }],
    tenderCode: ['', Validators.required],
    yn: [''],
    copyLogicNote: [''],

    date: [''],
    revision: [''],
    task: [''],
    location: [''],
    packageName: [''],
    importUnder: [''],

    scopeOfWork: [''],
    commercialDesc1: [''],
    commercialDesc2: [''],
    finalConsideration: [''],
    techDesc: [''],
    justification: [''],
    deliverySchedule: [''],
    warrantyInfo: [''],
    resourceAllocation: [''],
    tendorNarrative: [''],
    impSpecification: [''],

    partyType: [''],
    partyCode: [''],
    vendorName: [''],
    brand: [''],
    yesNo: [''],
    grpLogicNote: [''],
    currType: [''],
    currRate: [''],
    currAmt: [''],
    quoteDate: [''],
    orderDate: [''],
    deliveryDate: [''],
    deliveryWeek: [''],
    address: [''],
    workCodeAmt: [''],

    code: [''],
    commiteeName: [''],

    addLogicNoteList: this.fb.array([]),
  })

  createLogicNote(): FormGroup | any {
    return this.fb.group({
      certType:[''],
      certCode: [''],
      subGroup: [''],
      groupCode:[''],
      amt:[''],
    })
  }

  logicNoteAdd(){
    const addArray = this.logicNoteForm.get('addLogicNoteList') as FormArray
    addArray.push(this.createLogicNote())
  }

  ngOnInit(): void {
    this.init();
    this.setFocus('logicNote_project');
    this.logicNoteAdd();
  }

  init() {
    this.commonService.enableDisableButtonsByIds(['save', 'back'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: String) {
    if (event == 'add') {
      this.addLogicNote();
    }
    if (event == 'retrieve') {
      this.fetchLogicNote();
    }
    if (event == 'save') {
      this.saveLogicNote();
    }
    if (event == 'back') {
      this.goBack();
    }
    if (event == 'exit') {
      this.router.navigateByUrl('/dashboard')
    }
  }

  addLogicNote() {

  }


  fetchLogicNote() {

  }

  saveLogicNote() {

  }

  goBack() {

  }

  onLeavePartyType(val: String) {
    this.filters.getPartyCode = "" + val + "'";
    console.log('get party code :', this.filters.getPartyCode);

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
