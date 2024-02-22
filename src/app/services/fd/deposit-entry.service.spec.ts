import { TestBed } from '@angular/core/testing';

import { DepositEntryService } from './deposit-entry.service';

describe('DepositEntryService', () => {
  let service: DepositEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
