import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdvancePaymentComponent } from './admin-advance-payment.component';

describe('AdminAdvancePaymentComponent', () => {
  let component: AdminAdvancePaymentComponent;
  let fixture: ComponentFixture<AdminAdvancePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAdvancePaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
