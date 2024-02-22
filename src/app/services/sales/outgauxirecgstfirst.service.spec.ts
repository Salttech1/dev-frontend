import { TestBed } from '@angular/core/testing';

import { OutgauxirecgstfirstService } from './outgauxirecgstfirst.service';

describe('OutgauxirecgstfirstService', () => {
  let service: OutgauxirecgstfirstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutgauxirecgstfirstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
