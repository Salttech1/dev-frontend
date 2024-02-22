import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherloanstatementmonthlyComponent } from './otherloanstatementmonthly.component';

describe('OtherloanstatementmonthlyComponent', () => {
  let component: OtherloanstatementmonthlyComponent;
  let fixture: ComponentFixture<OtherloanstatementmonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherloanstatementmonthlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherloanstatementmonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
