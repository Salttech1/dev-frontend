import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  wsContainer!:boolean
  constructor(
    private _service:ServiceService
  ) {
    this._service._ws.subscribe((data)=>{
      this.wsContainer = data
    })
  }

  ngOnInit(): void {
  }

}
