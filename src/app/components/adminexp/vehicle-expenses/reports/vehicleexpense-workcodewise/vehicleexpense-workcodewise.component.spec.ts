import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleexpenseWorkcodewiseComponent } from './vehicleexpense-workcodewise.component';

describe('VehicleexpenseWorkcodewiseComponent', () => {
  let component: VehicleexpenseWorkcodewiseComponent;
  let fixture: ComponentFixture<VehicleexpenseWorkcodewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleexpenseWorkcodewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleexpenseWorkcodewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
