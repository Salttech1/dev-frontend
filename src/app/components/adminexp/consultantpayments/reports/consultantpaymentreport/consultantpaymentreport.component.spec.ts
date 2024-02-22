import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantpaymentreportComponent } from './consultantpaymentreport.component';

describe('ConsultantpaymentreportComponent', () => {
  let component: ConsultantpaymentreportComponent;
  let fixture: ComponentFixture<ConsultantpaymentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultantpaymentreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantpaymentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
