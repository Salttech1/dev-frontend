import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillDetailsEnquiryComponent } from './new-bill-details-enquiry.component';

describe('NewBillDetailsEnquiryComponent', () => {
  let component: NewBillDetailsEnquiryComponent;
  let fixture: ComponentFixture<NewBillDetailsEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBillDetailsEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBillDetailsEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
