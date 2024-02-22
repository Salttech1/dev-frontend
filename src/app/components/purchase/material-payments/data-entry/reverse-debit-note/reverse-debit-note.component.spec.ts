import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseDebitNoteComponent } from './reverse-debit-note.component';

describe('ReverseDebitNoteComponent', () => {
  let component: ReverseDebitNoteComponent;
  let fixture: ComponentFixture<ReverseDebitNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseDebitNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
