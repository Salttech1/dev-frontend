import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryReceiptEntryEditGstFirstComponent } from './auxiliary-receipt-entry-edit-gst-first.component';

describe('AuxiliaryReceiptEntryEditGstFirstComponent', () => {
  let component: AuxiliaryReceiptEntryEditGstFirstComponent;
  let fixture: ComponentFixture<AuxiliaryReceiptEntryEditGstFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxiliaryReceiptEntryEditGstFirstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuxiliaryReceiptEntryEditGstFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
