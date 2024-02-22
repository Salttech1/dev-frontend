import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanreportEmployeewiseComponent } from './loanreport-employeewise.component';

describe('LoanreportEmployeewiseComponent', () => {
  let component: LoanreportEmployeewiseComponent;
  let fixture: ComponentFixture<LoanreportEmployeewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanreportEmployeewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanreportEmployeewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
