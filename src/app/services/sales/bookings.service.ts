import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  api = environment.API_URL;
  constructor(private http: HttpClient) {}

  getBrokerDetailsByCode(id: any) {
    let params = new HttpParams().set('brokerCode', id);
    return this.http.get<any>(`${this.api}broker/fetch-broker-by-Code`, {
      params,
    });
  }

  addBroker(data: any) {
    return this.http.post<any>(`${this.api}broker/add-broker`, data);
  }

  updateBroker(data: any) {
    return this.http.put<any>(`${this.api}broker/update-broker`, data);
  }

  deleteBroker(id: any) {
    let params = new HttpParams().set('brokerCode', id);
    return this.http.delete<any>(`${this.api}broker/delete-broker`, { params });
  }

  /* for Booking API*/
  getBookingDetailsBybldgcodewingflatnumownerid(
    bldgcode: any,
    wing: any,
    flatnum: any,
    ownerid: any
  ) {
    let params = new HttpParams()
      .set('bldgcode', bldgcode)
      .set('wing', wing)
      .set('flatnum', flatnum)
      .set('ownerid', ownerid);
    return this.http.get<any>(
      `${this.api}booking/fetch-booking-by-Bldgcode-and-Wing-and-Flatnum-and-Ownerid`,
      {
        params,
      }
    );
  }

  getBookingDetailsOtherOwneridAccourdingTabIndex(ownerid: any, tabindex: any) {
    let params = new HttpParams()
      .set('ownerid', ownerid)
      .set('tabindex', tabindex);
    return this.http.get<any>(
      `${this.api}booking/fetch-booking-by-CopyFrom-AccourdingTabControl`,
      {
        params,
      }
    );
  }
  getBldgcodeWingFlatnumOwneridexistsInBooking(
    bldgcode: any,
    wing: any,
    flatnum: any,
    ownerid: any
  ) {
    let params = new HttpParams()
      .set('buildingCode', bldgcode)
      .set('wing', wing)
      .set('flatnum', flatnum)
      .set('ownerid', ownerid);

    return this.http.get<any>(
      `${this.api}booking/check-Bldgcode-and-Wing-and-Flatnum-and-Ownerid-exists`,
      {
        params,
      }
    );
  }
  addBooing(data: any) {
    return this.http.post<any>(`${this.api}booking/add-booking`, data);
  }

  // updatebooking(data: any) {
  //   return this.http.put<any>(`${this.api}booking/update-booking`, data);
  // }
  updatebooking(data: any,data1: any) {
    //return this.http.put<any>(`${this.api}booking/update-booking`, data);
    const requestBody = {
      // bookingRequestBean:data,
      // bookingAltBldgRequestBean:data1,
      ...data,
      ...data1,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    //return this.http.put<any>(`${this.api}booking/update-booking1`, data);
    return this.http.put<any>(
      `${this.api}booking/update-booking`,
      requestBody,
      httpOptions
    );
  }

  // updatebooking1(data: any, data1: any) {
  //   // var originalObject = {
  //   //   data,
  //   // };
  //   // var innerObject = originalObject.data;
  //   const requestBody = {
  //     bookingRequestBean :data,
  //     bookingAltBldgRequestBean :data1,
  //   };

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   };

  //   //return this.http.put<any>(`${this.api}booking/update-booking1`, data);
  //   return this.http.put<any>(
  //     `${this.api}booking/update-booking1`,
  //     requestBody,
  //     httpOptions
  //   );
  // }

  /* end for booking API */
}
