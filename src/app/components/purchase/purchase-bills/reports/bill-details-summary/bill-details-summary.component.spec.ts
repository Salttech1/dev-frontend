import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailsSummaryComponent } from './bill-details-summary.component';

describe('BillDetailsSummaryComponent', () => {
  let component: BillDetailsSummaryComponent;
  let fixture: ComponentFixture<BillDetailsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDetailsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
