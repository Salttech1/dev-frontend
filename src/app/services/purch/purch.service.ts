import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchService {
  api: String = environment.API_URL;

  constructor(private http: HttpClient) { }

  getSessionPurchBillOutstanding(payLoad: any) {
    return this.http.post(
      `${environment.API_URL}purchase-bills/add-into-purch-bill-outstanding-temp-table`,
      payLoad
    );
  }

  getBilldetails(data: any) {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      params = params.append(key, data[key]);
    });
    return this.http.get(
      `${environment.API_URL}purchase-bills-enquiry/fetch-bill-details`,
      { params }
    );
  }

  fetchNewBillDetails(partyCode: any, suppCode: any) {
    let params = new HttpParams()
      .set('partyCode', `${partyCode}`)
      .set('suppCode', `${suppCode}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills-enquiry/fetch-new-bill-details`,
      { params }
    );
  }

  fetchExcludBldg() {
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-exclude-building-detail`
    );
  }

  outstandingAdvRetReport(body: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/generate-outstanding-adv-and-reten-report`,
      body,
      { responseType: 'blob' }
    );
  }

  deleteSessionId(sessionId: number, isAgeing: boolean) {
    let params = new HttpParams().set('sessionId', sessionId)
      .set('isAgeing', isAgeing)
    return this.http.delete<any>(`${this.api}purchase-bills/delete-temp-table-from-sessionId`, { params });
  }
}
