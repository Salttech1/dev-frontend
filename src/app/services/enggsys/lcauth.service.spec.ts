import { TestBed } from '@angular/core/testing';

import { LcauthService } from './lcauth.service';

describe('LcauthService', () => {
  let service: LcauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
