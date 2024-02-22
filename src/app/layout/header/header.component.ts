import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: any;
  resMenu = []
  openMenu: boolean = false
  level1: boolean = false
  level2: boolean = false
  level3: boolean = false
  levelNum = 1
  levelDesc: any = [{ l1Desc: 'FA' }, { l2Desc: '' }, { l3Desc: '' }]

  constructor(
    private service: ServiceService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.service.usrName.subscribe((val: any) => {
      this.userName = val;
    });
    this.service.menu.subscribe((res: any) => {
      this.resMenu = res;
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        this.service.usrName.next(null);
        this.service.pageData.next({
          breadcrumb: [],
          code: '',
          formName: '',
        });
        this.router.navigate(['/login']);
      },
    });
  }

  routeToReport() {
    this.router.navigate(['/reports']);
  }

  
  routeToCodeHelp() {
    this.router.navigate(['/shared/codehelp']);
  }

  openSubMenu(levelString: string, levelNum: any) {
    if (levelNum == 1) {
      if (this.levelDesc.l1Desc != levelString) {
        this.level1 = false
        this.levelDesc.l1Desc = levelString
        this.openSubMenu(levelString, levelNum)
      }
      else {
        this.levelDesc.l1Desc = levelString;
        this.level1 = !this.level1;
      }
    }
    if (levelNum == 2) {
      if (this.levelDesc.l2Desc != levelString) {
        this.level2 = false
        this.levelDesc.l2Desc = levelString
        this.openSubMenu(levelString, levelNum)
      }
      else {
        this.levelDesc.l2Desc = levelString;
        this.level2 = !this.level2;
      }
    }
    if (levelNum == 3) {
      if (this.levelDesc.l3Desc != levelString) {
        this.level3 = false
        this.levelDesc.l3Desc = levelString
        this.openSubMenu(levelString, levelNum)
      }
      else {
        this.levelDesc.l3Desc = levelString;
        this.level3 = !this.level3;
      }
    }
  }

  toggleMenu() {
    this.openMenu = !this.openMenu
    this.level1 = false
    this.level2 = false
    this.level3 = false
    this.levelDesc = [{ l1Desc: 'FA' }, { l2Desc: '' }, { l3Desc: '' }]
  }
}


