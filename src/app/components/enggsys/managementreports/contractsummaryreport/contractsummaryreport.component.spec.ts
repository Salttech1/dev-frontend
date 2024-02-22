import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsummaryreportComponent } from './contractsummaryreport.component';

describe('ContractsummaryreportComponent', () => {
  let component: ContractsummaryreportComponent;
  let fixture: ComponentFixture<ContractsummaryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsummaryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
