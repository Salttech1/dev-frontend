import { Component, ComponentFactoryResolver, EventEmitter, Input, OnChanges, OnInit, ChangeDetectorRef,Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
declare var $: any;
import { ActionservicesService } from 'src/app/services/actionservices.service';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-actionpanel',
  templateUrl: './actionpanel.component.html',
  styleUrls: ['./actionpanel.component.css']
})
export class ActionpanelComponent implements OnInit,OnChanges {

  isAdd!:boolean
  isNewDeposit!:boolean

  @Input() reterieveFormData!:FormGroup
  @Input() getRetrieveApiUrl!:string
  @Input() sendRetrievePostBody:any
  @Output() tabContentDataFlag=new EventEmitter()
  @Output() addressInfo=new EventEmitter()
  @Output() depositorInfo=new EventEmitter()
  // @Output() isReterieveFlagUpdate=new EventEmitter()
  @Input() shareActionSaveData:any
  @Input() savedApiUrl:any
  // formGroup flagboolean
  @Input() savedFgValidationFlag:any
  @Input() updatedAddFlag!: boolean;
  @Input() addChkApiUrl!:boolean
  @Input() screenName! : string
  @Input() getParamsValue:any
  @Input() addValidationChk:any
  @Output() sendAddErrorField=new EventEmitter()
  // get export data
  @Input() exportFormGroup!:FormGroup
  // to print get print data
  @Input() printFormGroup!:FormGroup
  @Output() sendLoaderFlag=new EventEmitter()
  @Output() isCalcInterestClickTrigger = new EventEmitter()
  @Input() getApiMethodString!:string
  @Output() sendBackClickTrigger = new EventEmitter()

  constructor(private http:HttpClient,private cf:ComponentFactoryResolver,private actionService:ActionservicesService,private toastr:ToasterapiService, private changeDetector: ChangeDetectorRef) {
    this.actionService.isTabContentDataFlag.subscribe((res:any)=>{
      this.tabContentDataFlag.emit(res)
    })
    // this.actionService.isReteriveActionFlag.subscribe((res:any)=>{
    //   this.isReterieve = res
    // })
    // this.actionService.isNewDepositActionFlag.subscribe((res:any)=>{
    //   this.isNewDeposit = res
    // })
    // this.actionService.isPrintActionFlag.subscribe((res:any)=>{
    //   this.isPrint = res
    // })

   }

  ngOnInit(): void {
    this.actionService.accessRightCheck()
  }

  ngOnChanges(){
    this.actionService.isAddActionFlag.subscribe((res:any)=>{
      this.isAdd = res
    })
  }

  resetAddErrorField(event:any){
    this.sendAddErrorField.emit()
  }

  getRetrieveData(val:any){
      this.depositorInfo.emit(val)
  }

  updateLoaderFlag(event:boolean){
    this.sendLoaderFlag.emit(event)
  }
  // for deposit discahrge
  getIsCalcInterestClickTrigger(){
    this.isCalcInterestClickTrigger.emit()
  }

  triggerBackClick(){
    this.sendBackClickTrigger.emit()
  }

}
