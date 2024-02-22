import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementpaymentComponent } from './reimbursementpayment.component';

describe('ReimbursementpaymentComponent', () => {
  let component: ReimbursementpaymentComponent;
  let fixture: ComponentFixture<ReimbursementpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementpaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
