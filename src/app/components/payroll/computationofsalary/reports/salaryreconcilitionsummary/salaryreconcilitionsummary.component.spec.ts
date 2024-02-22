import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryreconcilitionsummaryComponent } from './salaryreconcilitionsummary.component';

describe('SalaryreconcilitionsummaryComponent', () => {
  let component: SalaryreconcilitionsummaryComponent;
  let fixture: ComponentFixture<SalaryreconcilitionsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryreconcilitionsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryreconcilitionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
