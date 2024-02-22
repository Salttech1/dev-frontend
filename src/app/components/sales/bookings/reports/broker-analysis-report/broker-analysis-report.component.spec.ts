import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAnalysisReportComponent } from './broker-analysis-report.component';

describe('BrokerAnalysisReportComponent', () => {
  let component: BrokerAnalysisReportComponent;
  let fixture: ComponentFixture<BrokerAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerAnalysisReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
