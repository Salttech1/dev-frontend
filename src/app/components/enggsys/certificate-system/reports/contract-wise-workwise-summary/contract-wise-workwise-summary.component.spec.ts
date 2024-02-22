import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractWiseWorkwiseSummaryComponent } from './contract-wise-workwise-summary.component';

describe('ContractWiseWorkwiseSummaryComponent', () => {
  let component: ContractWiseWorkwiseSummaryComponent;
  let fixture: ComponentFixture<ContractWiseWorkwiseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractWiseWorkwiseSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractWiseWorkwiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
