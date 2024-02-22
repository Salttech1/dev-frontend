import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjbldgService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}
  //private _successMsgSource = new Subject<boolean>();

  getBuildingDetailsByCode(id: any) {
    let params = new HttpParams().set('code', id);
    console.log('params', params);
    console.log('api ', `${this.api}building/fetch-building-by-Code`);
    return this.http.get<any>(`${this.api}building/fetch-building-by-Code`, {
      params,
    });
  }

  addBuilding(data: any) {
    return this.http.post<any>(`${this.api}building/add-building`, data);
  }

  updateBuilding(data: any) {
    return this.http.put<any>(`${this.api}building/update-building`, data);
  }

  // deleteBuilding(id: any) {
  //   let params = new HttpParams().set('brokerCode', id);
  //   return this.http.delete<any>(`${this.api}broker/delete-broker`, { params });
  // }

  //(SHAHAJI)
  //---------------------------------------Arch-------------------------------------
  getProjectByCode(id: any) {
    let params = new HttpParams().set('code', id);
    console.log('params', params);
    return this.http.get<any>(`${this.api}project/fetch-project-by-Code`, {
      params,
    });
  }

  addProject(data: any) {
    return this.http.post<any>(`${this.api}project/add-project`, data);
  }

  updateProject(data: any) {
    return this.http.put<any>(`${this.api}project/update-project`, data);
  }

   getProjectCompanyByCode(id:any) {
    let params = new HttpParams().set('code', id);
    console.log('params', params);
    return this.http.get<any>(`${this.api}building/fetch-project-coy-by-code`, {
      params,
    });
  }

  deleteFlatByBldgCodeAndWingAndFlatnum(bldgcode:any, wing:any, flatnum:any)
  {
    
    let params = new HttpParams().set('bldgCode', bldgcode)
    .set('wing', wing)
    .set('flatnum', flatnum);
    return this.http.delete<any>(`${this.api}flats/delete-flat`, {
      params,
    });

  }

}
