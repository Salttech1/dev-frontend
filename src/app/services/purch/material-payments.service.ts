import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialPaymentsService {
  api: String = environment.API_URL;
  constructor(private http: HttpClient) {}

  getItems(data: any) {
    let params = new HttpParams({ fromObject: data });

    return this.http.get(
      `${environment.API_URL}material-payments/fetch-item-by-bldgCode-and-matGrp`,
      { params }
    );
  }

  getAdvance(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-advance-paid-detail`,
      { params }
    );
  }

  addAdvance(data: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/save-material-payment`,
      data
    );
  }

  fetchBillDetail(data: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/fetch-bill-detail`,
      data
    );
  }

  fetchPaidBillDetail(data: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/fetch-paid-bill-detail`,
      data
    );
  }

  fetchDebitType(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-debit-type-by-building`,
      { params }
    );
  }

  multipleConditionParameters(data: any) {
    return this.http.post(
      `${environment.API_URL}report/generate-report-with-multiple-condition-and-parameter`,
      data,
      { responseType: 'blob' }
    );
  }

  getMergedPdf(data: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/merge-pdf`,
      data,
      { responseType: 'blob' }
    );
  }

  fetchSessId(data: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/insert-into-material-payment-temp`,
      data
    );
  }

  printCompleted(data: any) {
    return this.http.put(
      `${environment.API_URL}material-payments/update-print-status`,
      data
    );
  }

  deleteTemp(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.delete(
      `${environment.API_URL}material-payments/delete-temp-table-from-sessionId`,
      { params }
    );
  }
}
