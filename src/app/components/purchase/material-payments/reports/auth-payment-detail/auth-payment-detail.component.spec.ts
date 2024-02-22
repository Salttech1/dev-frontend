import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPaymentDetailComponent } from './auth-payment-detail.component';

describe('AuthPaymentDetailComponent', () => {
  let component: AuthPaymentDetailComponent;
  let fixture: ComponentFixture<AuthPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
