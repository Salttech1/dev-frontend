import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierDetailsReportComponent } from './supplier-details-report.component';

describe('SupplierDetailsReportComponent', () => {
  let component: SupplierDetailsReportComponent;
  let fixture: ComponentFixture<SupplierDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
