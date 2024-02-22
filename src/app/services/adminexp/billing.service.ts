// Developed By  - 	Shahaji Patil
// Developed on - 06/06/2023
// Service Name - billingService
// Purpose -
// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAdminDetailsBySerNo(id: any) {
    let params = new HttpParams().set('ser', id);
    return this.http.get<any>(`${this.api}admbillh/fetch-admbillh-by-Ser`, {
      params,
    });
  }

  addAdminBill(data: any) {
    return this.http.post<any>(`${this.api}admbillh/add-admbillh`, data);
  }

  updateAdminBill(data: any) {
    return this.http.put<any>(`${this.api}admbillh/update-admbillh`, data);
  }
}
