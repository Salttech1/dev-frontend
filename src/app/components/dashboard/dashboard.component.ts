import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ServiceService } from 'src/app/services/service.service';
import { PipesPipe } from 'src/app/shared/pipe/pipes.pipe';

export interface favItem {
  code: number;
  isfavourite: boolean;
  desc: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  urlCu: any = [];
  favList: favItem[] = [];

  constructor(private service: ServiceService, private urlPipe: PipesPipe) {}

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    this.service
      .getMenuList()
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          res.status && this.activeFav(res.data, 0);
        },
      });
  }

  // get favourite from menu
  activeFav(main: any, level: number) {
    main.forEach((val: any) => {
      // remove space, backslash, etc using pipe transform to get proper url
      let url = this.urlPipe.transform(val.description);

      // get url with help of treelink property
      switch (val.treelink) {
        case 0:
          this.urlCu.splice(0); // get 1st item from url
          this.urlCu[0] = url; // replace index 0 item
          break;
        case 1:
          this.urlCu.splice(1); // get 1st 2 item from url
          this.urlCu[1] = url; // replace index 1 item
          break;
        case 2:
          this.urlCu.splice(2); // get 1st 2 item from url
          this.urlCu[2] = url; // replace index 2 item
          break;
        case 3:
          this.urlCu[3] = url; // replace index 3 item
          break;
      }

      if (val.hasOwnProperty('sub_menu')) {
        // recursive function if menu has sub_menu
        this.activeFav(val?.sub_menu, level);
      } else if (val.hasOwnProperty('favourite') && val.favourite == 'Y') {
        this.favList.push({
          code: val.code,
          isfavourite: true,
          desc: val.description,
          url: [...this.urlCu].join('/'),
        });
      }
    });
  }
}
