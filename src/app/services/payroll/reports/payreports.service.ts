import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayreportsService {
  api = environment.API_URL;

  constructor(private http: HttpClient) { }

  GetReportParameters(){
    return this.http.get<any>(
      `${this.api}payrollreports/reportparameters`
    );
  }

  GetGratuityMonth(empcode:string){
    // http://localhost:8080/gratuitypayment/reports/gratuitymonthbyempcode?empCode=WC501
    let params = new HttpParams().set('empCode', empcode);    
    return this.http.get<any>(
      `${this.api}gratuitypayment/reports/gratuitymonthbyempcode`, { params }
    );
  }

  CreateMonthlyPFFile(param_comanyCode:string,param_paymonth:string){
    // console.log("Coy", param_comanyCode );
    // console.log("Month", param_paymonth );
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305
    let params = new HttpParams().set('comanyCode', param_comanyCode).set('paymonth', param_paymonth);   
    return this.http.get(`${this.api}payrollreports/export-pf-report`, { params: params, responseType: 'blob' });
  }

  CreateEmpMonthlySummaryFile(pcoyCode:string,pdeptCodes:string,pempCodes:string,psalTypes:string,ppayMonth:string,ppayDate:string,pempType:string){
    // console.log("Coy", param_comanyCode );
    // console.log("Month", param_paymonth );
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305

    // coyCodes,deptCodes,empCodes,salTypes,payMonth,payDate,hotelPropYN,empType
    //(String coyCode, String deptCodes, String empCodes,
   //			String salaryTypes, String paymonth, String paymentDate, String hotelPropYN, String empType )

    let params = new HttpParams().set('coyCode', pcoyCode)
                                  .set('deptCodes', pdeptCodes)
                                  .set('empCodes', pempCodes)
                                  .set('salaryTypes', psalTypes)                                                                    
                                  .set('paymonth', ppayMonth)                                  
                                  .set('paymentDate', ppayDate)                                  
                                  .set('empType', pempType)                                  
                                  ;   
    return this.http.get(`${this.api}payrollreports/employeewise-monthly-summary`, { params: params, responseType: 'blob' });
  }

  CreateSocSalaryDetFile(param_empCodes:string,param_paymonthfrom:string,param_paymonthto:string){
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305
    let params = new HttpParams().set('empCodes', param_empCodes).set('paymonthfrom', param_paymonthfrom).set('paymonthto', param_paymonthto);   
    return this.http.get(`${this.api}payrollreports/export-socsalarydet`, { params: params, responseType: 'blob' });
  }

  CreateGrossSalaryFile(param_paymonthfrom:string){
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305
    let params = new HttpParams().set('paymonthfrom', param_paymonthfrom);   
    return this.http.get(`${this.api}payrollreports/export-grosssalary`, { params: params, responseType: 'blob' });
  }

  CreateEmpMonthlySummaryPTFile(pcoyCode:string,pdeptCodes:string,pempCodes:string,psalTypes:string,ppayMonth:string,ppayDate:string,pempType:string){
    // console.log("Coy", param_comanyCode );
    // console.log("Month", param_paymonth );
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305

    // coyCodes,deptCodes,empCodes,salTypes,payMonth,payDate,hotelPropYN,empType
    //(String coyCode, String deptCodes, String empCodes,
   //			String salaryTypes, String paymonth, String paymentDate, String hotelPropYN, String empType )

    let params = new HttpParams().set('coyCode', pcoyCode)
                                  .set('deptCodes', pdeptCodes)
                                  .set('empCodes', pempCodes)
                                  .set('salaryTypes', psalTypes)                                                                    
                                  .set('paymonth', ppayMonth)                                  
                                  .set('paymentDate', ppayDate)                                  
                                  .set('empType', pempType)                                  
                                  ;   
    return this.http.get(`${this.api}payrollreports/employeewise-monthly-summary-pt`, { params: params, responseType: 'blob' });
  }

  CreateBankAdviceFile(pcoyCode:string,psalTypes:string,ppayMonth:string,ppayDate:string,pbankCode:string,pempType:string){
    // console.log("Coy", param_comanyCode );
    // console.log("Month", param_paymonth );
    // http://localhost:8080/payrollreports/export-pf-report?comanyCode=FEHO&paymonth=202305

    // coyCodes,deptCodes,empCodes,salTypes,payMonth,payDate,hotelPropYN,empType
    //(String coyCode, String deptCodes, String empCodes,
   //			String salaryTypes, String paymonth, String paymentDate, String hotelPropYN, String empType )

    let params = new HttpParams().set('coyCode', pcoyCode)
                                  .set('salaryTypes', psalTypes)                                                                    
                                  .set('paymonth', ppayMonth)                                  
                                  .set('paymentDate', ppayDate)                                  
                                  .set('bankCode', pbankCode)                                                                    
                                  .set('empType', pempType)                                  
                                  ;   
    return this.http.get(`${this.api}payrollreports/bank-advice`, { params: params, responseType: 'blob' });
  }

  CreateEmployeeSalaryDetails(pcoyCode:string,pempFrom:string,pempTo:string,pdeptFrom:string,pdeptTo:string,ppayDate:string){
  let params = new HttpParams().set('coyCode', pcoyCode)
  .set('empFrom', pempFrom)
  .set('empTo', pempTo)
  .set('deptFrom', pdeptFrom)
  .set('deptTo', pdeptTo)
  .set('payDate', ppayDate)
  ;
return this.http.get(`${this.api}payrollreports/employee-salary-details`, { params: params, responseType: 'blob' });
}

}
