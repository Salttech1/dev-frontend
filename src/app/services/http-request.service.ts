import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  constructor(private http: HttpClient) { }
  baseURL = environment.API_URL;

  request(
    requestType: string,
    requestURL: string,
    requestBody: any,
    parmsObject?: any
  ): any {
    let params = new HttpParams();

    for (const key in parmsObject) {
      if (parmsObject.hasOwnProperty(key)) {
        params = params.set(key, parmsObject[key]);
      }
    }
    // for get request..
    if (requestType === 'get') {
      return this.http.get(this.baseURL + requestURL, { params });
    }

    // for post request(adding)..
    if (requestType === 'post') {
      return this.http.post(this.baseURL + requestURL, requestBody, { params });
    }

    // for put request(updating with all required values)..
    if (requestType === 'put') {
      return this.http.put(this.baseURL + requestURL, requestBody, { params });
    }

    // for patch request(updating with specific values)..
    if (requestType === 'patch') {
      return this.http.patch(this.baseURL + requestURL, requestBody, { params });
    }

    // for delete request..
    if (requestType === 'delete') {
      return this.http.delete(this.baseURL + requestURL, { params });
    }
  }

  reportRequest(requestType: string, requestURL: string, body: any, params: any) : any{
    if (requestType == 'get') {
      return this.http.get(
        this.baseURL + requestURL,
        { params, responseType: 'blob' }
      );
    }else{
      return
    }
  }
}
