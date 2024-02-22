import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  disabledFlag!: boolean;
  @Output() isResetPass=new EventEmitter<boolean>();
  constructor(private actionService:ActionservicesService) { }

  ngOnInit(): void {
    this.actionService.isResetActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

  resetFormData(){
    this.actionService.getIsResetClickedFlagUpdateValue(true)
    this.actionService.getIsSaveClickedFlagUpdateValue(false)
    this.actionService.sendResetClick()
  }

}
