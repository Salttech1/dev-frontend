import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPaymentStatusComponent } from './material-payment-status.component';

describe('MaterialPaymentStatusComponent', () => {
  let component: MaterialPaymentStatusComponent;
  let fixture: ComponentFixture<MaterialPaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialPaymentStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
