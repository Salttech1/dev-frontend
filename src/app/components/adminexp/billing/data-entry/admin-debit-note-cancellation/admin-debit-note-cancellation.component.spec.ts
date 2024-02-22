import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDebitNoteCancellationComponent } from './admin-debit-note-cancellation.component';

describe('AdminDebitNoteCancellationComponent', () => {
  let component: AdminDebitNoteCancellationComponent;
  let fixture: ComponentFixture<AdminDebitNoteCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDebitNoteCancellationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDebitNoteCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
