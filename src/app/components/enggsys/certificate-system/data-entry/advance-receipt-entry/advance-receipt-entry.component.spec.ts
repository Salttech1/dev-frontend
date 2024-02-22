import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceReceiptEntryComponent } from './advance-receipt-entry.component';

describe('AdvanceReceiptEntryComponent', () => {
  let component: AdvanceReceiptEntryComponent;
  let fixture: ComponentFixture<AdvanceReceiptEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceReceiptEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceReceiptEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
