import { TestBed } from '@angular/core/testing';

import { XsrfinterceptorInterceptor } from './xsrfinterceptor.interceptor';

describe('XsrfinterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      XsrfinterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: XsrfinterceptorInterceptor = TestBed.inject(XsrfinterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
