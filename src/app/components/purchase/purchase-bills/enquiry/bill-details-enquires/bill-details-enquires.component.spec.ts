import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDetailsEnquiresComponent } from './bill-details-enquires.component';

describe('BillDetailsEnquiresComponent', () => {
  let component: BillDetailsEnquiresComponent;
  let fixture: ComponentFixture<BillDetailsEnquiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDetailsEnquiresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDetailsEnquiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
