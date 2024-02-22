import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-multiple-linking',
  templateUrl: './multiple-linking.component.html',
  styleUrls: ['./multiple-linking.component.css']
})
export class MultipleLinkingComponent implements OnInit {


  multiLinkingForm: FormGroup = this.fb.group({
    certificateNo: [{ value: '', disabled: false }],
    certificateDetails: this.fb.array([])
  })

  // hide & show buttons
  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds([
    'retrieve',
    'save',
    'back',
    'exit',
  ]);
  config = {
    isLoading: false,
    isRetrive: false
  }

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private http: HttpRequestService,
    private commonService: CommonService,
    private router: Router,
    private dailog: MatDialog,
    private service: ServiceService,
    private modalService: ModalService,) { }

  ngOnInit(): void {
    this.addDetails()
    this.addDetails()

    console.log("form", this.multiLinkingForm.getRawValue());

  }
  // button action
  buttonAction(type: string) {
    console.log("form value", this.multiLinkingForm);
    console.log("event", type);
    if (type == 'retrieve') {
      this.config.isRetrive = true
    } else if (type == 'back') {
      this.config.isRetrive = false
    }
  }


  ////////////////////////////////////
  // form array
  ////////////////////////////////////
  createFormGroup(data?: any): FormGroup | any {
    return this.fb.group({
      type: [data ? data.type : ''],
      certNo: [data ? data.certNo : ''],
      remarks: [data ? data.remarks : ''],
    });
  }

  addDetails(data?: any) {
    const formArray = this.multiLinkingForm.get(
      'certificateDetails'
    ) as FormArray;
    formArray.push(this.createFormGroup(data));
  }


  removeDetails(index: number) {
    const array = this.multiLinkingForm
      ?.get('certificateDetails') as FormArray;
    array.removeAt(index);
    array.length === 0
      ? this.commonService.enableDisableButtonsByIds(
        ['add'],
        this.buttonsList,
        false
      )
      : '';
  }




}
