import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nongst-certificate-entry',
  templateUrl: './nongst-certificate-entry.component.html',
  styleUrls: ['./nongst-certificate-entry.component.css']
})
export class NongstCertificateEntryComponent implements OnInit {
  qf!: FormGroup;
  loaderToggle: Boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.qf = this.fb.group({
      rec: '',
    });
  }

}
