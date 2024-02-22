import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIntercompanyInvoiceComponent } from './admin-intercompany-invoice.component';

describe('AdminIntercompanyInvoiceComponent', () => {
  let component: AdminIntercompanyInvoiceComponent;
  let fixture: ComponentFixture<AdminIntercompanyInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminIntercompanyInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminIntercompanyInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
