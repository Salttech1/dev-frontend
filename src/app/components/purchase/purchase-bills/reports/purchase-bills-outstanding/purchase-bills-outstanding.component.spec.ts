import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillsOutstandingComponent } from './purchase-bills-outstanding.component';

describe('PurchaseBillsOutstandingComponent', () => {
  let component: PurchaseBillsOutstandingComponent;
  let fixture: ComponentFixture<PurchaseBillsOutstandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseBillsOutstandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBillsOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
