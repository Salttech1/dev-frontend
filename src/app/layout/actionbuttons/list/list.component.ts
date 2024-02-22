import { Component, OnInit } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  disabledFlag!:Boolean
  constructor(private actionService:ActionservicesService) { }


  ngOnInit(): void {
    this.actionService.isListActionFlag.subscribe((res:any)=>{
      this.disabledFlag = res
    })
  }

}
