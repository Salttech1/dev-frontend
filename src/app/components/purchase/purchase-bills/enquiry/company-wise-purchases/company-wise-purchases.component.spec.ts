import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWisePurchasesComponent } from './company-wise-purchases.component';

describe('CompanyWisePurchasesComponent', () => {
  let component: CompanyWisePurchasesComponent;
  let fixture: ComponentFixture<CompanyWisePurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyWisePurchasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyWisePurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
