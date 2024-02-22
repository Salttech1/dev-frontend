import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMaintenanceExpiryReportComponent } from './insurance-maintenance-expiry-report.component';

describe('InsuranceMaintenanceExpiryReportComponent', () => {
  let component: InsuranceMaintenanceExpiryReportComponent;
  let fixture: ComponentFixture<InsuranceMaintenanceExpiryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMaintenanceExpiryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceMaintenanceExpiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
