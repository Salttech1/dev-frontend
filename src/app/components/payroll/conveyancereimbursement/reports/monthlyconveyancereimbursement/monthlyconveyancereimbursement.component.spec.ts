import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyconveyancereimbursementComponent } from './monthlyconveyancereimbursement.component';

describe('MonthlyconveyancereimbursementComponent', () => {
  let component: MonthlyconveyancereimbursementComponent;
  let fixture: ComponentFixture<MonthlyconveyancereimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyconveyancereimbursementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyconveyancereimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
