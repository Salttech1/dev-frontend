import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdvancePaymentPassingComponent } from './admin-advance-payment-passing.component';

describe('AdminAdvancePaymentPassingComponent', () => {
  let component: AdminAdvancePaymentPassingComponent;
  let fixture: ComponentFixture<AdminAdvancePaymentPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAdvancePaymentPassingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdvancePaymentPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
