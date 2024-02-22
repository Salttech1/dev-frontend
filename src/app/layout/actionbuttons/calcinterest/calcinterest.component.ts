import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-calcinterest',
  templateUrl: './calcinterest.component.html',
  styleUrls: ['./calcinterest.component.css']
})
export class CalcinterestComponent implements OnInit {
  disabledFlag!:boolean ;
  @Output() calcInterestClickTrigger = new EventEmitter()
  constructor(private actionService:ActionservicesService) { }

  ngOnInit(): void {
    this.actionService.isCalcInterestFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

  calcInterest(){
    this.calcInterestClickTrigger.emit()
  }
}
