import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthwisecertAuthDetailService {

  api = environment.API_URL;

  constructor(private http: HttpClient) { }

  GetReportParameters(){
    return this.http.get<any>(
      `${this.api}monthwisecertAuthDetail/reportparameters`
    );
  }
}
