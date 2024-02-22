import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBillEntrySalesComponent } from './admin-bill-entry-sales.component';

describe('AdminBillEntrySalesComponent', () => {
  let component: AdminBillEntrySalesComponent;
  let fixture: ComponentFixture<AdminBillEntrySalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBillEntrySalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBillEntrySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
