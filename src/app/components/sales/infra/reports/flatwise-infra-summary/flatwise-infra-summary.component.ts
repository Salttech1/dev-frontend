import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { OutgauxirecgstfirstService } from 'src/app/services/sales/outgauxirecgstfirst.service';
@Component({
  selector: 'app-flatwise-infra-summary',
  templateUrl: './flatwise-infra-summary.component.html',
  styleUrls: ['./flatwise-infra-summary.component.css']
})
export class FlatwiseInfraSummaryComponent  {
  buildingSelectionsForm: FormGroup = new FormGroup({
    code: new FormControl<string[]>([], [Validators.required, Validators.maxLength(4)])
  });

  reportTypeForm:FormGroup= new FormGroup({
    flatwiserpt : new FormControl('', Validators.required),
    summaryDetailsBreakUp: new FormArray([
     this.fb.group({
        op : new FormControl("0", Validators.required),
        siteWorks : new FormControl("0", Validators.required),
        miscellaneous : new FormControl("0", Validators.required),
        gst : new FormControl("0", Validators.required)
      })
    ]),
    detailsBreakUp: new FormArray([
      this.fb.group({
        lumpsum : new FormControl('', Validators.required),
        normal: new FormControl('')
      })
    ])
  });
  //following are the getters used in the module.
  get flatwiserpt(){ return this.reportTypeForm.get('flatwiserpt') };
  get lumpsum(){ return this.reportTypeForm.controls["detailsBreakUp"].get("lumpsum")};
  get normal(){ return this.reportTypeForm.controls["detailsBreakUp"].get("normal") };
  get summaryDetailsBreakUpFormArr() : FormArray{
   return this.reportTypeForm.get('summaryDetailsBreakUp') as FormArray;
  };

  get detailsBreakUpFormArr(): FormArray {
    return this.reportTypeForm.get('detailsBreakUp') as FormArray;
   };
  //---------------------getters are over------------------

  getTheValueOfRadioBtn(): void {
    if(this.reportTypeForm.get("flatwiserpt")?.value == 'detail'){
      this.reportTypeForm.controls["summaryDetailsBreakUp"].disable();
      this.reportTypeForm.controls["detailsBreakUp"].enable();
    }
    else
    {
      this.reportTypeForm.controls["detailsBreakUp"].disable();
      this.reportTypeForm.controls["summaryDetailsBreakUp"].enable();
      this.summaryDetailsBreakUpFormArr.controls[0].get('gst')?.disable();
    }
  }

  sendTheFormData():void{
    let payload;
    if(this.reportTypeForm.controls["flatwiserpt"].value == "detail")
    {
      
      payload={
        ...this.detailsBreakUpFormArr.controls[0].value  
      }
    }
    else if(this.reportTypeForm.controls["flatwiserpt"].value == "summary")
    {
      payload={
        ...this.summaryDetailsBreakUpFormArr.controls[0].value
      }
    }   
    this.auxiCumInfraObj.fetchReportData(payload).subscribe({
      next:(res:any) =>{
        
      }

    });
  }

  constructor(private fb:FormBuilder, private auxiCumInfraObj:OutgauxirecgstfirstService) { }
}
