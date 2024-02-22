import { TestBed } from '@angular/core/testing';

import { LessorrentService } from './lessorrent.service';

describe('LessorrentService', () => {
  let service: LessorrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessorrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
