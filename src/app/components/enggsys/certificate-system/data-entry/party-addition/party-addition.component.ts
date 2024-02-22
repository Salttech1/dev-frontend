import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';

@Component({
  selector: 'app-party-addition',
  templateUrl: './party-addition.component.html',
  styleUrls: ['./party-addition.component.css']
})
export class PartyAdditionComponent implements OnInit {


  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  config = {
    quoteParty: [
      { id: 'M', name: 'Manufacturing' },
      { id: 'S', name: 'Service' },
      { id: 'B', name: 'Both' }
    ]
  }
  mailaddressFetchData: any;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpRequestService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  PartyEntryForm: FormGroup = this.fb.group({
    party:this.fb.group({
      partyType: ['', Validators.required],
      partyTypeName: [{ value: '', disabled: true }],
      partyCode: ['', Validators.required],
    }),
    partyDetails: this.fb.group({
      NamePrefix: ['',Validators.required],
      name: ['',Validators.required],
      partyConstitution: ['',Validators.required],
      supplierType: [''],
      supplierTypeName: [''],
      city: [''],
      pan: ['',Validators.required],
      ltdCompany: [''],
      openDate: [''],
      gstNo: [''],
      validParty: [''],
      validMinor: [''],
      tanNo: [''],
      msmeNo: [''],
      profTaxNo: [''],
      payeeBank1: [''],
      pfNo: [''],
      payeeBranch1: [''],
      esicNo: [''],
      payeeAcNum1: [''],
      srvTaxReg: [''],
      payeeIFSC: [''],
      partyVatNum: [''],
      fromDate: [''],
      payeeBank2: [''],
      partyTinNum: [''],
      PayeeBranch2: [''],
      cin: [''],
      payeeAcNum2: [''],
      adhareNo: [''],
      payeeIFSC2: [''],
      salesTaxCentral: [''],
      rc: [''],
      salesTaxState: ['']
    }),
    contact: this.fb.group({
      headContactPerson: [],
      headContactNo: [],
      cordinator1: [],
      cordinator2: [],
      cordinator1No: [],
      cordinator2No: [],
      brnad: []
    }),
    msmeDetails: this.fb.group({
      type: [],
      msmeList: this.fb.array([])
    })
  })

  // initilise msmeList array form strucute
  createMSMEForm(data?: any) {
    return this.fb.group({
      enterpriseType: [],
      enterpriseTypeName: [],
      registerationNo: [],
      commencementDate: [],
      endDate: []
    })
  }

  // get address data from event
  getAddressData(event:any)
  {
    console.log(
      "evemnt",event
    );

  }

  ngOnInit(): void {
    this.init();
  }

  init() {

  }

  buttonAction(event: String) {
    if (event == '') {

    }
  }


}
