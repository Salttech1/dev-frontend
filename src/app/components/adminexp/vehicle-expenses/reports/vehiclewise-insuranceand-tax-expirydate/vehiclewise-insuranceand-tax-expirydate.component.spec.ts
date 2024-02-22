import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclewiseInsuranceandTaxExpirydateComponent } from './vehiclewise-insuranceand-tax-expirydate.component';

describe('VehiclewiseInsuranceandTaxExpirydateComponent', () => {
  let component: VehiclewiseInsuranceandTaxExpirydateComponent;
  let fixture: ComponentFixture<VehiclewiseInsuranceandTaxExpirydateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclewiseInsuranceandTaxExpirydateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclewiseInsuranceandTaxExpirydateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
