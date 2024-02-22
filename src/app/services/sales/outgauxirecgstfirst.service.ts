// Developed By  - 	ninad.s
// Developed on - 29-04-23
// Mode  - Data Entry
// Service Name - OutgauxirecgstfirstService
// Purpose -
// Modification Details
// =======================================================================================================================================================
// Date		Coder  Version User    Reason
// =======================================================================================================================================================

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OutgauxirecgstfirstService {
  api = environment.API_URL;
  constructor(private http: HttpClient, private router: Router,) {}

  getStartdateAndEnddateFromOutrate(
    bldgcode: any,
    wing: any,
    flatno: any,
    billType: any //NS 05.09.2023
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatno', flatno)
      .set('billType', billType);
    return this.http.get<any>(
      `${this.api}outinfra/fetch-startdate-and-enddate-by-Bldgcode-and-wing-and-flatnum-and-bill-type`,
      { params }
    );
  }

  getMaintainanceRate(
    bldgcode: any,
    wing: any,
    flatno: any,
    billType: any //NS 21.08.2023 //NS 09.09.2023(Month removed from parameter)
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatno', flatno)
      .set('billType', billType);
    return this.http.get<any>(
      `${this.api}outinfra/fetch-maintainance-rate-for-auxi`,
      { params }
    );
  }

  getAdminRate(
    bldgcode: any,
    wing: any,
    flatno: any,
    billType: any //NS 22.08.2023 //NS 09.09.2023(Month removed from parameter)
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatno', flatno)
      .set('billType', billType);
    return this.http.get<any>(`${this.api}outinfra/fetch-admin-rate-for-auxi`, {
      params,
    });
  }

  getTDSRate(
    bldgcode: any,
    wing: any,
    flatno: any,
    billType: any //NS 22.08.2023 //NS 09.09.2023(Month removed from parameter)
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatno', flatno)
      .set('billType', billType);
    return this.http.get<any>(`${this.api}outinfra/fetch-TDS-rate-for-auxi`, {
      params,
    });
  }

  getPrevOgRecords(
    ownerid: string,
    startDate: string,
    typeAuxi: string,
    billType: string
  ) {
    let params = new HttpParams()
      .set('ownerid', ownerid)
      .set('month', startDate)
      .set('chargecode', typeAuxi)
      .set('rectype', billType);
    return this.http.get<any>(
      `${this.api}outinfra/fetch-Previous-Outgoing-Record-by-Ownerid-and-Month-and-Chargecode-and-Rectype`,
      { params }
    );
  }

  getFlatOwnerByBldgcodeAndFlatnumAndWing(
    bldgcode: any,
    flatnum: any,
    wing: any //NS 16.05.2023
  ) {
    console.log('Wing', wing == null);
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('flatnum', flatnum)
      .set('wing', wing);
    return this.http.get<any>(
      `${this.api}outinfra/fetch-flatowner-data-by-Bldgcode-and-Flatnum-and-Wing`,
      {
        params,
      }
    );
  }

  getGstRates() {
    //NS 31.05.2023
    return this.http.get<any>(`${this.api}outinfra/fetch-gst-rates`);
  }

  getStartDateByBldgcodeAndWingAndFlatnumAndBilltype(
    bldgcode: any,
    wing: any,
    flatno: any,
    billtype: any //NS 20.05.2023
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatno', flatno)
      .set('billtype', billtype);
    return this.http.get<any>(`${this.api}outinfra/fetch-start-date`, {
      params,
    });
  }

  getOutinfraDetailsByBldgcodeAndOwneridAndRecnumAndMonthAndNarrcode(
    bldgcode: string,
    ownerid: string,
    recnum: string,
    month: string,
    narrcode: string
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('ownerid', ownerid)
      .set('recnum', recnum)
      .set('month', month)
      .set('narrcode', narrcode);
    return this.http.get<any>(
      `${this.api}outinfra/fetch-outinfra-by-Bldgcode-and-Ownerid-and-Recnum-and-Month-and-Narrcode`,
      { params }
    );
  }

  addOutinfra(data: any) {
    return this.http.post<any>(`${this.api}outinfra/add-outinfra`, data);
  }

  updateOutinfra(data: any) {
    return this.http.put<any>(`${this.api}outinfra/update-outinfra`, data);
  }

  deleteOutinfra(
    bldgcode: string,
    ownerid: string,
    recnum: string,
    month: string,
    narrcode: string
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('ownerid', ownerid)
      .set('recnum', recnum)
      .set('month', month)
      .set('narrcode', narrcode);
    return this.http.delete<any>(`${this.api}outinfra/delete-outinfra`, {
      params,
    });
  }

  getInchqDetailsByTranserAndBankAndNumAndCoy(
    transer: string,
    bank: string,
    num: string,
    coy: string
  ) {
    let params = new HttpParams()
      .set('transer', transer)
      .set('bank', bank)
      .set('num', num)
      .set('coy', coy);
    return this.http.get<any>(
      `${this.api}inchq/fetch-inchq-by-Transer-and-Bank-and-Num-and-Coy`,
      { params }
    );
  }

  addInchq(data: any) {
    return this.http.post<any>(`${this.api}inchq/add-inchq`, data);
  }

  updateInchq(data: any) {
    return this.http.put<any>(`${this.api}inchq/update-inchq`, data);
  }

  deleteInchq(transer: string, bank: string, num: string, coy: string) {
    let params = new HttpParams()
      .set('transer', transer)
      .set('bank', bank)
      .set('num', num)
      .set('coy', coy);
    return this.http.delete<any>(`${this.api}inchq/delete-inchq`, { params });
  }

  getChargeCode() {
    const url= this.router.url.split('/')[this.router.url.split('/').length - 1];

    console.log("url is ", url);
    
    if (
      url === 'auxiliaryreceiptreportnormal' ||
      url === 'auxiliaryreceiptreportfirst'
    ) {

      return "'AUXI'";
    } else {
      return "'INAP'";
    }
  }

  fetchReportData(data:any){ //NS 25.10.2023
    return this.http.get<any>(`${this.api}/fetch-report-in-excel`, data);
  }
}
