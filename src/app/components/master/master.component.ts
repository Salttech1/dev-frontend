import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})
export class MasterComponent implements OnInit {
  urlFrag: string[] = [];
  constructor(private _service: ServiceService, private router: Router) {}

  ngOnInit(): void {}

  changeOfRoutes(e: any) {
    this.urlFrag = this.router.url.split('/').slice(1);
    this._service.getPageData(this.urlFrag);
  }
}
