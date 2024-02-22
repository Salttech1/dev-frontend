import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepositEntryService {
  api: String = environment.API_URL

  constructor(private http: HttpClient) { }

  getInterestChequeData(query: any) {
    let params = new HttpParams({ fromObject: query });
    return this.http.get<any>(`${this.api}depint/fetch-cheque-by-interestFromDate-and-interestUpToDate-and-companyCode`, { params })
  }

  fetchDepositDischargeData(companyCode: any, depositorId: any, passRetrieveApiUrl: any) {
    let params = new HttpParams()
      .set("depositorId", `${depositorId}`)
      .set("companyCode", `${companyCode}`)
    return this.http.get(`${environment.API_URL}${passRetrieveApiUrl}`, { params })
  }
  fetchCalculateInterestForDischarge(passCalulateInterestApiUrl: any, postBody: any) {
    return this.http.post(`${environment.API_URL}${passCalulateInterestApiUrl}`, postBody)
  }
  saveRenewalGLEntry(saveApiUrl: any, saveApiBody: any) {
    return this.http.post(`${environment.API_URL}${saveApiUrl}`, saveApiBody)
  }
  updateChequeNo(data: any) {
    return this.http.put<any>(`${this.api}depint/update-bankCode-and-chequeNumber`, data)
  }
  fetchInterestCalculationReport(fetchInterestCalcApi: string, companyCode: any, calCulateUpTo: any) {
    let params = new HttpParams()
      .set("companyCode", `${companyCode}`)
      .set("calculateUpTo", `${calCulateUpTo}`)
      .set("site", `${sessionStorage.getItem('site')}`)
      .set("userId", `${sessionStorage.getItem('userName')}`)
    return this.http.get(`${environment.API_URL}${fetchInterestCalcApi}`, { params })
  }

  exitKillSessionInterestCalculation(killApiUrl: any) {
    return this.http.get(`${environment.API_URL}${killApiUrl}`)
  }

  saveInterestCalculation(saveInterestApiCall: any, payload: any) {
    return this.http.post(`${environment.API_URL}${saveInterestApiCall}`, payload)
  }

  fetchInterestChequePrinting(fetchInterestChequePrintingApiCall:string,payload:any){
    return this.http.post(`${environment.API_URL}${fetchInterestChequePrintingApiCall}`,payload)
  }

  exitKillInterestChequePrinting(killApiUrl:any){
    return this.http.get(`${environment.API_URL}${killApiUrl}`)
  }

  interestPaymentSummaryReport(payload:any){
    return this.http.post(`${environment.API_URL}interest-calculation/fetch-interest-payment-summary-report`, payload, { responseType: 'blob' })
  }

}
