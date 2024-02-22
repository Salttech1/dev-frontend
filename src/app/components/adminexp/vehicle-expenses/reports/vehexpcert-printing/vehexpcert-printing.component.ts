import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { merge, take } from 'rxjs';
import { CommonReportsService } from 'src/app/services/reports.service';
import { ServiceService } from 'src/app/services/service.service';
import { maxPartyLength } from 'src/constants/commonconstant';


@Component({
  selector: 'app-vehexpcert-printing',
  templateUrl: './vehexpcert-printing.component.html',
  styleUrls: ['./vehexpcert-printing.component.css']
})
export class VehexpcertPrintingComponent implements OnInit {
  formname!: any;
  partyConditon = ` par_partytype = 'Z'`;
  certTypeCondition = '';
  loaderToggle: boolean = false;

  VehCertPrint: FormGroup = new FormGroup({
    isPrint: new FormControl(false),
    seqId: new FormControl(1),
    conditionId: new FormControl(1),
    TxtCompany: new FormControl<String>(''),
    TxtPartyCode: new FormControl<String>(''),
    RbCertType: new FormControl<String>('Passed'),
    CbxPrinted: new FormControl(false),
    TxtCertFrom: new FormControl<String>('',Validators.required),
    TxtCertUpto: new FormControl<String>('',Validators.required),
    
    // name: new FormControl<string>('', Validators.required),
    
  });
  constructor(
    private commonReportService: CommonReportsService,
    private router: Router,
    private _service: ServiceService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    setTimeout(function() {
      document.getElementById("TxtCompany")?.focus();
   }, 100);
    this.certTypeCondition = `('ALL' IN ('${
      this.VehCertPrint
      ?.get('TxtCompany')?.value ? this.VehCertPrint
      ?.get('TxtCompany')?.value[0][0].trim() : "ALL"}') OR admh_coy IN  ('${
        this.VehCertPrint
      ?.get('TxtCompany')?.value ? this.VehCertPrint
      ?.get('TxtCompany')?.value[0][0].trim() : "ALL"}') ) and  ('ALL' IN ('${
        this.VehCertPrint
        ?.get('TxtPartyCode')?.value ? this.VehCertPrint
          ?.get('TxtPartyCode')?.value?.[0][0].trim() : "ALL"}') OR admh_partycode IN  ('${
            this.VehCertPrint
      ?.get('TxtPartyCode')?.value ? this.VehCertPrint
        ?.get('TxtPartyCode')?.value?.[0][0].trim() : "ALL"}') )  and admh_passedon is not null` ;
        console.log("Intititr", this.certTypeCondition)
    this.setCertTypeCondition();
    this.updateCertUpto();
  }

  setCertTypeCondition() {
 
    let certFrom = this.VehCertPrint
      ?.get('TxtCertFrom');
    let certTo = this.VehCertPrint
      ?.get('TxtCertUpto');
      merge(
        this.VehCertPrint?.get('TxtCompany')!.valueChanges,
        this.VehCertPrint?.get('TxtPartyCode')!.valueChanges,
        this.VehCertPrint?.get('RbCertType')!.valueChanges
   ).subscribe((val: any) => {
    let certType = this.VehCertPrint?.get('RbCertType')?.value
      let coy = this.VehCertPrint
      ?.get('TxtCompany')?.value ? this.VehCertPrint
      ?.get('TxtCompany')?.value[0][0].trim() : "ALL";
      console.log("paod", this.VehCertPrint
      ?.get('TxtPartyCode')?.value)
      let party = this.VehCertPrint
      ?.get('TxtPartyCode')?.value ? this.VehCertPrint
        ?.get('TxtPartyCode')?.value?.[0][0].trim() : "ALL";
      certFrom?.setValue(null);
      certTo?.setValue(null);
      console.log("Value: ", val)
      let passedCondition = certType == 'Passed' ? `not null` : `null`
      this.certTypeCondition = `('ALL' IN ('${
        coy}') OR admh_coy IN  ('${
          coy}') ) and  ('ALL' IN ('${
            party}') OR admh_partycode IN  ('${
              party}') )  and admh_passedon is ${passedCondition}` ;
    });
  }


  updateCertUpto() {
    this.VehCertPrint.get('TxtCertFrom')?.valueChanges.subscribe((val: any) => {
      let af = this.VehCertPrint.get('TxtCertFrom')?.value;
      console.log(val);
      if (val) [
        val instanceof Object && this.VehCertPrint.get('TxtCertUpto')?.setValue(af)
      ]
      else {
        this.VehCertPrint.get('TxtCertUpto')?.setValue(null)
      }
    })
  }


  enableFields(event: any) {
    event.target.checked ? this.edFields(false) : this.edFields(true);
  }

    edFields(enableFlag: any) {
      let fields = ['TxtCertFrom', 'TxtCertUpto']
      if (enableFlag) {
        fields.forEach((val) => { this.VehCertPrint.get(val)?.reset(), this.VehCertPrint.get(val)?.enable() })
      }
      else {
        fields.forEach((val) => { this.VehCertPrint.get(val)?.reset(), this.VehCertPrint.get(val)?.disable() })
      }
    }
  
  
  getReport(print: boolean){
    if(this.VehCertPrint?.valid){
      let reportPayload = {
        name: 'VehExpCertPrinting_Java.rpt',
        seqId: this.VehCertPrint?.get('RbCertType')?.value == 'Passed' ? 2 :1,
        isPrint: false,
        reportParameters:{
          Coy: this.VehCertPrint
          ?.get('TxtCompany')?.value ? this.VehCertPrint
          ?.get('TxtCompany')?.value[0][0].trim() : "ALL",
          PartyCode:  this.VehCertPrint
          ?.get('TxtPartyCode')?.value ? this.VehCertPrint
            ?.get('TxtPartyCode')?.value?.[0][0].trim() : "ALL",
          CertNumFrom : this.VehCertPrint
          ?.get('TxtCertFrom')?.value[0][0].trim(),
          CertNumUpTo : this.VehCertPrint
          ?.get('TxtCertUpto')?.value[0][0].trim()
        }
      }
      console.log("Payload:", reportPayload)
      this.loaderToggle = true;
      this.commonReportService.getParameterizedReportWithCondition(reportPayload).pipe(take(1)).subscribe({
        next: (res: any) => {
          if (res?.type == 'application/json') {
            this.toastr.error('No Records Found')
          }
          else {
            let pdf = new Blob([res], { type: "application/pdf" });
            let filename = this.commonReportService.getReportName();
            if (print) {
              const blobUrl = URL.createObjectURL(pdf);
              const oWindow = window.open(blobUrl, '_blank');
              oWindow?.print();
            } else {
              fileSaver.saveAs(pdf, filename);
            }
          }
        },
        error: (err: any) => {
          this.loaderToggle = false
          console.log(err, "err");
        },
        complete: () => {
          this.loaderToggle = false
        }
      });
    } else {
      this.toastr.error('Please fill the form properly');
      this.VehCertPrint?.markAllAsTouched();
    }


  }

  handleExitClick(){
    this.router.navigate(['/dashboard']);
  }
}
