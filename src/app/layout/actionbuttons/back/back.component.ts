import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit {
   @Input() getReterieveFormaData:any
   @Output() senBackClick=new EventEmitter()
  disabledFlag!: boolean;
   constructor(private actionService:ActionservicesService) { }

  ngOnInit(): void {
    this.actionService.isBackActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

  backClick(event:any,getReterieveFormaData:any){
    this.actionService.commonFlagCheck(false,false,false,true,true,true,true,true,false,true,true)
    this.actionService.accessRightCheck()
   // this.actionService.accessRightCheck()
    // this.actionService.getIsReteriveActionFlag(true)
    // this.actionService.getIsAddActionFlag(false)
    // this.actionService.getIsNewDepositActionFlag(false)
    // this.actionService.getisPrintActionFlag(true)
    // this.actionService.getSaveActionFlag(true)
    // this.actionService.getBackActionFlag(true)
    // this.actionService.getResetActionFlag(true)
    getReterieveFormaData.reset()
    getReterieveFormaData.enable()
    this.senBackClick.emit()
    this.actionService.getisTabContentDataFlag(false)
  }

}
