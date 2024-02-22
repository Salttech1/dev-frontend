import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantpaymentvoucherreceiptprintComponent } from './consultantpaymentvoucherreceiptprint.component';

describe('ConsultantpaymentvoucherreceiptprintComponent', () => {
  let component: ConsultantpaymentvoucherreceiptprintComponent;
  let fixture: ComponentFixture<ConsultantpaymentvoucherreceiptprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultantpaymentvoucherreceiptprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantpaymentvoucherreceiptprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
