import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  api: String = environment.API_URL

  constructor(private http: HttpClient) { }

  getFromToDateNeftAdvice() {
    return this.http.get<any>(`${this.api}fd-report/fetch-neft-report-fromDate-and-toDate-and-coyBankAC`)
  }

  generateFdActiveDepositReport(body:any){
    return this.http.post(`${this.api}fd-report/generate-active-deposit-report`,body,  { responseType: 'blob' })
  }
}
