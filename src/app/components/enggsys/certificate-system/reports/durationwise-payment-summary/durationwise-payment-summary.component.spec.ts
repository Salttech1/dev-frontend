import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationwisePaymentSummaryComponent } from './durationwise-payment-summary.component';

describe('DurationwisePaymentSummaryComponent', () => {
  let component: DurationwisePaymentSummaryComponent;
  let fixture: ComponentFixture<DurationwisePaymentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationwisePaymentSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationwisePaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
