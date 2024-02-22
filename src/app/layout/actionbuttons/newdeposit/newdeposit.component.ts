import { Component, OnInit } from '@angular/core';
import { ActionservicesService } from 'src/app/services/actionservices.service';

@Component({
  selector: 'app-newdeposit',
  templateUrl: './newdeposit.component.html',
  styleUrls: ['./newdeposit.component.css']
})
export class NewdepositComponent implements OnInit {
  disabledFlag!: boolean;

  constructor(private actionService:ActionservicesService) { }

  ngOnInit(): void {
    this.actionService.isNewDepositActionFlag.subscribe((res:any)=>{
      this.disabledFlag = res
    })
  }

}
