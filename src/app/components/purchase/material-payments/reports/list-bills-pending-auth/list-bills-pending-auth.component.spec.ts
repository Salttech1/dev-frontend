import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillsPendingAuthComponent } from './list-bills-pending-auth.component';

describe('ListBillsPendingAuthComponent', () => {
  let component: ListBillsPendingAuthComponent;
  let fixture: ComponentFixture<ListBillsPendingAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBillsPendingAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBillsPendingAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
