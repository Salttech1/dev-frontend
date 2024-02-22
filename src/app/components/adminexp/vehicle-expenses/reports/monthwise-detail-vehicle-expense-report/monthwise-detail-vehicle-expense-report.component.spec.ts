import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwiseDetailVehicleExpenseReportComponent } from './monthwise-detail-vehicle-expense-report.component';

describe('MonthwiseDetailVehicleExpenseReportComponent', () => {
  let component: MonthwiseDetailVehicleExpenseReportComponent;
  let fixture: ComponentFixture<MonthwiseDetailVehicleExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthwiseDetailVehicleExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthwiseDetailVehicleExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
