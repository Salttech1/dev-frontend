import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {

  @Input() type:string = 'submit';
  @Input() getSaveDataAction:any
  @Input() getSavedAPIUrl:any
  @Input() storedReterievedFormData:any
  @Input() savedfgFlagCheck:any
  public disabledFlag!:boolean;
  constructor(private actionApiService:ActionservicesService,private toastr:ToasterapiService) { }

  ngOnInit(): void {
    this.actionApiService.isSaveActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

  save(apiAppend:any,data:any,reterivedDta:any){
    console.log("yyyy",reterivedDta)
    this.actionApiService.getReterieveClickedFlagUpdatedValue(false)
    this.actionApiService.getIsResetClickedFlagUpdateValue(false)
    this.actionApiService.getIsSaveClickedFlagUpdateValue(true)
    console.log(this.savedfgFlagCheck)
    if(this.savedfgFlagCheck){
      this.actionApiService.savedService(apiAppend,data,reterivedDta)
    }
    else{
      //this.toastr.showError("please fill all mandatory fields")
      this.actionApiService.sendSaveValidationClick();
    }
  
  }

}
