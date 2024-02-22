import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettledholdemployeeComponent } from './settledholdemployee.component';

describe('SettledholdemployeeComponent', () => {
  let component: SettledholdemployeeComponent;
  let fixture: ComponentFixture<SettledholdemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettledholdemployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettledholdemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
