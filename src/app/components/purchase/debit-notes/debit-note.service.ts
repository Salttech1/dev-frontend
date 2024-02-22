import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as constants from '../../../../constants/constant';
import * as commonconstants from '../../../../constants/commonconstant';

@Injectable({
  providedIn: 'root'
})
export class DebitNoteService {

  constructor(private http: HttpClient) { }

  fetchDebitNoteDataBySerialNo(serialNo : any){
    let params = new HttpParams()
    .set('ser', `${serialNo}`);
  return this.http.get(`${environment.API_URL}${constants.api_url.fecthDebitNoetBySerialNo}`, {
    params,
  });
  }

  checkSuppBillForDebitNote(partyCode: any,supplierBillNumber : any){
    let params = new HttpParams()
    .set('partyCode',`${partyCode}` )
    .set('supplierBillNo', `${supplierBillNumber}`);
  return this.http.get(`${environment.API_URL}${constants.api_url.checkSuppBillForDebitNote}`, {
    params,
  });
  }

  updateDebitNote(debitNoteRequestBean: any){
    return this.http.put(`${environment.API_URL}dbnote/update-dbnote`,debitNoteRequestBean)
  }

  addDebitNote(debitNoteRequestBean: any){
    return this.http.post(`${environment.API_URL}dbnote/add-dbnote`,debitNoteRequestBean)
  }


  getPropByCompanyCode(companyCode: any){
    let params = new HttpParams()
    .set("companyCode", companyCode)
    .set("closedate", commonconstants.coyCloseDate)
    return this.http.get<any>(`${environment.API_URL}company/fetch-prop-details-by-coycode`,{params} );
  }

  checkIsQuantityValid(partyCode : any, supplierBillNo :any, dbNoteSer : any, itemQTy : any, debitAmount : any){
    let params = new HttpParams()
    .set("partyCode", partyCode)
    .set("supplierBillNo", supplierBillNo)
    .set("dbNoteSer", dbNoteSer)
    .set("itemQTy", itemQTy)
    .set("debitAmount", debitAmount)
    return this.http.get(`${environment.API_URL}dbnote/check-quantity-valid`, {
      params,
    });
  }

  checkIsUOMValid(matgroup : any, code :any){
    let params = new HttpParams()
    .set("matgroup", matgroup)
    .set("code", code)
    return this.http.get(`${environment.API_URL}dbnote/check-uom-valid`, {
      params,
    });
  }


  checkIsDebitAmountValid(partyCode : any, supplierBillNo :any,  debitAmount : any){
    let params = new HttpParams()
    .set("partyCode", partyCode)
    .set("supplierBillNo", supplierBillNo)
    .set("debitAmount", debitAmount)
    return this.http.get(`${environment.API_URL}dbnote/check-debit-amount-valid`, {
      params,
    });
  }


  
  fetchPbillAmountForRevereDebitNote(supplierNumber : any, partyCode : any, buildingCode : any, suppBilldt : any, authNum : any){
    let params = new HttpParams()
    .set("supplierNumber", supplierNumber)
    .set("partyCode", partyCode)
    .set("buildingCode", buildingCode)
    .set("suppBilldt", suppBilldt)
    .set("suppBilldt", authNum)
    return this.http.get(`${environment.API_URL}purchase-bills/fetch-bill-amount-by-supplier-number-party-code-building-code-suppbilldt-autno`, {
      params,
    });
  }

  //fetch-dbnoteh-for-reversal-by-ser

  fetchDebitNoteForReversal(ser: any){
    let params = new HttpParams()
    .set('ser', `${ser}`)
    return this.http.get(`${environment.API_URL}dbnote/fetch-dbnoteh-for-reversal-by-ser`, {
      params,
    });
  }
  reverseDebitNote(dbNoteSer: any, matGroup: any, qty: any){
    let params = new HttpParams()
    .set('dbNoteSer', `${dbNoteSer}`)
    .set('matGroup', `${matGroup}`)
    .set('qty', `${qty}`)
    return this.http.post(
      `${environment.API_URL}dbnote/reverse-dbnote`,
      null,{params}
    );

  }


}
