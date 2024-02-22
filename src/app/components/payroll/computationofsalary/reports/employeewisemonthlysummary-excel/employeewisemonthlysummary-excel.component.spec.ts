import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeewisemonthlysummaryExcelComponent } from './employeewisemonthlysummary-excel.component';

describe('EmployeewisemonthlysummaryExcelComponent', () => {
  let component: EmployeewisemonthlysummaryExcelComponent;
  let fixture: ComponentFixture<EmployeewisemonthlysummaryExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeewisemonthlysummaryExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeewisemonthlysummaryExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
