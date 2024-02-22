import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDebitReportComponent } from './contract-debit-report.component';

describe('ContractDebitReportComponent', () => {
  let component: ContractDebitReportComponent;
  let fixture: ComponentFixture<ContractDebitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDebitReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDebitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
