import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEntryeditComponent } from './booking-entryedit.component';

describe('BookingEntryeditComponent', () => {
  let component: BookingEntryeditComponent;
  let fixture: ComponentFixture<BookingEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
