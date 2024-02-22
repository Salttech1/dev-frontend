import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoceitysalarydetailsComponent } from './soceitysalarydetails.component';

describe('SoceitysalarydetailsComponent', () => {
  let component: SoceitysalarydetailsComponent;
  let fixture: ComponentFixture<SoceitysalarydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoceitysalarydetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoceitysalarydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
