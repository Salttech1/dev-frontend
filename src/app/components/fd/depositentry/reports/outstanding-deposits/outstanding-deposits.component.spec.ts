import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingDepositsComponent } from './outstanding-deposits.component';

describe('OutstandingDepositsComponent', () => {
  let component: OutstandingDepositsComponent;
  let fixture: ComponentFixture<OutstandingDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutstandingDepositsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutstandingDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
