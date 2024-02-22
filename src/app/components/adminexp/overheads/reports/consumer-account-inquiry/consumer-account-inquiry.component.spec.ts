import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccountInquiryComponent } from './consumer-account-inquiry.component';

describe('ConsumerAccountInquiryComponent', () => {
  let component: ConsumerAccountInquiryComponent;
  let fixture: ComponentFixture<ConsumerAccountInquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerAccountInquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerAccountInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
