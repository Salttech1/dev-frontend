import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGstPurchaseBillEntryComponent } from './new-gst-purchase-bill-entry.component';

describe('NewGstPurchaseBillEntryComponent', () => {
  let component: NewGstPurchaseBillEntryComponent;
  let fixture: ComponentFixture<NewGstPurchaseBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGstPurchaseBillEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGstPurchaseBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
