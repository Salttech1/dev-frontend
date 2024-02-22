import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCertificateEnquiryComponent } from './lc-certificate-enquiry.component';

describe('LcCertificateEnquiryComponent', () => {
  let component: LcCertificateEnquiryComponent;
  let fixture: ComponentFixture<LcCertificateEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcCertificateEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcCertificateEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
