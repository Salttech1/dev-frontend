import { TestBed } from '@angular/core/testing';

import { VehicleexpService } from './vehicleexp.service';

describe('VehicleexpService', () => {
  let service: VehicleexpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleexpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
