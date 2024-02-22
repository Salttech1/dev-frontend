import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsByCustomerCompanyComponent } from './booking-details-by-customer-company.component';

describe('BookingDetailsByCustomerCompanyComponent', () => {
  let component: BookingDetailsByCustomerCompanyComponent;
  let fixture: ComponentFixture<BookingDetailsByCustomerCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingDetailsByCustomerCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDetailsByCustomerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
