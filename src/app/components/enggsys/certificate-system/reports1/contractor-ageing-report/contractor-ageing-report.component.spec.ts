import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorAgeingReportComponent } from './contractor-ageing-report.component';

describe('ContractorAgeingReportComponent', () => {
  let component: ContractorAgeingReportComponent;
  let fixture: ComponentFixture<ContractorAgeingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorAgeingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorAgeingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
