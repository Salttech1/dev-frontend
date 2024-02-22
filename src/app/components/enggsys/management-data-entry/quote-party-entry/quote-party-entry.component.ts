import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { buttonsList } from 'src/app/shared/interface/common';
import { ModalComponent } from 'src/app/shared/generic/modal/modal.component';

@Component({
  selector: 'app-quote-party-entry',
  templateUrl: './quote-party-entry.component.html',
  styleUrls: ['./quote-party-entry.component.css']
})
export class QuotePartyEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  config = {
    quoteParty: [
      {id: 'M', name: 'Manufacturing'},
      {id: 'S', name: 'Service'},
      {id: 'B', name: 'Both'}
    ]
  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpRequestService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  quotePartyEntryForm: FormGroup = this.fb.group({
    partyType: ['', Validators.required],
    partyTypeName:[{value: '', disabled: true}],
    partyCode: ['', Validators.required],
    name: ['']
  })

  ngOnInit(): void {
    this.init();
  }

  init(){

  }

  buttonAction(event: String){
    if (event == '') {
      
    }
  }

}
