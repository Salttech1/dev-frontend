import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBillEntryComponent } from './admin-bill-entry.component';

describe('AdminBillEntryComponent', () => {
  let component: AdminBillEntryComponent;
  let fixture: ComponentFixture<AdminBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBillEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
