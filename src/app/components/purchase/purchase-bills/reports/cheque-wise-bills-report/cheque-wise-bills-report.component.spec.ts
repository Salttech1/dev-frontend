import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeWiseBillsReportComponent } from './cheque-wise-bills-report.component';

describe('ChequeWiseBillsReportComponent', () => {
  let component: ChequeWiseBillsReportComponent;
  let fixture: ComponentFixture<ChequeWiseBillsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeWiseBillsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeWiseBillsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
