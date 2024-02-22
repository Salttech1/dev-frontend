import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorWorkwiseDebitSummaryComponent } from './contractor-workwise-debit-summary.component';

describe('ContractorWorkwiseDebitSummaryComponent', () => {
  let component: ContractorWorkwiseDebitSummaryComponent;
  let fixture: ComponentFixture<ContractorWorkwiseDebitSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorWorkwiseDebitSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractorWorkwiseDebitSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
