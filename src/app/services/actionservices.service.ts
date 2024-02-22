import { Injectable, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToasterapiService } from './toasterapi.service';
import { BehaviorSubject, Observable,Subject } from 'rxjs';
import { ModalService } from './modalservice.service';
import  * as constant from '../../constants/constant'


@Injectable({
  providedIn: 'root'
})
export class ActionservicesService {
  private subject = new Subject<void>()
  accessRightArr: any;
  constructor(private http:HttpClient,private toastr:ToasterapiService, private modalService: ModalService) { }

  isReteriveActionFlag = new BehaviorSubject(false)

  isAddActionFlag= new BehaviorSubject(true)

  isNewDepositActionFlag =new BehaviorSubject(true)
  isPrintActionFlag=new BehaviorSubject(true)
  isListActionFlag=new BehaviorSubject(true)

  isTabContentDataFlag = new BehaviorSubject(false); 

  isAddClickedFlagUpdated = new BehaviorSubject(false)

  isReterieveClickedFlagUpdate = new BehaviorSubject(false)

  isSaveClickFlagUpdate = new BehaviorSubject(false)

  isResetClickFlagUpdate = new BehaviorSubject(false)

  isDeleteActionFlag = new BehaviorSubject(true)

  isSaveActionFlag = new BehaviorSubject(true)

  isResetActionFlag = new BehaviorSubject(true)

  isBackActionFlag = new BehaviorSubject(true)

  isExportActionFlag = new  BehaviorSubject(false)

  isCalcInterestFlag = new BehaviorSubject(true)
  
   getIsReteriveActionFlag(data:any){
    this.isReteriveActionFlag.next(data)
   }

   getIsAddActionFlag(data:any){
    this.isAddActionFlag.next(data)
   }

   getIsNewDepositActionFlag(data:any){
    this.isNewDepositActionFlag.next(data)
   }

   getisPrintActionFlag(data:any){
    this.isPrintActionFlag.next(data)
   }

   getIsListActionFlag(data:any){
    this.isListActionFlag.next(data)
   }

   getisTabContentDataFlag(data:any){
    this.isTabContentDataFlag.next(data)
   }

   getAddFlagUpdatedValue(data:any){
    this.isAddClickedFlagUpdated.next(data)
   }

  getReterieveClickedFlagUpdatedValue(data:any){
    this.isReterieveClickedFlagUpdate.next(data)
   }

  getIsResetClickedFlagUpdateValue(data:any){
    this.isResetClickFlagUpdate.next(data)
  }

  getIsSaveClickedFlagUpdateValue(data:any){
    this.isSaveClickFlagUpdate.next(data)
  }

  getDeleteActionFlag(data:any){
    this.isDeleteActionFlag.next(data)
  }

  getSaveActionFlag(data:any){
    this.isSaveActionFlag.next(data)
  }

  getResetActionFlag(data:any){
    this.isResetActionFlag.next(data)
  }

  getBackActionFlag(data:any){
    this.isBackActionFlag.next(data)
  }

  getExportActionFlag(data:any){
    this.isExportActionFlag.next(data)
  }

  sendResetClick(){
    this.subject.next()
  }
  getResetClickEvent():Observable<any>{
    return this.subject.asObservable()
  }
  sendSaveValidationClick(){
    this.subject.next()
  }
  getSaveValidationEvent():Observable<any>{
    return this.subject.asObservable()
  }

  getAgeAndBirthDate(apiAppend:any){
    return  this.http.get(`${environment.API_URL}${apiAppend}`);
  }

