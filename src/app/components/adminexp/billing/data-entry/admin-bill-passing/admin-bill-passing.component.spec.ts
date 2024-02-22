import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBillPassingComponent } from './admin-bill-passing.component';

describe('AdminBillPassingComponent', () => {
  let component: AdminBillPassingComponent;
  let fixture: ComponentFixture<AdminBillPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBillPassingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBillPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
