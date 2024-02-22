import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  api: String = environment.API_URL;

  constructor(private http: HttpClient) {}

  getCertByNum(data: string) {
    let params = new HttpParams().set('certnum', data);
    return this.http.get(
      this.api + 'certificate/fetch-certificate-entry-by-certnum',
      { params }
    );
  }

  getPartyCodetByRecId(recId: string) {
    let params = new HttpParams().set('recId', recId);
    return this.http.get(this.api + 'certificate/fetch-partycode-by-recId', {
      params,
    });
  }

  checkIsDebitAmountValid(recId: string, billNo: string, debitAmount: number) {
    let params = new HttpParams()
      .set('recId', recId)
      .set('billNo', billNo)
      .set('debitAmount', debitAmount);
    return this.http.get(this.api + 'certificate/check-debit-amount-valid', {
      params,
    });
  }

  checkIsContractDebitReversal(debitType: string, authnum: string) {
    let params = new HttpParams()
      .set('debitType', debitType)
      .set('authnum', authnum);
    return this.http.get(
      this.api +
        'certificate/check-contract-debit-reversal-by-debittype-authnum',
      { params }
    );
  }

  getBuildingAndCoyByAuthNum(authnum: string) {
    let params = new HttpParams().set('authnum', authnum);
    return this.http.get(
      this.api + 'certificate/fetch-bldgcode-coy-by-authnum',
      { params }
    );
  }

  getBuildingAndCoyAndContractorByRecId(recId: string) {
    let params = new HttpParams().set('contractId', recId);
    return this.http.get(
      this.api + 'certificate/fetch-bldgcode-coy-contractor-by-contractid',
      { params }
    );
  }

  getCoyNameByBldgCode(bldgcode: string) {
    let params = new HttpParams().set('bldgcode', bldgcode);
    return this.http.get(this.api + 'certificate/fetch-coy-name-for-enggsys', {
      params,
    });
  }

  getContractDetails(payload: any) {
    return this.http.post(
      this.api +
        'certificate/fetch-contract-debit-by-debittype-authnum-recId-certType-runser-bldg',
      payload
    );
  }

  fetchBldgAndPartyAndWorkCodeByContractorId(contractorId: string) {
    let params = new HttpParams().set('contractId', contractorId);
    return this.http.get(
      this.api + 'certificate/fetch-bldgcode-partycode-workcode-by-contractid',
      {
        params,
      }
    );
  }

  getCertByRec(data: string) {
    let params = new HttpParams().set('recid', data);
    return this.http.get(this.api + 'certificate/fetch-certnum-by-recid', {
      params,
    });
  }

  getListOfInterimCertificateTempTableData(data: any) {
    // 12.12.23   RS
    return this.http.post<any>(
      `${this.api}certificatereports/add-into-listof-interim-certificate-report-temp-table`,
      data
    );
  }


}
