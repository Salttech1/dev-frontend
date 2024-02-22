import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAuthorisationEnquiryComponent } from './lc-authorisation-enquiry.component';

describe('LcAuthorisationEnquiryComponent', () => {
  let component: LcAuthorisationEnquiryComponent;
  let fixture: ComponentFixture<LcAuthorisationEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcAuthorisationEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcAuthorisationEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
