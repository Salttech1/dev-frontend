import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyMaturingLastDayComponent } from './policy-maturing-last-day.component';

describe('PolicyMaturingLastDayComponent', () => {
  let component: PolicyMaturingLastDayComponent;
  let fixture: ComponentFixture<PolicyMaturingLastDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyMaturingLastDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyMaturingLastDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
