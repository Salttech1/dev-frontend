import { BookingsModule } from './../../../components/sales/bookings/bookings.module';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import * as SockJs from 'sockjs-client'
import { ServiceService } from 'src/app/services/service.service';
import * as Stomp from 'stompjs';


@Component({
  selector: 'app-wsdemo',
  templateUrl: './wsdemo.component.html',
  styleUrls: ['./wsdemo.component.css']
})
export class WsdemoComponent implements OnInit {
  ws: any;
  msgTxt!: string
  dMsg: boolean = false;
  constructor(private _service: ServiceService) { }

  ngOnInit(): void {
    this._service.greetings.subscribe((v) => {
      this.msgTxt = v
    })
    this._service.wsMsg.subscribe((v) => {
      this.dMsg = v
    })
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.disconnect()
      console.log("disconnect...");
    }
    //this.setConnected(false)
  }

}
