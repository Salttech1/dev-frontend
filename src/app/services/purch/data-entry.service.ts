import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  api: String = environment.API_URL;
  constructor(private http: HttpClient) {}

  fetchPurchaseBill(entry: any,isPurchBill:boolean) {
    let params = new HttpParams()
    .set('ser', `${entry}`)
    .set('isPurchBill ',isPurchBill);
    return this.http.get(
      `${environment.API_URL}purchase-bills/fetch-purchase-bill-by-ser`,
      { params }
    );
  }

  fetchPurchaseBillForReversal(entry: any) {
    let params = new HttpParams().set('ser', `${entry}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/fetch-purchase-bill-for-reversal-by-ser`,
      { params }
    );
  }

  reverseBill(billSer: any, reverseType: any) {
    let params = new HttpParams()
      .set('billSer', `${billSer}`)
      .set('reverseType', `${reverseType}`);
    return this.http.post(
      `${environment.API_URL}purchase-bills/reverse-bill`,
      null,
      { params }
    );
  }

  fetchPartyWiseList(partyCode: any) {
    let params = new HttpParams().set('partyCode', `${partyCode}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/fetch-party-and-address-details`,
      { params }
    );
  }

  supplierNoCheck(supplierNumber: any, partyCode: string) {
    let params = new HttpParams()
      .set('supplierNumber', `${supplierNumber}`)
      .set('partyCode', `${partyCode}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/check-supplier-bill-number-exists`,
      { params }
    );
  }

  savePartyAddress(payload: any) {
    return this.http.put(
      `${environment.API_URL}purchase-bills/update-party-and-address-details`,
      payload
    );
  }

  savePurchaseBillEntry(payLoad: any) {
    return this.http.post(
      `${environment.API_URL}purchase-bills/add-new-gst-bill`,
      payLoad
    );
  }

  checkBillTypeValid(partyCode: any, billType: any) {
    let params = new HttpParams()
      .set('partyCode', `${partyCode}`)
      .set('billType', `${billType}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/check-bill-type-valid`,
      { params }
    );
  }

  getBillTypeList() {
    let params = new HttpParams().set('clazz', 'BLTYP');
    return this.http.get(`${environment.API_URL}entity/fetch-by-class`, {
      params,
    });
  }

  checkDebitTypeValid(buildingCode: any, debitType: any) {
    let params = new HttpParams()
      .set('buildingCode', `${buildingCode}`)
      .set('debitType', `${debitType}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/check-debit-type-valid`,
      { params }
    );
  }

  fetchUOM(matGroup: any, suppBillDate: any, billType: any) {
    let params = new HttpParams()
      .set('matGroup', `${matGroup}`)
      .set('matLevel', '1')
      .set('suppBillDate', `${suppBillDate}`)
      .set('billType', `${billType}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/fetch-uom-by-mat-group-and-mat-level`,
      { params }
    );
  }

  calculateTds(
    suppbilldt: any,
    amount: any,
    billtype: any,
    partycode: any,
    coy: any
  ) {
    let params = new HttpParams()
      .set('suppbilldt', `${suppbilldt}`)
      .set('amount', amount)
      .set('billtype', `${billtype}`)
      .set('partycode', `${partycode}`)
      .set('coy', `${coy}`);
    return this.http.get(`${environment.API_URL}purchase-bills/calculate-tds`, {
      params,
    });
  }

  validateSuppbillDt(suppBillDate: any) {
    let params = new HttpParams().set('date', `${suppBillDate}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/validate-suppbilldt`,
      { params }
    );
  }

  updatePurchBillAdjustement(payload: any) {
    let params = new HttpParams().set('ser', payload);
    return this.http.put(
      `${environment.API_URL}purchase-bills/update-purch-bill-adjustement`,
      {},
      { params }
    );
  }

  validateChallanDetail(
    dcno: any,
    partycode: any,
    serNo: string,
    suppbilldt: any
  ) {
    let params = new HttpParams()
      .set('dcno', `${dcno}`)
      .set('suppbilldt', `${suppbilldt}`)
      .set('serNo', serNo)
      .set('partycode', `${partycode}`);
    !serNo && (params = params.delete('serNo'));
    return this.http.get(
      `${environment.API_URL}purchase-bills/validate-challan-detail`,
      { params }
    );
  }

  validateUomDetail(deUom: any) {
    let params = new HttpParams().set('deUom', `${deUom}`);
    return this.http.get(
      `${environment.API_URL}purchase-bills/validate-uom-detail`,
      { params }
    );
  }
  validateUomConversionRate(
    matgroup: string,
    deUom: string,
    amount: number,
    qty: number
  ) {
    let params = new HttpParams()
      .set('matgroup', `${matgroup}`)
      .set('deUom', `${deUom}`)
      .set('amount', amount)
      .set('qty', qty);
    return this.http.get(
      `${environment.API_URL}purchase-bills/validate-uom-conversion-rate`,
      { params }
    );
  }

  fetchBillSerByPartyAndBuildingAndSuppBillNum(
    partyCode: any,
    blgCode: any,
    supplierNumber: any
  ) {
    let params = new HttpParams()
      .set('blgCode', `${blgCode}`)
      .set('partyCode', `${partyCode}`)
      .set('supplierNumber', supplierNumber);
    return this.http.get(
      `${environment.API_URL}purchase-bills/fetch-bill-ser-by-building-and-party-and-supbill-no`,
      { params }
    );
  }

  fetchAuthorisationEnquiry(supplierCode: any, authNos: any) {
    let params = new HttpParams()
      .set('supplierCode', `${supplierCode}`)
      .set('authNos', `${authNos}`);
    return this.http.get(
      `${environment.API_URL}material-payments/authorisation-enquiry`,
      { params }
    );
  }

  fetchMateriaPaymentStatusEnquiry(
    buildingCode: any,
    materialCode: any,
    supplierCode: any,
    authNos: any,
    authTypes: any,
    authFromDate: any,
    authToDate: any
  ) {
    let params = new HttpParams()
      .set('buildingCodes', `${buildingCode}`)
      .set('materialCodes', `${materialCode}`)
      .set('supplierCodes', `${supplierCode}`)
      .set('authNos', `${authNos}`)
      .set('authTypes', `${authTypes}`)
      .set('authFromDate', `${authFromDate}`)
      .set('authToDate', `${authToDate}`);
    return this.http.get(
      `${environment.API_URL}material-payments/material-payments-status-enquiry`,
      { params }
    );
  }

  fetchGstPassMaterialDetails() {
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-pass-material-payment-list`
    );
  }

  fetchAuthorisationDetailsByPartyAndBuildingAndMatGroup(
    partyCode: any,
    buildingCode: any,
    matGroup: any
  ) {
    let params = new HttpParams()
      .set('partyCode', `${partyCode}`)
      .set('buildingCode', `${buildingCode}`)
      .set('matGroup', `${matGroup}`);
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-authorisations-by-partyCode-buildingCode-matGroup`,
      { params }
    );
  }

  fetchAuthorisationDetailsByAuthNum(authNum: any) {
    let params = new HttpParams().set('authNum', `${authNum}`);
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-authorisations-details-by-authNum`,
      { params }
    );
  }

  checkIsAuthorisationValid(authTranser: any, authStatus: any) {
    let params = new HttpParams()
      .set('authTranser', `${authTranser}`)
      .set('authStatus', `${authStatus}`);
    return this.http.get(
      `${environment.API_URL}material-payments/check-authorisation-valid-for-cancelation`,
      { params }
    );
  }

  cancelMaterialPayment(cancelMaterialPaymentRequestList: any) {
    return this.http.put(
      `${environment.API_URL}material-payments/cancel-material-payments`,
      cancelMaterialPaymentRequestList
    );
  }
  savePassMaterialPayments(body: any) {
    return this.http.post(
      `${environment.API_URL}material-payments/pass-material-payment`,
      body
    );
  }
}
