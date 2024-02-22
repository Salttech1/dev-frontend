import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'src/app/services/service.service';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loader: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl<String | null>('', Validators.required),
    password: new FormControl<String | null>('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToasterapiService,
    private _service: ServiceService,
    private _report: CommonReportsService
  ) {}

  ngOnInit(): void {
    this.authService.getTempCookie().subscribe();
  }

  login() {
    if (this.loginForm.valid) {
      this.loader = true;
      this.authService
        .login(this.loginForm.value)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            console.log('user', res);
            this._service.usrName.next(res.userid);
            sessionStorage.setItem('userName', res?.userid);
            sessionStorage.setItem('site', res?.site);
            res.hasOwnProperty('startupReportName') && this.getReport(res);
            this.router.navigate(['/dashboard']);
            this.loginForm.reset();
          },
          error: () => (this.loader = false),
          complete: () => (this.loader = false),
        });
    } else {
      this.toastr.showError('Please fill the form properly');
    }
  }

  passwordShow(event: any) {
    event.preventDefault();
    this.hide = false;
  }
  passwordHide(event: any) {
    event.preventDefault();
    this.hide = true;
  }

  // Download report for admin exp user
  getReport(val: any) {
    let payload = {
      name: val.startupReportName,
      seqId: 1,
      isPrint: false,
      reportParameters: {},
    };

    this._report
      .getParameterizedReportWithCondition(payload)
      .pipe(take(1))
      .subscribe((res) => {
        let pdf = new Blob([res], { type: 'application/pdf' });
        window.open(URL.createObjectURL(pdf), '_blank');
      });
  }
}
