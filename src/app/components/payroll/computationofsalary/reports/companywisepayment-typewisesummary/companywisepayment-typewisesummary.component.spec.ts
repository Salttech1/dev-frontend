import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywisepaymentTypewisesummaryComponent } from './companywisepayment-typewisesummary.component';

describe('CompanywisepaymentTypewisesummaryComponent', () => {
  let component: CompanywisepaymentTypewisesummaryComponent;
  let fixture: ComponentFixture<CompanywisepaymentTypewisesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanywisepaymentTypewisesummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanywisepaymentTypewisesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
