import { Component, OnInit } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  disabledFlag!:boolean ;

  constructor(private actionService:ActionservicesService) { }

  ngOnInit(): void {
    this.actionService.isDeleteActionFlag.subscribe((res:any)=>{
      this.disabledFlag=res
    })
  }

}
