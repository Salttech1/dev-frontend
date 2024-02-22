import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessorrentService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}
  //private _successMsgSource = new Subject<boolean>();

  getPropertyByCode (id: any) {
    let params = new HttpParams().set('propcode', id);
    console.log('params', params);
    return this.http.get<any>(`${this.api}lprop/fetch-lprop-by-Propcode`, {
      params,
    });
  }

  addProperty(data: any) {
    return this.http.post<any>(`${this.api}lprop/add-lprop`, data);
  }

  updateProperty(data: any) {
    return this.http.post<any>(`${this.api}lprop/add-lprop`, data);
  }

  deleteProperty (id: any) {
    let params = new HttpParams().set('propcode', id);
    console.log('params', params);
    return this.http.delete<any>(`${this.api}lprop/delete-lprop`, {
      params,
    });
  }

  getUnitByCode (id1: any,id2: any,id3: any) {
    let params = new HttpParams().set('propcode', id1).set('unitid', id2).set('unitno', id3);
    console.log('params', params,);
    return this.http.get<any>(`${this.api}lunitdtls/fetch-lunitdtls-by-Propcode-and-Unitid-and-Unitno`, {
      params,
    });
  }

  addUnit(data: any) {
    return this.http.post<any>(`${this.api}lunitdtls/add-lunitdtls`, data);
  }

  updateUnit(data: any) {
    return this.http.put<any>(`${this.api}lunitdtls/update-lunitdtls`, data);
  }

  deleteUnit (id1: any,id2: any,id3: any) {
    let params = new HttpParams().set('propcode', id1).set('unitid', id2).set('unitno', id3);
    console.log('params', params);
    return this.http.delete<any>(`${this.api}lunitdtls/delete-lunitdtls`, {
      params,
    });
  }
}