  savedService(apiAppend:any,data:any,reterivedDataFormGroup:any){
    
    if(this.isAddClickedFlagUpdated?.value){
      this.http.post(`${environment.API_URL}${apiAppend}`,data).subscribe((res:any)=>{
        if(res.status){
          this.toastr.showSuccess(res.message)
          this.commonFlagCheck(false,false,false,true,true,true,true,true,true,true,true)
          this.accessRightCheck()
          // this.getIsReteriveActionFlag(true)
          // this.getIsAddActionFlag(true)
          // this.getIsNewDepositActionFlag(true)
          // this.getisPrintActionFlag(true)
          this.getisTabContentDataFlag(false)
          reterivedDataFormGroup.reset()
          reterivedDataFormGroup.enable()
        }
       
        else {
          this.toastr.showError(res.message)
        }
        console.log(res)
      },
      (error:HttpErrorResponse)=>{
        if(error.status===400){     
          console.log("error",error.error.errors[0].defaultMessage)
          this.toastr.showError(error.error.errors[0].defaultMessage)
        }
      }
      )
    }
    else{
    this.http.put(`${environment.API_URL}${apiAppend}`,data).subscribe((res:any)=>{
      if(res.status){
        //this.toastr.showSuccess(res.message)
        this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message, "info")
        this.commonFlagCheck(false,false,false,true,true,true,true,true,true,true,true)
        this.accessRightCheck()
        // this.getIsReteriveActionFlag(true)
        // this.getIsAddActionFlag(true)
        // this.getIsNewDepositActionFlag(true)
        // this.getisPrintActionFlag(true)
         this.getisTabContentDataFlag(false)
        reterivedDataFormGroup.reset()
        reterivedDataFormGroup.enable()
      }
      else{
        //this.toastr.showError(res.message)
        this.modalService.showErrorDialog(constant.ErrorDialog_Title, res.message, "error")
      }
    },
    (error:HttpErrorResponse)=>{
      if(error.status===400){     
        console.log("error",error.error.errors[0].defaultMessage)
        this.toastr.showError(error.error.errors[0].defaultMessage)
      }
    }
    )
  }
  }

  addApiCall(apiUrl:any, params: HttpParams){
   return this.http.get<any>(`${environment.API_URL}${apiUrl}`,{params});
  }

  getCalcInterestFlag(data:any){this.isCalcInterestFlag.next(data)}

  commonFlagCheck(addFlag:boolean,reterieveFlag:boolean,newDepositFlag:boolean,printFlag:boolean,listFlag:boolean,backFlag:boolean,saveFlag:boolean,resetFlag:boolean,exportFlag:boolean,deleteFlag:boolean,calcInterestFlag:boolean){
    this.getIsAddActionFlag(addFlag)
    this.getIsReteriveActionFlag(reterieveFlag)
    this.getIsNewDepositActionFlag(newDepositFlag)
    this.getisPrintActionFlag(printFlag)
    this.getIsListActionFlag(listFlag)
    this.getBackActionFlag(backFlag)
    this.getSaveActionFlag(saveFlag)
    this.getResetActionFlag(resetFlag)
    this.getExportActionFlag(exportFlag)
    this.getDeleteActionFlag(deleteFlag)
    this.getCalcInterestFlag(calcInterestFlag)
  }

  accessRightCheck(){
    this.accessRightArr = sessionStorage.getItem('accessRight')?.split(',')
    this.accessRightArr = [...this.accessRightArr]
       
    if(this.accessRightArr.includes("Add")){
        this.getIsAddActionFlag(false)
    }
    else if(this.accessRightArr.includes("Add") !== -1){
      this.getIsAddActionFlag(true)
    }
    if(this.accessRightArr.includes("Retrieve")){
      this.getIsReteriveActionFlag(false)
    }
    else if(this.accessRightArr.includes("Retrieve") !== -1){
      this.getIsReteriveActionFlag(true)
    }
    if(this.accessRightArr.includes("Export")){
      this.getExportActionFlag(false)
    }
    else if(this.accessRightArr.includes("Export") !== -1){
      this.getExportActionFlag(true)
    }
    if(this.accessRightArr.includes("Print")){
      this.getisPrintActionFlag(false)
    }
    else if(this.accessRightArr.includes("Print") !== -1){
      this.getisPrintActionFlag(true)
    }
    if(this.accessRightArr.includes("Delete")){
      this.getDeleteActionFlag(false)
    }
    else if(this.accessRightArr.includes("Delete") !== -1){
      this.getDeleteActionFlag(true)
    }
  }

}

