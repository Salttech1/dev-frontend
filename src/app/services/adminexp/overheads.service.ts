import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as constant from '../../../constants/constant';

@Injectable({
  providedIn: 'root',
})
export class OverheadsService {
  api = environment.API_URL;

  billtype: BehaviorSubject<any> = new BehaviorSubject<any>(3);

  constructor(private http: HttpClient) {}

  getConsumerDetailBillDetailbyConnCode(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadtxn/fetch-overheadtxn-by-Connocode`,
      {
        params,
      }
    );
  }
  getConsumerDetailbyBillType(billtype: any) {
    let params = new HttpParams().set('billtype', billtype);
    return this.http.get<any>(
      `${this.api}overheadtxn/fetch-overheadcon-by-Billtype`,
      {
        params,
      }
    );
  }
  getOverheadConsDetails(connnocode: any) {
    let params = new HttpParams().set('connocode', connnocode);
    return this.http.get<any>(
      `${this.api}overheadcons/fetch-overheadcons-by-Connocode`,
      {
        params,
      }
    );
  }

  getParameterizedReportWithMultipleConditionAndParameter(body: any) {
    return this.http.post(
      `${environment.API_URL}${constant.api_url.paramReportWithMultipleConditionAndParameter}`,
      body,
      { responseType: 'blob' }
    );
  }

  getConnocodeBillperiodSupplementarybillexists(
    connocode: any,
    billperiod: any,
    supplementarybill: any
  ) {
    let params = new HttpParams()
      .set('connocode', connocode)
      .set('billperiod', billperiod)
      .set('supplementarybill', supplementarybill);
    return this.http.get<any>(
      `${this.api}overheadtxn/check-Connocode-and-Billperiod-and-Supplementarybill-exists`,
      {
        params,
      }
    );
  }

  // chk location exist
  getLocationcodeexists(code: any) {
    let params = new HttpParams().set('code', code);
    return this.http.get<any>(`${this.api}location/check-Code-exists`, {
      params,
    });
  }
  getConsumerDetailbyConnCodeBillperiodSupplimentryBill(
    connocode: any,
    billperiod: any,
    supplementarybill: any
  ) {
    let params = new HttpParams()
      .set('connocode', connocode)
      .set('billperiod', billperiod)
      .set('supplementarybill', supplementarybill);

    return this.http.get<any>(
      `${this.api}overheadtxn/fetch-overheadtxn-by-Connocode-and-Billperiod-and-Supplementarybill`,
      {
        params,
      }
    );
  }
  getConsumerDetailbyconnCode(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadcons/fetch-overheadcons-by-Connocode`,
      {
        params,
      }
    );
  }
  getConsumerBillExistInOverhead(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadcons/check-Consumer-billexists`,
      {
        params,
      }
    );
  }

  getLocnamePaycoynameBillcoyname(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadcons/fetch-LocnamePaycoynameBillcoyname-overheadcons-by-Connocode`,
      {
        params,
      }
    );
  }
  getMaxYearMonthfromOverheadCoy(ohddCoycode: any) {
    let params = new HttpParams().set('ohddCoycode', ohddCoycode);
    return this.http.get<any>(
      `${this.api}overheadcons/check-MaxYearMonth-InCompany`,
      {
        params,
      }
    );
  }

  getPrvBillData(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadtxn/fetch-overheadtxn-PrvBillData-by-Connocode`,
      {
        params,
      }
    );
  }

  getOverheadDeposite(connocode: any, billperiod: any) {
    let params = new HttpParams()
      .set('connocode', connocode)
      .set('period', billperiod);

    return this.http.get<any>(
      `${this.api}overheaddepositdtls/fetch-overheaddepositdtls-by-Connocode-and-Period`,
      {
        params,
      }
    );
  }

  getDepositWithConnocodeBillperiodexists(connocode: any, billperiod: any) {
    let params = new HttpParams()
      .set('connocode', connocode)
      .set('period', billperiod);

    return this.http.get<any>(
      `${this.api}overheaddepositdtls/check-Connocode-and-Period-exists`,
      {
        params,
      }
    );
  }
  getOverheadConncodeExist(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheadcons/check-Connocode-exists`,
      {
        params,
      }
    );
  }

  getOverheadConsumerExist(consumerno: any) {
    let params = new HttpParams().set('consumerno', consumerno);
    return this.http.get<any>(`${this.api}overheadcons/check-Consumer-exists`, {
      params,
    });
  }
  //retrive location
  getLocation(code: any) {
    let params = new HttpParams().set('code', code);
    return this.http.get<any>(`${this.api}location/fetch-location-by-Code`, {
      params,
    });
  }
  //find total deposite amount for perticular conncode

  getDepositeAmtbyConnocode(connocode: any) {
    let params = new HttpParams().set('connocode', connocode);
    return this.http.get<any>(
      `${this.api}overheaddepositdtls/fetch-overheaddeposit-Amount-by-Connocode`,
      {
        params,
      }
    );
  }

  addOverheadConsDetails(data: any) {
    return this.http.post<any>(
      `${this.api}overheadcons/add-overheadcons`,
      data
    );
  }

  addOverheadBill(data: any) {
    return this.http.post<any>(`${this.api}overheadtxn/add-overheadtxn`, data);
  }

  addOverheadDeposit(data: any) {
    return this.http.post<any>(
      `${this.api}overheaddepositdtls/add-overheaddepositdtls`,
      data
    );
  }

  //add function for excel data insert into overheadtxn
  addExcelOverheadBill(data: any) {
    return this.http.post<any>(
      `${this.api}overheadtxn/addexceldata-overheadtxn`,
      data
    );
  }

  // add location
  addLocation(data: any) {
    return this.http.post<any>(`${this.api}location/add-location`, data);
  }

  deleteoverheadBill(connocode: any, billperiod: any, supplementarybill: any) {
    let params = new HttpParams()
      .set('connocode', connocode)
      .set('billperiod', billperiod)
      .set('supplementarybill', supplementarybill);
    return this.http.delete<any>(`${this.api}overheadtxn/delete-overheadtxn`, {
      params,
    });
  }
  updateOverheadBill(data: any) {
    return this.http.put<any>(
      `${this.api}overheadtxn/update-overheadtxn`,
      data
    );
  }
  updateOVerheadDeposite(data: any) {
    return this.http.put<any>(
      `${this.api}overheaddepositdtls/update-overheaddepositdtls`,
      data
    );
  }
  updateOverheadcon(data: any) {
    return this.http.put<any>(
      `${this.api}overheadcons/update-overheadcons`,
      data
    );
  }
  //update location
  updateLocation(data: any) {
    return this.http.put<any>(`${this.api}location/update-location`, data);
  }

  retriveSingleValuefromTable(
    fetchcolumn: string,
    tableName: string,
    ColumnName: string,
    ColumnValue: string
  ) {
    let params = new HttpParams()
      .set('fetchcolumn', fetchcolumn)
      .set('tableName', tableName)
      .set('ColumnName', ColumnName)
      .set('ColumnValue', ColumnValue);
    return this.http.get<any>(
      `${this.api}generic-result/fetch-result-by-table-column`,
      {
        params,
      }
    );
  }
}
