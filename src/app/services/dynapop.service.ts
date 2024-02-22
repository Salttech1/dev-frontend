import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as constants from '../../constants/constant';

@Injectable({
  providedIn: 'root',
})
export class DynapopService {
  constructor(private http: HttpClient) {}

  getDynaPopListObj(dynapopIdVal: any, fromRequestVal: any) {
    let params = new HttpParams()
      .set('dynaPopId', `${dynapopIdVal}`)
      .set('queryConditon', `${fromRequestVal}`);
    return this.http.get(`${environment.API_URL}${constants.dynapop}`, {
      params,
    });
  }

  getDynaPopSearchListObj(
    dynapopIdVal: any,
    fromRequestVal: any,
    searchText: string
  ) {
    let params = new HttpParams()
      .set('dynaPopId', `${dynapopIdVal}`)
      .set('queryConditon', `${fromRequestVal}`)
      .set('searchText', `${searchText}`);
    return this.http.get(
      `${environment.API_URL}${constants.dynapop}${constants.dynapopSearch}`,
      { params }
    );
  }

  getDynaPopBySearch(searchPara: any) {
    let params = new HttpParams();
    Object.keys(searchPara).forEach((key: any) => {
      params = params.append(key, searchPara[key]);
    });
    return this.http.get(
      `${environment.API_URL}${constants.dynapop}${constants.dynapopSearch}`,
      { params }
    );
  }

  getGst(data: any) {
    let params = new HttpParams({ fromObject: data });
    return this.http.get(`${environment.API_URL}common-gst/fetch-gst-perc`, {
      params,
    });
  }

  updateFav(favouriteRequestBeanList:any){
   // let params = new HttpParams({ fromObject: data });
    return this.http.put(`${environment.API_URL}menu/update-favourite`, {
      favouriteRequestBeanList,
    });
  }

  // fetchMenu(){
  //   var payload = { username: `${sessionStorage.getItem('userName')}` };
  //   return this.http
  //     .post(`${environment.API_URL}menu/fetch-menu`, payload)
  // }
}
