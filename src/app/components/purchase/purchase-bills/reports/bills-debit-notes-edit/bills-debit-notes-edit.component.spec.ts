import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsDebitNotesEditComponent } from './bills-debit-notes-edit.component';

describe('BillsDebitNotesEditComponent', () => {
  let component: BillsDebitNotesEditComponent;
  let fixture: ComponentFixture<BillsDebitNotesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillsDebitNotesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsDebitNotesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
