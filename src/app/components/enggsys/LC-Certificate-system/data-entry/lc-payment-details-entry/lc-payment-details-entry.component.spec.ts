import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcPaymentDetailsEntryComponent } from './lc-payment-details-entry.component';

describe('LcPaymentDetailsEntryComponent', () => {
  let component: LcPaymentDetailsEntryComponent;
  let fixture: ComponentFixture<LcPaymentDetailsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcPaymentDetailsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcPaymentDetailsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
