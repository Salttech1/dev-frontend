import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDebitNoteEntryComponent } from './admin-debit-note-entry.component';

describe('AdminDebitNoteEntryComponent', () => {
  let component: AdminDebitNoteEntryComponent;
  let fixture: ComponentFixture<AdminDebitNoteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDebitNoteEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDebitNoteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
