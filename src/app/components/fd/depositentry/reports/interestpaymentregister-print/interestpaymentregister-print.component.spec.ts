import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestpaymentregisterPrintComponent } from './interestpaymentregister-print.component';

describe('InterestpaymentregisterPrintComponent', () => {
  let component: InterestpaymentregisterPrintComponent;
  let fixture: ComponentFixture<InterestpaymentregisterPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestpaymentregisterPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestpaymentregisterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
