import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositreportsComponent } from './depositreports.component';

describe('DepositreportsComponent', () => {
  let component: DepositreportsComponent;
  let fixture: ComponentFixture<DepositreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositreportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
