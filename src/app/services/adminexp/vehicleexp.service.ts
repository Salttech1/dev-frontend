// Developed By  -
// Developed on - 05-01-23
// Mode  - Data Entry
// Service Name - VehicleexpService
// Purpose -
// Modification Details
// =======================================================================================================================================================
// Date		Author  Version User    Reason
// =======================================================================================================================================================

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class VehicleexpService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}

  getEquipDetailsByEqptypeAndEqpnum(
    eqptype: string,
    eqpnum: string
  ) {
    let params = new HttpParams().set('eqptype', eqptype).set('eqpnum', eqpnum);
    return this.http.get<any>(
      `${this.api}equip/fetch-equip-by-Eqptype-and-Eqpnum`,
      { params }
    );
  }

  addEquip(data: any) {
    return this.http.post<any>(`${this.api}equip/add-equip`, data);
  }

  updateEquip(data: any) {
    return this.http.put<any>(`${this.api}equip/update-equip`, data);
  }

  deleteEquip(
    eqptype: string,

    eqpnum: string
  ) {
    let params = new HttpParams().set('eqpEqpnum', eqpnum);
    return this.http.delete<any>(`${this.api}equip/delete-equip`, { params });
  }

  getEquipPropByCoy(APIUrl: string){
    return this.http.get<any>(`${environment.API_URL}${APIUrl}`);
  }


  fetchNum1ByClassAndId(
    Class : string, id: string
  ){
    let params = new HttpParams().set('clazz',Class).set('id',id)
    return this.http.get<any>(
      `${this.api}entity/fetch-num1-by-class-and-id`,{params}
    );
  }

  checkEqptypeAndEqpnumExists(
    eqptype: string,
    eqpnum: string
  ){
    let params = new HttpParams().set('eqptype', eqptype).set('eqpnum', eqpnum);
    return this.http.get<any>(
      `${this.api}equip/check-Eqptype-and-Eqpnum-exists`,{params}
    );
  }

  getAdmexphDetailsByCertnumAndCoyAndCerttype(
    certnum: string,
    equipid: string
  ){
    let params = new HttpParams().set('certnum', certnum).set('equipid', equipid);
    return this.http.get<any>(
      `${this.api}admexph/fetch-admexph-by-Certnum-and-Equipid`,{params}
    );
  }

  updateAdmexph(data:any){
    return this.http.put<any>(
      `${this.api}admexph/update-admexph`,data
    );
  }

  addAdmexph(data: any) {
    return this.http.post<any>(`${this.api}admexph/add-admexph`, data);
  }
  
  passVehicleCert(data: any) {
    return this.http.post<any>(`${this.api}admexph/pass-vehiclecert`, data);
  }

  findByEquipid(
    eqpnum: string
  ) {
    let params = new HttpParams().set('equipid', eqpnum);
    return this.http.get<any>(
      `${this.api}admexph/fetch-unposted-Cert-by-Equipid`,
      { params }
    );
  }

  updatecancelUnPostedCertificateAdmexph(
    certnum:string,
    transer:string
  ){
    let params = new HttpParams().set('certnum', certnum).set('transer', transer);
    return this.http.put<any>(
      `${this.api}admexph/cancel-unposted-certificate`,{},{params}
    );
  }

}
