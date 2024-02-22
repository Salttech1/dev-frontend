import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { DynapopService } from 'src/app/services/dynapop.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
})
export class FavouriteComponent implements OnInit {
  resMenu: any = [];
  favList: any = [];
  loader: boolean = false;

  constructor(
    private service: ServiceService,
    private dynapop: DynapopService,
    private tostr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getMenuList().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.resMenu = res.data;
          this.resMenu?.forEach((v: any) => this.activeFav(v, 0));
        }
      },
    });
  }

  activeFav(main: any, urlIndex: number) {
    urlIndex++;
    main?.sub_menu?.forEach((v: any) => {
      let f = v?.favourite;
      if (f == 'Y') {
        this.favList.push({
          code: v?.code,
          isfavourite: f == 'Y' ? true : false,
        });
      }
      this.activeFav(v, urlIndex);
    });
  }

  favChkTrigger(c: any, e: any, isKey: boolean) {
    if (this.favList.length) {
      for (let i = 0; i < this.favList.length; i++) {
        if (this.favList[i].code == c) {
          if (isKey) {
            this.favList[i].isfavourite = e.target.checked;
          } else {
            this.favList.splice(i, 1);
          }
        } else {
          if (e.target.checked) {
            this.favList.push({
              code: c,
              isfavourite: e.target.checked,
            });
            break;
          }
        }
      }
    } else {
      if (e.target.checked) {
        this.favList.push({
          code: c,
          isfavourite: e.target.checked,
        });
      }
    }
  }

  save() {
    this.loader = true;
    this.dynapop
      .updateFav(this.favList)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status) {
            this.tostr.success(res.message);
            this.service.getMenuList().subscribe({
              next: (res: any) => {
                if (res.status) {
                  this.service.menu.next(res.data);
                  this.resMenu = res.data;
                  this.router.navigate(['dashboard']);
                }
              },
            });
          } else {
            this.tostr.error(res.message);
          }
        },
      });
    console.log(this.favList, 'favList');
  }
}
