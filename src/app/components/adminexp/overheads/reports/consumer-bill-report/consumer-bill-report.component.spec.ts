import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerBillReportComponent } from './consumer-bill-report.component';

describe('ConsumerBillReportComponent', () => {
  let component: ConsumerBillReportComponent;
  let fixture: ComponentFixture<ConsumerBillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerBillReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerBillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
