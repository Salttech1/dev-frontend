import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaydataentryService {
  api: String = environment.API_URL;


  constructor(private http: HttpClient) { }

  getBloodgroupList() {
    let params = new HttpParams().set('clazz', 'BGPTY');
    return this.http.get(`${environment.API_URL}entity/fetch-by-class`, {
      params,
    });
  }

  getRegionList() {
    let params = new HttpParams().set('clazz', 'REGNS');
    return this.http.get(`${environment.API_URL}entity/fetch-by-class`, {
      params,
    });
  }

  retrieveEmployeeDetails(empcode:string){
    let params = new HttpParams().set('empcode', empcode);
    return this.http.get(`${environment.API_URL}payroll/masterDetail-EntryEdit`, {
      params,
    }); 
  }

  insertEmployeeDetails(payload:any){
    return this.http.post(
      `${environment.API_URL}payroll/add-empdetails`,payload
    );
  }

  updateNewEmployeeDetails(payload:any){
    return this.http.post(
      `${environment.API_URL}payroll/updateNew-empdetails`,payload
    );
  }

  fetchSalaryPackageDetails(empcode:string,currentAll:string){
    let params = new HttpParams().set('empcode', empcode).set('currentAll',currentAll);
    return this.http.get(`${environment.API_URL}payroll/salarypackageDetail`, {
      params,
    }); 
  }

  fetchCoySalaryPackageDetails(coycode:string){
    let params = new HttpParams().set('coycode', coycode);
    return this.http.get(`${environment.API_URL}payroll/companypackageDetails`, {
      params,
    }); 
  }

  fetchCompanySalDedPackage(coycode:string){
    let params = new HttpParams().set('coycode', coycode);
    return this.http.get(`${environment.API_URL}payroll/companypackageDedDetails`, {
      params,
    }); 
  }

  fetchCompanySchemeDetails(coycode:string, joinpaymonth:string){
    let params = new HttpParams().set('coycode', coycode).set('joinpaymonth',joinpaymonth);
    return this.http.get(`${environment.API_URL}payroll/companySchemeDetails`, {
      params,
    }); 
  }

  fetchCompanyLeaveDetails(coycode:string, joindate:string, emptype:string){
    let params = new HttpParams().set('coycode', coycode).set('joindate',joindate).set('emptype',emptype);
    return this.http.get(`${environment.API_URL}payroll/companyLeaveDetails`, {
      params,
    }); 
  }

}
