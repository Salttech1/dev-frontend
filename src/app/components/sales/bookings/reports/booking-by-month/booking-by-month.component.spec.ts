import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingByMonthComponent } from './booking-by-month.component';

describe('BookingByMonthComponent', () => {
  let component: BookingByMonthComponent;
  let fixture: ComponentFixture<BookingByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingByMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
