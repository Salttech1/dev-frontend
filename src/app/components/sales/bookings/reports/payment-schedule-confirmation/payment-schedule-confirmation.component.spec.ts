import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentScheduleConfirmationComponent } from './payment-schedule-confirmation.component';

describe('PaymentScheduleConfirmationComponent', () => {
  let component: PaymentScheduleConfirmationComponent;
  let fixture: ComponentFixture<PaymentScheduleConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentScheduleConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentScheduleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
