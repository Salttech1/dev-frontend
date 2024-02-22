// Developed By  - 	nilesh.g
// Developed on - 07-02-23
// Mode  - Data Entry
// Service Name - insuranceService
// Purpose -
// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class insuranceService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}

  getInspolendorsementDetailsByPolendorseid(data: any) {
    let params = new HttpParams({ fromObject: data });
    console.log('params', params);
    console.log(
      'api ',
      `${this.api}inspolendorsement/fetch-inspolendorsement-by-Polendorseid`
    );
    return this.http.get<any>(
      `${this.api}inspolendorsement/fetch-inspolendorsement-by-Polendorseid`,
      { params }
    );
  }

  addInspolendorsement(data: any) {
    return this.http.post<any>(
      `${this.api}inspolendorsement/add-inspolendorsement`,
      data
    );
  }

  updateInspolendorsement(data: any) {
    return this.http.put<any>(
      `${this.api}inspolendorsement/update-inspolendorsement`,
      data
    );
  }

  //  shahaji -------------------------Policy master--------------------------

  getPolicyDetailsByID(id: any) {
    let params = new HttpParams().set('policyid', id);
    return this.http.get<any>(
      `${this.api}inspolicy/fetch-inspolicy-by-Policyid`,
      {
        params,
      }
    );
  }

  getPolicyIDByPolicyNum(num: any) {
    let params = new HttpParams().set('policynum', num);
    return this.http.get<any>(`${this.api}inspolicy/check-Policynum-Exists`, {
      params,
    });
  }

  addInsPolicy(data: any) {
    return this.http.post<any>(`${this.api}inspolicy/add-inspolicy`, data);
  }

  updateInsPolicy(data: any) {
    return this.http.put<any>(`${this.api}inspolicy/update-inspolicy`, data);
  }

  //  shahaji -------------------------Policy master--------------------------
}
