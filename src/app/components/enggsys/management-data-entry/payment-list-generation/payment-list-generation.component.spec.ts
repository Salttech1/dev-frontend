import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListGenerationComponent } from './payment-list-generation.component';

describe('PaymentListGenerationComponent', () => {
  let component: PaymentListGenerationComponent;
  let fixture: ComponentFixture<PaymentListGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentListGenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentListGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
