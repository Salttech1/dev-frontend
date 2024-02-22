import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingSummaryReportComponent } from './outgoing-summary-report.component';

describe('OutgoingSummaryReportComponent', () => {
  let component: OutgoingSummaryReportComponent;
  let fixture: ComponentFixture<OutgoingSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
