import { TestBed } from '@angular/core/testing';

import { ProjbldgService } from './projbldg.service';

describe('ProjbldgService', () => {
  let service: ProjbldgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjbldgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
