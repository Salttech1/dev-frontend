import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseBillsComponent } from './user-wise-bills.component';

describe('UserWiseBillsComponent', () => {
  let component: UserWiseBillsComponent;
  let fixture: ComponentFixture<UserWiseBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWiseBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
