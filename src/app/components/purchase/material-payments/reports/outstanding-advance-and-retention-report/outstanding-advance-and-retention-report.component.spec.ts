import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingAdvanceAndRetentionReportComponent } from './outstanding-advance-and-retention-report.component';

describe('OutstandingAdvanceAndRetentionReportComponent', () => {
  let component: OutstandingAdvanceAndRetentionReportComponent;
  let fixture: ComponentFixture<OutstandingAdvanceAndRetentionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingAdvanceAndRetentionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutstandingAdvanceAndRetentionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
