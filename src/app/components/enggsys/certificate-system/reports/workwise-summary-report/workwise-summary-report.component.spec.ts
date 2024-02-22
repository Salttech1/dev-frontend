import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwiseSummaryReportComponent } from './workwise-summary-report.component';

describe('WorkwiseSummaryReportComponent', () => {
  let component: WorkwiseSummaryReportComponent;
  let fixture: ComponentFixture<WorkwiseSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkwiseSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkwiseSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
