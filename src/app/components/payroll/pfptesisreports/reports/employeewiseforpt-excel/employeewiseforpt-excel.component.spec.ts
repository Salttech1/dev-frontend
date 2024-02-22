import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeewiseforptExcelComponent } from './employeewiseforpt-excel.component';

describe('EmployeewiseforptExcelComponent', () => {
  let component: EmployeewiseforptExcelComponent;
  let fixture: ComponentFixture<EmployeewiseforptExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeewiseforptExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeewiseforptExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
