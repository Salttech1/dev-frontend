import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeebirthdayComponent } from './employeebirthday.component';

describe('EmployeebirthdayComponent', () => {
  let component: EmployeebirthdayComponent;
  let fixture: ComponentFixture<EmployeebirthdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeebirthdayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeebirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
