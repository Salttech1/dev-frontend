import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LcauthService {
  api: String = environment.API_URL;
  constructor(private http: HttpClient) {}


  multipleConditionParameters(data: any) {
    return this.http.post(
      `${environment.API_URL}report/generate-report-with-multiple-condition-and-parameter`,
      data,
      { responseType: 'blob' }
    );
  }

  getMergedPdf(data: any) {
    return this.http.post(
      `${environment.API_URL}lcauth/merge-pdf`,
      data,
      { responseType: 'blob' }
    );
  }

  fetchSessId(data: any) {
    return this.http.post(
      `${environment.API_URL}lcauth/insert-into-material-payment-temp`,
      data
    );
  }

  printCompleted(data: any) {
    return this.http.put(
      `${environment.API_URL}lcauth/update-print-status`,
      data
    );
  }

  deleteTemp(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.delete(
      `${environment.API_URL}lcauth/delete-temp-table-from-sessionId`,
      { params }
    );
  }
}

