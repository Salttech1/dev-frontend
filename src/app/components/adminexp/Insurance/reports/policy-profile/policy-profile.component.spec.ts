import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyProfileComponent } from './policy-profile.component';

describe('PolicyProfileComponent', () => {
  let component: PolicyProfileComponent;
  let fixture: ComponentFixture<PolicyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
