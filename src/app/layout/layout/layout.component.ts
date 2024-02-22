import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isLoginPage = true;
  event$: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url == '/login' || event.url == '/' || event.url == '/register') {
          this.isLoginPage = false;
        } else {
          this.isLoginPage = true;
        }

        if (event.url == '/login' && event.navigationTrigger == 'popstate') {
          if (
            sessionStorage.getItem('userName') !== '' ||
            sessionStorage.getItem('userName') !== null
          ) {
            this.router.navigate(['/dashboard']);
          }
        }
      }
    });
  }
}
