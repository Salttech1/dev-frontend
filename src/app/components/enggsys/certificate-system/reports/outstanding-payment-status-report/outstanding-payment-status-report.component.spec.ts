import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPaymentStatusReportComponent } from './outstanding-payment-status-report.component';

describe('OutstandingPaymentStatusReportComponent', () => {
  let component: OutstandingPaymentStatusReportComponent;
  let fixture: ComponentFixture<OutstandingPaymentStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingPaymentStatusReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutstandingPaymentStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
