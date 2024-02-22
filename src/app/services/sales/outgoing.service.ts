// Developed By  - 	rahul.s
// Developed on - 05-05-23
// Mode  - Data Entry
// Service Name - OutgoingService
// Purpose -
// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as constant from '../../../constants/constant';

@Injectable({
  providedIn: 'root',
})
export class OutgoingService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}

  getOutrateDetailsByBldgcodeAndFlatnumAndWing(
    bldgcode: string,
    flatnum: string,
    wing: string
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('flatnum', flatnum)
      .set('wing', wing);
    return this.http.get<any>(
      `${this.api}outrate/fetch-outrate-by-Bldgcode-and-Flatnum-and-Wing`,
      { params }
    );
  }

  addOutrate(data: any) {
    return this.http.post<any>(`${this.api}outrate/add-outrate`, data);
  }

  updateOutrate(data: any) {
    return this.http.put<any>(`${this.api}outrate/update-outrate`, data);
  }

  deleteOutrate(
    bldgcode: string,
    flatnum: string,
    wing: string,
    startdate: string
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('flatnum', flatnum)
      .set('wing', wing)
      .set('startdate', startdate);
    return this.http.delete<any>(`${this.api}outrate/delete-outrate`, {
      params,
    });
  }

  getParameterizedReportWithMultipleConditionAndParameter(body: any) {
    return this.http.post(
      `${environment.API_URL}${constant.api_url.paramReportWithMultipleConditionAndParameter}`,
      body,
      { responseType: 'blob' }
    );
  }

  generateOGBills(data: any) {
    // 21.08.23   RS
    return this.http.post<any>(`${this.api}outgoingreports/generate-billdata`, 
      data,
    );
  }

  getOutgoingSummaryTempTableData(data: any) {
    // 20.10.23   RS
    return this.http.post<any>(
      `${this.api}outgoingreports/add-into-outgoing-summary-report-temp-table`,
      data
    );
  }

  // deleteSessionId(sessionId: number) {
  //   let params = new HttpParams().set('sessionId', sessionId);
  //   return this.http.delete<any>(
  //     `${this.api}outgoingreports/delete-temp-table-from-sessionId`,
  //     { params }
  //   );
  // }

  getOutgoingDefaultersListTempTableData(data: any) {
    // 07.11.23   RS
    return this.http.post<any>(
      `${this.api}outgoingreports/add-into-outgoing-defaulters-report-temp-table`,
      data
    );
  }

  getOutgoingSocietyAccountsTempTableData(data: any) {
    // 25.11.23   RS
    return this.http.post<any>(
      `${this.api}outgoingreports/add-into-society-accounts-report-temp-table`,
      data
    );
  }

  // deleteSocAccReportSessionId(sessionId: number) {      // 25.11.23   RS
  //   let params = new HttpParams().set('sessionId', sessionId);
  //   return this.http.delete<any>(
  //     `${this.api}outgoingreports/delete-soc-acc-temp-data`,
  //     { params }
  //   );
  // }

}
