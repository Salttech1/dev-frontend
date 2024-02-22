import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankwiseLoanStatementComponent } from './bankwise-loan-statement.component';

describe('BankwiseLoanStatementComponent', () => {
  let component: BankwiseLoanStatementComponent;
  let fixture: ComponentFixture<BankwiseLoanStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankwiseLoanStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankwiseLoanStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
