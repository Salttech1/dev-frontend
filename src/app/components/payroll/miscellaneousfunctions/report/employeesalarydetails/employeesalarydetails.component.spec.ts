import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesalarydetailsComponent } from './employeesalarydetails.component';

describe('EmployeesalarydetailsComponent', () => {
  let component: EmployeesalarydetailsComponent;
  let fixture: ComponentFixture<EmployeesalarydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesalarydetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesalarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
