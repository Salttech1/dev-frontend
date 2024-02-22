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
  selector: 'app-tds-provision',
  templateUrl: './tds-provision.component.html',
  styleUrls: ['./tds-provision.component.css']
})
export class TDSProvisionComponent implements OnInit {

  tdsProvisionForm: FormGroup = this.fb.group({
    financialYear: [{ value: '', disabled: false }],
    tdsProvisionList: this.fb.array([])
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
  
    console.log("form", this.tdsProvisionForm.getRawValue());

  }
  // button action
  buttonAction(type: string) {
    console.log("form value", this.tdsProvisionForm);
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
    console.log("data",data);
    
    return this.fb.group({
      recId: [data ? data.type : ''],
      type: [data ? data.type : ''],
      runSrf: [data ? data.runSrf : ''],
      partyName: [data ? data.partyName : ''],
      provisionAmt: [data ? data.provisionAmt : ''],
      tdsAmt: [data ? data.tdsAmt : ''],
      surchg: [data ? data.surchg : ''],
      wcTax: [data ? data.wcTax : ''],
      
    });
  }

  addDetails(data?: any) {
    const formArray = this.tdsProvisionForm.get(
      'tdsProvisionList'
    ) as FormArray;
    formArray.push(this.createFormGroup(data));

    console.log("form", this.tdsProvisionForm);
    console.log("form array" , formArray);
    
    console.log("form raw value", this.tdsProvisionForm.getRawValue());
  }


  removeDetails(index: number) {
    const array = this.tdsProvisionForm
      ?.get('tdsProvisionList') as FormArray;
    array.removeAt(index);
    array.length === 0
      ? this.commonService.enableDisableButtonsByIds(
        ['add'],
        this.buttonsList,
        false
      )
      : '';
  }

  // financial year auto dash functionality added
  onInput(event: any) {
    let inputValue = event.target.value.replace(/[^0-9]/g, '');
    inputValue = inputValue.replace(/(\d{4})(\d{4})/, '$1-$2');
    this.tdsProvisionForm.patchValue({ financialYear: inputValue });
  }

  // formate year eg(2001-2003)
  formatYear(input: any) {
    let cleanedValue = input.value.replace(/\D/g, '');
    cleanedValue = cleanedValue.replace(/(.{4})/, '$1-');
    cleanedValue = cleanedValue.slice(0, 9);
    input.value = cleanedValue;
  }

}
