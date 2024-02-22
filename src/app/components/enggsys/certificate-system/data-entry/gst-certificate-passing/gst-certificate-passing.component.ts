import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gst-certificate-passing',
  templateUrl: './gst-certificate-passing.component.html',
  styleUrls: ['./gst-certificate-passing.component.css']
})
export class GstCertificatePassingComponent implements OnInit {
  loader:boolean=false
  actionBtn = [false,true,true,true,true] // retrieve,add cheque,confirm,save,back
  qf!:FormGroup
  certSubQ = `cert_origsite = (SELECT ent_id FROM entity WHERE ent_class = 'SITE' AND ent_char1 = 'CURR')`
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.qf = this.fb.group({
      certNo:['',Validators.required]
    })
  }
  retrieve(){

  }
  save(){

  }
  back(){

  }
  addCheque(){

  }
  confirm(e:any){

  }
}
