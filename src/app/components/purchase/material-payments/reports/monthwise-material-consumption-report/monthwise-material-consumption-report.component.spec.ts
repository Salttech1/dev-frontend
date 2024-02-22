import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwiseMaterialConsumptionReportComponent } from './monthwise-material-consumption-report.component';

describe('MonthwiseMaterialConsumptionReportComponent', () => {
  let component: MonthwiseMaterialConsumptionReportComponent;
  let fixture: ComponentFixture<MonthwiseMaterialConsumptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthwiseMaterialConsumptionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthwiseMaterialConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
