import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoiceCreationComponent } from './admin-invoice-creation.component';

describe('AdminInvoiceCreationComponent', () => {
  let component: AdminInvoiceCreationComponent;
  let fixture: ComponentFixture<AdminInvoiceCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInvoiceCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInvoiceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
