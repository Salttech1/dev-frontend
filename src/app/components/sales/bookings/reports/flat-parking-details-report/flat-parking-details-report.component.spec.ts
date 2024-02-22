import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatParkingDetailsReportComponent } from './flat-parking-details-report.component';

describe('FlatParkingDetailsReportComponent', () => {
  let component: FlatParkingDetailsReportComponent;
  let fixture: ComponentFixture<FlatParkingDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatParkingDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatParkingDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
