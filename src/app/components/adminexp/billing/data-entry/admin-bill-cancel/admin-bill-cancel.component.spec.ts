import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBillCancelComponent } from './admin-bill-cancel.component';

describe('AdminBillCancelComponent', () => {
  let component: AdminBillCancelComponent;
  let fixture: ComponentFixture<AdminBillCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBillCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBillCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
