import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSoldUnsoldSummaryReportNewComponent } from './flat-sold-unsold-summary-report-new.component';

describe('FlatSoldUnsoldSummaryReportNewComponent', () => {
  let component: FlatSoldUnsoldSummaryReportNewComponent;
  let fixture: ComponentFixture<FlatSoldUnsoldSummaryReportNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatSoldUnsoldSummaryReportNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatSoldUnsoldSummaryReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
