import { TestBed } from '@angular/core/testing';

import { PayreportsService } from './payreports.service';

describe('PayreportsService', () => {
  let service: PayreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
