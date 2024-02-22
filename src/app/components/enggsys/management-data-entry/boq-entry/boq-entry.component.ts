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
  selector: 'app-boq-entry',
  templateUrl: './boq-entry.component.html',
  styleUrls: ['./boq-entry.component.css']
})
export class BoqEntryComponent implements OnInit {

  buttonsList: Array<buttonsList> = this.commonService.getButtonsByIds(['add', 'retrieve', 'save', 'back', 'exit'])

  filters: any = {
    getRacNo : ''
  }

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private http: HttpRequestService,
    private renderer: Renderer2
  ) { }

  boqEntryForm: FormGroup = this.fb.group({
    project: ['', Validators.required],
    racno: ['', Validators.required],
    rate: [''],
    desc1: [''],
    location: [''],
    revision: [{value: '', disabled: true}],
    shortName: [''],
    description: ['']
  })

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.commonService.enableDisableButtonsByIds(['save'], this.buttonsList, true)
    this.commonService.enableDisableButtonsByIds(['add', 'retrieve', 'back', 'exit'], this.buttonsList, false)
  }

  buttonAction(event: string){
    if (event == '') {
      
    }
  }

  onLeaveProject(val: string){
    this.filters.getRacNo = "mclh_projcode='" + val + "'";
  }
}
