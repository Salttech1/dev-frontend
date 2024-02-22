import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  @Input() getAddChkAPI!:boolean
  @Input() paramsPassed!:HttpParams
  @Input() addValidationFormGroup!:FormControl
  @Input() getValidationFormGroup!:FormGroup
  @Input() screenName!: string
  @Output() resetErrorContainField=new EventEmitter()

  disabledFlag!:Boolean
  constructor(private acrionService:ActionservicesService,private toastr:ToasterapiService) {

   }

  ngOnInit(): void {
  }

  ngOnChanges(){
    this.acrionService.isAddActionFlag.subscribe((res:any)=>{
      this.disabledFlag = res
    })

  }

  add(){
    if(this.addValidationFormGroup?.valid){
      this.acrionService.addApiCall(this.getAddChkAPI,this.paramsPassed).subscribe((res:any)=>{
        if(!res.status){
          this.toastr.showError(res.message)
          this.resetErrorContainField.emit()
          //this.getValidationFormGroup.reset()
        }
        
      else{
        this.getValidationFormGroup.disable()
        this.acrionService.commonFlagCheck(true,true,true,true,true,false,false,false,true,true,true)

       // this.acrionService.getAddFlagUpdatedValue(true)
      // this.acrionService.getIsReteriveActionFlag(false)
    //   this.acrionService.getIsAddActionFlag(true)
      //  this.acrionService.getIsNewDepositFlag(true)
      //  this.acrionService.getisPrintActionFlag(true)
        this.acrionService.getisTabContentDataFlag(true)
        this.acrionService.getReterieveClickedFlagUpdatedValue(false)
        this.acrionService.getAddFlagUpdatedValue(true)

      //  this.acrionService.getBackActionFlag(false)
      //  this.acrionService.getSaveActionFlag(false)
      //  this.acrionService.getResetActionFlag(false)
      //  this.acrionService.getExportActionFlag(true)
      }
    })
    // this.acrionService.getReterieveClickedFlagUpdatedValue(false)
    // this.acrionService.getAddFlagUpdatedValue(true)
  }
  if(!this.addValidationFormGroup?.valid){
    this.addValidationFormGroup.markAllAsTouched()
  }
}

}

