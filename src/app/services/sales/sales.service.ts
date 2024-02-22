import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  fetchNum1ByClassAndId(Class: string, id: string) {
    throw new Error('Method not implemented.');
  }
  api: String = environment.API_URL;

  constructor(private http: HttpClient) { }

  getSessionInfraDefaultersList(payLoad: any) {
    return this.http.post(
      `${environment.API_URL}infra/add-into-infra-defaulters-list-temp-table`,
      payLoad
    );
  }

  deleteSessionId(sessionId: number) {
    let params = new HttpParams().set('sessionId', sessionId)
    
    return this.http.delete<any>(`${this.api}infra/delete-infra-defaulters-list-from-sessionId`, { params });
  }
  
}
