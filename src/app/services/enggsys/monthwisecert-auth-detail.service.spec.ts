import { TestBed } from '@angular/core/testing';

import { MonthwisecertAuthDetailService } from './monthwisecert-auth-detail.service';

describe('MonthwisecertAuthDetailService', () => {
  let service: MonthwisecertAuthDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthwisecertAuthDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
