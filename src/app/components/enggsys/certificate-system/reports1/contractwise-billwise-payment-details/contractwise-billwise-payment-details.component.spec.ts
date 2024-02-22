import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractwiseBillwisePaymentDetailsComponent } from './contractwise-billwise-payment-details.component';

describe('ContractwiseBillwisePaymentDetailsComponent', () => {
  let component: ContractwiseBillwisePaymentDetailsComponent;
  let fixture: ComponentFixture<ContractwiseBillwisePaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractwiseBillwisePaymentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractwiseBillwisePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
