import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeedetailsphotoComponent } from './employeedetailsphoto.component';

describe('EmployeedetailsphotoComponent', () => {
  let component: EmployeedetailsphotoComponent;
  let fixture: ComponentFixture<EmployeedetailsphotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeedetailsphotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeedetailsphotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
