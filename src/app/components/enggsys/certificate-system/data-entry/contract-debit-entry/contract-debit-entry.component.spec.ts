import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDebitEntryComponent } from './contract-debit-entry.component';

describe('ContractDebitEntryComponent', () => {
  let component: ContractDebitEntryComponent;
  let fixture: ComponentFixture<ContractDebitEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDebitEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDebitEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
