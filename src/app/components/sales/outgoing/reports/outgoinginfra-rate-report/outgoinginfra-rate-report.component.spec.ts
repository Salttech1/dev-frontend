import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoinginfraRateReportComponent } from './outgoinginfra-rate-report.component';

describe('OutgoinginfraRateReportComponent', () => {
  let component: OutgoinginfraRateReportComponent;
  let fixture: ComponentFixture<OutgoinginfraRateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoinginfraRateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoinginfraRateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
