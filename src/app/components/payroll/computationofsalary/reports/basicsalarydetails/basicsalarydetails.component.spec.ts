import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicsalarydetailsComponent } from './basicsalarydetails.component';

describe('BasicsalarydetailsComponent', () => {
  let component: BasicsalarydetailsComponent;
  let fixture: ComponentFixture<BasicsalarydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicsalarydetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicsalarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
