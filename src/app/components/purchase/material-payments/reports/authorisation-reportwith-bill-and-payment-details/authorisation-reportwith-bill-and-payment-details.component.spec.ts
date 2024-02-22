import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationReportwithBillAndPaymentDetailsComponent } from './authorisation-reportwith-bill-and-payment-details.component';

describe('AuthorisationReportwithBillAndPaymentDetailsComponent', () => {
  let component: AuthorisationReportwithBillAndPaymentDetailsComponent;
  let fixture: ComponentFixture<AuthorisationReportwithBillAndPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationReportwithBillAndPaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationReportwithBillAndPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
