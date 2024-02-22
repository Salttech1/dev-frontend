import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesalarypackageComponent } from './employeesalarypackage.component';

describe('EmployeesalarypackageComponent', () => {
  let component: EmployeesalarypackageComponent;
  let fixture: ComponentFixture<EmployeesalarypackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesalarypackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesalarypackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
