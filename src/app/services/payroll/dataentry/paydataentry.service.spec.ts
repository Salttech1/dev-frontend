import { TestBed } from '@angular/core/testing';

import { PaydataentryService } from './paydataentry.service';

describe('PaydataentryService', () => {
  let service: PaydataentryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaydataentryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
