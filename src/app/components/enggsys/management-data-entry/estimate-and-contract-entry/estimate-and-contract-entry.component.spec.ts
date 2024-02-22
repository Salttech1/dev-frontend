import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateAndContractEntryComponent } from './estimate-and-contract-entry.component';

describe('EstimateAndContractEntryComponent', () => {
  let component: EstimateAndContractEntryComponent;
  let fixture: ComponentFixture<EstimateAndContractEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateAndContractEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateAndContractEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
