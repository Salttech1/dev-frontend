import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  api = environment.API_URL;
  constructor(private http: HttpClient, private router: Router,) { }

  getChargeCode() {
    const url= this.router.url.split('/')[this.router.url.split('/').length - 1];

  }
}
