import { TestBed } from '@angular/core/testing';

import { ManagementreportsService } from './managementreports.service';

describe('ManagementreportsService', () => {
  let service: ManagementreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
