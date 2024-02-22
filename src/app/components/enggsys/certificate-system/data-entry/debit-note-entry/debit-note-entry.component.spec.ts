import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNoteEntryComponent } from './debit-note-entry.component';

describe('DebitNoteEntryComponent', () => {
  let component: DebitNoteEntryComponent;
  let fixture: ComponentFixture<DebitNoteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitNoteEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitNoteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
