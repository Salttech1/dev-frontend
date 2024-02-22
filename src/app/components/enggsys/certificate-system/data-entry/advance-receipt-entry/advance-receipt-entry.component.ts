import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { ModalService } from 'src/app/services/modalservice.service';
import { ServiceService } from 'src/app/services/service.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-advance-receipt-entry',
  templateUrl: './advance-receipt-entry.component.html',
  styleUrls: ['./advance-receipt-entry.component.css']
})
export class AdvanceReceiptEntryComponent implements OnInit {
  receiptTypes = [
    { name: 'Certificate', id: 'certificate' },
    { name: 'Authorisation', id: 'auth' },
  ];

  advanceReceiptForm: FormGroup = this.fb.group({
    receiptFor: [{ value: 'certificate', disabled: false }],
    recId: [{ value: '', disabled: true }],
    company: [{ value: '', disabled: true }],
    party: [{ value: '', disabled: true }],
    building: [{ value: '', disabled: true }],
    matCertCode: [{ value: '', disabled: true }],
    certNo: [{ value: '', disabled: true }],
    receiptVoucherNo: [{ value: '', disabled: true }],
    receiptVoucherDate: [{ value: '', disabled: true }],
    advanceAmt: [{ value: '', disabled: true }],
    cgstAmt: [{ value: '', disabled: true }],
    sgstAmt: [{ value: '', disabled: true }],
    igstAmt: [{ value: '', disabled: true }],
    ugstAmt: [{ value: '', disabled: true }],
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
  }

  
  // button action
  buttonAction(type: string) {
    console.log("form value", this.advanceReceiptForm);
    console.log("event", type);

    if (type == 'retrieve') {
      this.config.isRetrive = true

    } else if (type == 'back') {

      this.config.isRetrive = false
    }

  }


}
