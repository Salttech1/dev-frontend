import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  api: String = environment.API_URL;
  constructor(private http: HttpClient) { }

  fetchRecId(recid:string){
    let params = new HttpParams()
    .set('recid', `${recid}`)
    return this.http.get(
      `${environment.API_URL}certificate/fetch-contract-details-by-recid`, { params }
    );
  }

  updateCoy(bldgcode:string){
    let params = new HttpParams()
    .set('bldgcode', `${bldgcode}`)
    return this.http.get(
      `${environment.API_URL}certificate/fetch-coy-name-for-enggsys`, { params }
    );
  }

  addContractDetail(body:any){
    return this.http.post(
      `${environment.API_URL}certificate/add-contract-detail`, body
    );
  }

  saveContractDetail(body:any){
    return this.http.post(
      `${environment.API_URL}certificate/save-contract-detail`, body
    );
  }

  fetchBillEntry(ser:string){
    let params = new HttpParams()
    .set('ser', `${ser}`)
    return this.http.get(
      `${environment.API_URL}certificate/fetch-contract-bill-detail-by-ser`, {params}
    );
  }

  fetchContractDebitNoteBySer(ser: string){
    let params = new HttpParams()
    .set('dbnoteser', `${ser}`)
    return this.http.get(
      `${environment.API_URL}certificate/fetch-contract-debitnote-by-ser`, {params}
    );
  }

  fetchContratcBillByRecIdAndBillNo(recId: string, billNo: string){
    let params = new HttpParams()
    .set('recId', `${recId}`)
    .set('billNo', `${billNo}`)
    return this.http.get(
      `${environment.API_URL}certificate/fetch-contract-bill-by-recid-and-billno`, {params}
    );
  }


  addContractDebit(body:any){
    return this.http.post(
      `${environment.API_URL}certificate/add-contract-debit`, body
    );
  }

  addContractDebitNote(body:any){
    return this.http.post(
      `${environment.API_URL}certificate/add-contract-debit-note`, body
    );
  }

  updateContractDebit(body:any){
    return this.http.put(
      `${environment.API_URL}certificate/update-contract-debit`, body
    );
  }

reverseContractDebit(body:any){
    return this.http.put(
      `${environment.API_URL}certificate/reverse-contract-debit`, body
    );
  }

}
