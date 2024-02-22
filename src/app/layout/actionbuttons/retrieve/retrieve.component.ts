import { Component, Input,Output, OnInit, EventEmitter } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.component.html',
  styleUrls: ['./retrieve.component.css']
})
export class RetrieveComponent implements OnInit {
  @Input() getRetrieveFormData!:FormData
  @Input() getRetrieveAPI!:string
  @Input() getRetrievePostBody:any
  @Input() apiMethodChk!:string
  @Output() sendRetrievedData= new EventEmitter()

  disabledFlag!:boolean
  constructor(private actionService:ActionservicesService,private toastr:ToasterapiService,private http:HttpClient) {
    this.actionService.isReteriveActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
   }

  ngOnInit(): void {
  
  }

  retrieveResponse(res:any,reterieveData:any){
    console.log(reterieveData)
    if(res.status == true) {
   //   debugger
      console.log(res)
      this.actionService.getisTabContentDataFlag(true)
       this.sendRetrievedData.emit(res.data)
       console.log("sendRetrievedData",res.data)
       this.actionService.getReterieveClickedFlagUpdatedValue(true)
       this.actionService.getAddFlagUpdatedValue(false)
       this.actionService.commonFlagCheck(true,true,true,true,true,false,false,true,true,true,true)
       reterieveData.disable()
     }
     if(res.status == false){
       this.toastr.showError(res.message)
     }
  }


  retrieveData(event:any,reterieveData:any){
    console.log("reterieveData",reterieveData)
     if(reterieveData?.valid){
      if(this.apiMethodChk == 'getParams'){
        var params = this.getRetrievePostBody
        this.http.get(`${environment.API_URL}${this.getRetrieveAPI}`, {params}).subscribe((res: any) => {
         this.retrieveResponse(res,reterieveData)
       })
      }
      else if(this.apiMethodChk == 'postBody'){
        this.http.post(`${environment.API_URL}${this.getRetrieveAPI}`, this.getRetrievePostBody).subscribe((res: any) => {
         this.retrieveResponse(res,reterieveData)
       })
      }
    }
    if(!reterieveData?.valid){
      reterieveData.markAllAsTouched()
    }  
  
  }

}
