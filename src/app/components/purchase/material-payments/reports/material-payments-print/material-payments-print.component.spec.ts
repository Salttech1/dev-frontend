import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPaymentsPrintComponent } from './material-payments-print.component';

describe('MaterialPaymentsPrintComponent', () => {
  let component: MaterialPaymentsPrintComponent;
  let fixture: ComponentFixture<MaterialPaymentsPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialPaymentsPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPaymentsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
