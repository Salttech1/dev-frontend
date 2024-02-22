import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositdischargeComponent } from './depositdischarge.component';

describe('DepositdischargeComponent', () => {
  let component: DepositdischargeComponent;
  let fixture: ComponentFixture<DepositdischargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositdischargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositdischargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
