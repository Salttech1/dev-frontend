import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMeterReadingReportComponent } from './vehicle-meter-reading-report.component';

describe('VehicleMeterReadingReportComponent', () => {
  let component: VehicleMeterReadingReportComponent;
  let fixture: ComponentFixture<VehicleMeterReadingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMeterReadingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMeterReadingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
