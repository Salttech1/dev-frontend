import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillAdjustmentComponent } from './purchase-bill-adjustment.component';

describe('PurchaseBillAdjustmentComponent', () => {
  let component: PurchaseBillAdjustmentComponent;
  let fixture: ComponentFixture<PurchaseBillAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBillAdjustmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBillAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
