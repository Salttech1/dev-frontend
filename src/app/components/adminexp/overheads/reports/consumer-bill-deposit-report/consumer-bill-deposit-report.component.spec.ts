import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerBillDepositReportComponent } from './consumer-bill-deposit-report.component';

describe('ConsumerBillDepositReportComponent', () => {
  let component: ConsumerBillDepositReportComponent;
  let fixture: ComponentFixture<ConsumerBillDepositReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerBillDepositReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerBillDepositReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
