import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleexpenseDetailReportComponent } from './vehicleexpense-detail-report.component';

describe('VehicleexpenseDetailReportComponent', () => {
  let component: VehicleexpenseDetailReportComponent;
  let fixture: ComponentFixture<VehicleexpenseDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleexpenseDetailReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleexpenseDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
