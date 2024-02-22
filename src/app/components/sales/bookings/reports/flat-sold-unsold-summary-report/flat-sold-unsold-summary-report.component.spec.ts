import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSoldUnsoldSummaryReportComponent } from './flat-sold-unsold-summary-report.component';

describe('FlatSoldUnsoldSummaryReportComponent', () => {
  let component: FlatSoldUnsoldSummaryReportComponent;
  let fixture: ComponentFixture<FlatSoldUnsoldSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatSoldUnsoldSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatSoldUnsoldSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
