import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/services/service.service';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  menu: any;
  level1: any;
  level2: any;
  isValue: number = 0;
  menuListContainer = false;
  currentClick: any;
  scrollwid: any;
  totalWidth: any;
  width: any;
  viewMenuList = true;
  l0Link!: string;
  l1Link!: string;
  updateVal: any = [];
  loader:boolean=false
  constructor(private http: HttpClient, private services: ServiceService) {}

  ngOnInit(): void {
    this.getMenuList();
  }

  @ViewChild('section_menu_ul')
  $elem!: ElementRef;
  @ViewChild('nextslider')
  $next!: ElementRef;
  @ViewChild('prevslider')
  $prev!: ElementRef;

  getMenuList() {
    var _usrName = sessionStorage.getItem('userName');
    if (_usrName !== null && _usrName !== '') {
      this.loader=true
      var payload = { username: `${sessionStorage.getItem('userName')}` };
      this.http
        .post(`${environment.API_URL}menu/fetch-menu`, payload)
        .pipe(take(1),finalize(()=>{this.loader=false}))
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              this.menu = res.data;
              this.services.menu.next(this.menu);
              localStorage.setItem('menu', res)
              this.services.fetchMenu.next(res);
              if (this.menu?.length < 10) {
                this.viewMenuList = false;
              }
            }
          },
        });
    }
  }

  subMenuList(submenulist: any, primVal: any, l0lbl: any) {
    if (this.currentClick == primVal) {
      this.updateVal = [];
      this.menuListContainer = false;
      this.currentClick = undefined;
    } else {
      if (submenulist?.length) {
        this.menuListContainer = true;
        this.level1 = submenulist;
        this.isValue = 0;
        this.l0Link = l0lbl;
        this.subMenuL2(submenulist[0].sub_menu, 0, submenulist[0].description);
        this.currentClick = primVal;
      }
    }
  }

  subMenuHide() {
    this.menuListContainer = false;
    this.currentClick = undefined;
  }

  subMenuL2(level2MenuList: any, activeNum: any, l1lbl: any) {
    this.level2 = level2MenuList;
    this.isValue = activeNum;
    this.l1Link = l1lbl;
  }

  /** menu slider */
  scrollleftright() {
    var newscrollleftpos = this.$elem.nativeElement.scrollLeft;

    this.width = this.$elem.nativeElement.clientWidth;
    this.totalWidth = this.scrollwid - parseInt(this.width);

    if (newscrollleftpos == this.totalWidth) {
      this.$next.nativeElement.classList.remove('active');
      this.$prev.nativeElement.classList.add('active');
    } else if (newscrollleftpos != this.totalWidth || newscrollleftpos != 0) {
      this.$next.nativeElement.classList.add('active');
      this.$prev.nativeElement.classList.add('active');
    }
    if (newscrollleftpos == 0) {
      this.$prev.nativeElement.classList.remove('active');
    }
  }

  hslidernext() {
    this.$elem.nativeElement.scrollLeft += 200;
    setTimeout(() => {
      this.scrollleftright();
    }, 500);
  }

  hsliderprev() {
    this.$elem.nativeElement.scrollLeft -= 200;
    setTimeout(() => {
      this.scrollleftright();
    }, 500);
  }

  //close menu on esc click
  @HostListener('document:keydown', ['$event'])
  closeMenu(e: any) {
    if (this.menuListContainer && e.keyCode == 27) {
      this.menuListContainer = false;
      this.currentClick = undefined;
    }
  }
}
