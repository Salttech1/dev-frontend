import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentreciptdetailsComponent } from './paymentreciptdetails.component';

describe('PaymentreciptdetailsComponent', () => {
  let component: PaymentreciptdetailsComponent;
  let fixture: ComponentFixture<PaymentreciptdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentreciptdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentreciptdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
