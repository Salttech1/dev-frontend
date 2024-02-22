import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { PipesPipe } from '../pipe/pipes.pipe';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  urlCu1: any = [];
  favList: string[] = [];

  counter: number = 0;
  constructor(
    private router: Router,
    private _service: ServiceService,
    private urlPipe: PipesPipe
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!sessionStorage.getItem('userName')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean {
    // console.log('time0', new Date().getTime());
    const promise = new Promise<boolean>((resolve, reject) => {
      this._service.fetchMenu.subscribe((res) => {
        // console.log('vmenu', res.data);
        // console.log('time1', new Date().getTime());

        if (res.data?.length) {
          this.favList = [];
          if (res.status) this.makeUrl(res.data, 0);
          let stateurl1 = state.url.slice(1);
          // console.log('favList1', this.favList);

          // if fetched menu includes component url then allow else goto dashboard
          if (this.favList.includes(stateurl1)) {
            // console.log('time2', new Date().getTime());

            resolve(true);
          } else {
            this.router.navigate(['/dashboard']);
            reject(false);
          }
        } else {
          this._service.getMenuList().subscribe({
            next: (res: any) => {
              this.favList = [];
              if (res.status) this.makeUrl(res.data, 0);
              let stateurl1 = state.url.slice(1);
              // console.log('favList2', this.favList);

              // if fetched menu includes component url then allow else goto dashboard
              if (this.favList.includes(stateurl1)) {
                resolve(true);
              } else {
                this.router.navigate(['/dashboard']);
                reject(false);
              }
            },
          });
        }
      });
    });

    console.log('time3', new Date().getTime());
    return promise;
  }

  makeUrl(data: any, level: number) {
    data.forEach((val: any) => {
      let url = this.urlPipe.transform(val.description);
      this.counter++;

      console.log('time4', new Date().getTime(), this.counter);

      // time4 1684932957272 1743
      // time4 1684932958175 4355

      // update url using treelink property
      for (let i = 0; i < 4; i++) {
        if (val.treelink == i) {
          this.urlCu1.splice(i);
          this.urlCu1[i] = url;
        }
      }

      // if sub_menu exists then repeat else push into array
      if (val.hasOwnProperty('sub_menu')) {
        this.makeUrl(val?.sub_menu, level);
      } else {
        this.favList.push([...this.urlCu1].join('/'));
      }
    });
  }
}
