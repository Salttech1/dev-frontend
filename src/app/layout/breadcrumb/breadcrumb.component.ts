import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  breaCrumbArrList: any;
  formNameData: any;
  constructor(private service: ServiceService) {}

  ngOnInit(): void {
    this.service.pageData.subscribe((data: any) => {
      this.breaCrumbArrList = data.breadcrumb;
      this.formNameData = data.formName;
    });
  }
}
