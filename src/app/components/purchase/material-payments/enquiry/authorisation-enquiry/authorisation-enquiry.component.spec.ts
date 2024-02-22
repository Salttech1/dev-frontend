import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationEnquiryComponent } from './authorisation-enquiry.component';

describe('AuthorisationEnquiryComponent', () => {
  let component: AuthorisationEnquiryComponent;
  let fixture: ComponentFixture<AuthorisationEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
