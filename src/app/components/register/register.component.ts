import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ToasterapiService } from 'src/app/services/toasterapi.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl<String | null>(null, Validators.required),
    password: new FormControl<String | null>(null, Validators.required),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToasterapiService
  ) {}

  ngOnInit(): void {}

  register(val: any) {
    return this.http.post(`${environment.API_URL}passwd/register-user`, val);
  }

  createUser() {
    if (this.registerForm.valid) {
      let payload = {
        username: this.registerForm.value.username.toUpperCase(),
        password: this.registerForm.value.password,
      };

      this.register(payload)
        .pipe(take(1))
        .subscribe({
          next: (res: any) => {
            this.router.navigate(['/dashboard']);
          },
          error: (err: any) => {
            this.toastr.showError('Something went wrong');
          },
        });
    } else {
      this.toastr.showError('Please fill the form properly');
    }
  }
}
