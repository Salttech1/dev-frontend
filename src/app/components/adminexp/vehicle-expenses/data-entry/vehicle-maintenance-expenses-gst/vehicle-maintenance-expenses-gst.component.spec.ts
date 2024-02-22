import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMaintenanceExpensesGstComponent } from './vehicle-maintenance-expenses-gst.component';

describe('VehicleMaintenanceExpensesGstComponent', () => {
  let component: VehicleMaintenanceExpensesGstComponent;
  let fixture: ComponentFixture<VehicleMaintenanceExpensesGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleMaintenanceExpensesGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMaintenanceExpensesGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
