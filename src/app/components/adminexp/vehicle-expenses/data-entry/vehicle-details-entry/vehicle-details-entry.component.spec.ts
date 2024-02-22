import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsEntryComponent } from './vehicle-details-entry.component';

describe('VehicleDetailsEntryComponent', () => {
  let component: VehicleDetailsEntryComponent;
  let fixture: ComponentFixture<VehicleDetailsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
