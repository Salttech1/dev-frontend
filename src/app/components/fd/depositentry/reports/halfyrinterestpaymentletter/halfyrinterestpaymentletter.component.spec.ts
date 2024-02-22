import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfyrinterestpaymentletterComponent } from './halfyrinterestpaymentletter.component';

describe('HalfyrinterestpaymentletterComponent', () => {
  let component: HalfyrinterestpaymentletterComponent;
  let fixture: ComponentFixture<HalfyrinterestpaymentletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalfyrinterestpaymentletterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalfyrinterestpaymentletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
