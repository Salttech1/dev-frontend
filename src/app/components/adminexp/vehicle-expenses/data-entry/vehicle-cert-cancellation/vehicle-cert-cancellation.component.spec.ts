import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCertCancellationComponent } from './vehicle-cert-cancellation.component';

describe('VehicleCertCancellationComponent', () => {
  let component: VehicleCertCancellationComponent;
  let fixture: ComponentFixture<VehicleCertCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleCertCancellationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCertCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
