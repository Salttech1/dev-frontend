import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /** on page load get login temprary xsrf token initially */
  getTempCookie() {
    return this.http.get(`${environment.API_URL}login`);
  }

  login(user: any) {
    let formData: any = new FormData();
    formData.append('username', user.username.toUpperCase());
    formData.append('password', user.password);
    return this.http.post(`${environment.API_URL}login`, formData);
  }

  logout() {
    return this.http.post(`${environment.API_URL}logout`, null);
  }
}
