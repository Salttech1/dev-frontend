import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesalarycomputationComponent } from './employeesalarycomputation.component';

describe('EmployeesalarycomputationComponent', () => {
  let component: EmployeesalarycomputationComponent;
  let fixture: ComponentFixture<EmployeesalarycomputationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesalarycomputationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesalarycomputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
