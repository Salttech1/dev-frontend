import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';
import { busttonsList } from 'src/constants/commonconstant';

@Component({
  selector: 'app-boq-summary-details',
  templateUrl: './boq-summary-details.component.html',
  styleUrls: ['./boq-summary-details.component.css']
})
export class BoqSummaryDetailsComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  filters: any = {
    getBOQNo: ''
  }

  constructor(
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  boqSummaryDetailsForm: FormGroup = this.fb.group({
    project: [''],
    boqno: [''],
    racno: [''],
    vendor: [''],

    addBOQSummaryList: this.fb.array([])
  })

  createBOQSummaryDetails(): FormGroup | any {
    return this.fb.group({
      srno: [''],
      itemCode: [''],
      product: ['']
    })
  }


  addBOQ() {
    const addArray = this.boqSummaryDetailsForm.get('addBOQSummaryList') as FormArray;
    addArray.push(this.createBOQSummaryDetails())
  }

  deleteBOQ(index: number) {
    const deleteArray = this.boqSummaryDetailsForm.get('addBOQSummaryList') as FormArray;
    deleteArray.removeAt(this.createBOQSummaryDetails())
  }

  ngOnInit(): void {
    this.init();
    this.addBOQ();
  }

  init() {
    this.commonService.enableDisableButtonsByIds([], busttonsList, true)
    this.commonService.enableDisableButtonsByIds([], busttonsList, false)
  }

  buttonAction(event: String) {
    if (event == '') {

    }
    if (event == '') {

    }
    if (event == '') {

    }
    if (event == '') {

    }
    if (event == '') {

    }
  }

  onLeaveProject(val: string) {
    this.filters.getBOQNo = "mcbh_projcode='" + val + "'"
  }

}
