import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartywiseExpenseReportComponent } from './partywise-expense-report.component';

describe('PartywiseExpenseReportComponent', () => {
  let component: PartywiseExpenseReportComponent;
  let fixture: ComponentFixture<PartywiseExpenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartywiseExpenseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartywiseExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
