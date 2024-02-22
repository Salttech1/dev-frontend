import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as constants from '../../constants/constant';
import { environment } from 'src/environments/environment';
import { ServiceService } from './service.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CommonReportsService {
  constructor(private http: HttpClient, private _service: ServiceService) {}

  getParameterizedReport(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.paramReport}`,
      body,
      { responseType: 'blob' }
    );
  }

  addIntoAgeingTempTable(body: any) {
    return this.http.post(
      `${environment.API_URL}purchase-bills/add-into-ageing-temp-table`,
      body
    );
  }

  getParameterizedReportWithCondition(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.paramReportWithCondition}`,
      body,
      { responseType: 'blob' }
    );
  }

  reqParameterizedReportWithCondition(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.paramReportWithCondition}`,
      body
    );
  }

  getParameterizedReportWithMultipleConditionAndParameter(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.paramReportWithMultipleConditionAndParameter}`,
      body,
      { responseType: 'blob' }
    );
  }

  getParameterizedPrintReport(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.paramReport}`,
      body
    );
  }

  getReportName() {
    let reportName = this._service.dataOnRoute.breadcrumb
      .slice(-1)
      .pop()
      .toLowerCase()
      .replace(/\/|\\|\s/g, '');
    let filename = reportName + '_' + moment().format('YYYYMMDD_HH_mm_ss');
    return filename;
  }

  getTtxParameterizedReport(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReport}`,
      body,
      { responseType: 'blob' }
    );
  }

  getTtxParameterizedReportWithCondition(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReportWithCondition}`,
      body,
      { responseType: 'blob' }
    );
  }

  reqGetTtxParameterizedReportWithCondition(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReportWithCondition}`,
      body
    );
  }

  reportRequest(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReport}`,
      body
    );
  }

  getTtxParameterizedPrintReport(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReport}`,
      body
    );
  }

  getTtxParameterizedPrintReportWithCondition(body: any) {
    return this.http.post(
      `${environment.API_URL}${constants.api_url.ttxParamReportWithCondition}`,
      body
    );
  }

  getReport() {
    return this.http.get(
      `${environment.API_URL}report/fetch-report-job-transaction-by-status-and-userid`
    );
  }

  downloadReport(id: number) {
    let params = new HttpParams().set('reportJobTransactionId', id);
    return this.http.get(
      `${environment.API_URL}report/fetch-report-job-transaction-by-reportid`,
      { params, responseType: 'blob' }
    );
  }

  deleteReport(id: number) {
    let params = new HttpParams().set('reportJobTransactionId', id);
    return this.http.delete(
      `${environment.API_URL}report/delete-report-job-transaction-by-reportid`,
      { params }
    );
  }

  getCodeHelp(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.get(
      `${environment.API_URL}material-payments/fetch-code-help-detail`,
      { params }
    );
  }

  fetchTransDate(body: any) {
    return this.http.post(
      `${environment.API_URL}fd-report/fetch-max-trandate-by-transernos`,
      body
    );
  }
}
