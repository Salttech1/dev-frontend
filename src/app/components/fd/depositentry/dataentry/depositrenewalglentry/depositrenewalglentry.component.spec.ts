import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositrenewalglentryComponent } from './depositrenewalglentry.component';

describe('DepositrenewalglentryComponent', () => {
  let component: DepositrenewalglentryComponent;
  let fixture: ComponentFixture<DepositrenewalglentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositrenewalglentryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositrenewalglentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
