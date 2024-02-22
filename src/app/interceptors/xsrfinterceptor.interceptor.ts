import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class XsrfinterceptorInterceptor implements HttpInterceptor {
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private toastr: ToastrService,
    private router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const cookieheaderName = 'X-XSRF-TOKEN';
    let csrfToken = this.tokenExtractor.getToken() as string;
    request = request.clone({
      withCredentials: true,
    });
    if (csrfToken && !request.headers.has(cookieheaderName)) {
      request = request.clone({
        headers: request.headers
          .set(cookieheaderName, csrfToken)
          .set('site', sessionStorage.getItem('site') ?? '')
          .set('userid', sessionStorage.getItem('userName') ?? '')
          .set('menucode', sessionStorage.getItem('menucode') ?? ''),
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.error instanceof ErrorEvent) {

          // client-side error
          this.toastr.error(error.error.message);
        } else {
          // server-side error
          switch (error.status) {
            case 0: //connection issue
              this.toastr.error(
                'Not able to connect server',
                'Connection Failed'
              );
              break;
            case 401: //login
              this.toastr.error(
                'Please contact Administrator',
                'Unauthorized Access'
              );
              break;
            case 403: //forbidden
              if (!this.router.url.includes('login')) {
                this.router.navigate(['/login']);
                sessionStorage.clear();
                this.toastr.error('Please login again', 'Session expired');
              }
              break;
            case 404: //Not Found
              this.toastr.error('No Data Found');
              break;
            case 500: //Server Error
              this.toastr.error('Server Internal Error', 'Failed');
              this.toastr.error(error.error.message);
              break;
            case 400: //Server Error
              break;
            default:
              this.toastr.error('Unknown error');
          }
        }
        return throwError(() => error);
      })
    );
  }
}
