import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryreconciliationstatementComponent } from './salaryreconciliationstatement.component';

describe('SalaryreconciliationstatementComponent', () => {
  let component: SalaryreconciliationstatementComponent;
  let fixture: ComponentFixture<SalaryreconciliationstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryreconciliationstatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryreconciliationstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
