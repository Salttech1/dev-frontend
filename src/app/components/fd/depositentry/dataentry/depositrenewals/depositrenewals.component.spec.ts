import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositrenewalsComponent } from './depositrenewals.component';

describe('DepositrenewalsComponent', () => {
  let component: DepositrenewalsComponent;
  let fixture: ComponentFixture<DepositrenewalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositrenewalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositrenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
