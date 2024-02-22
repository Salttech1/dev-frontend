import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAverageReportComponent } from './vehicle-average-report.component';

describe('VehicleAverageReportComponent', () => {
  let component: VehicleAverageReportComponent;
  let fixture: ComponentFixture<VehicleAverageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleAverageReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAverageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
