import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeedetailsentryeditComponent } from './employeedetailsentryedit.component';

describe('EmployeedetailsentryeditComponent', () => {
  let component: EmployeedetailsentryeditComponent;
  let fixture: ComponentFixture<EmployeedetailsentryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeedetailsentryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeedetailsentryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
