import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyMaturingUptoTodayComponent } from './policy-maturing-upto-today.component';

describe('PolicyMaturingUptoTodayComponent', () => {
  let component: PolicyMaturingUptoTodayComponent;
  let fixture: ComponentFixture<PolicyMaturingUptoTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyMaturingUptoTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyMaturingUptoTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
