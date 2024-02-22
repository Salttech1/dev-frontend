import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstDebitNotesEntryComponent } from './gst-debit-notes-entry.component';

describe('GstDebitNotesEntryComponent', () => {
  let component: GstDebitNotesEntryComponent;
  let fixture: ComponentFixture<GstDebitNotesEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstDebitNotesEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstDebitNotesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
