import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeedetailsPersonalComponent } from './employeedetails-personal.component';

describe('EmployeedetailsPersonalComponent', () => {
  let component: EmployeedetailsPersonalComponent;
  let fixture: ComponentFixture<EmployeedetailsPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeedetailsPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeedetailsPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
