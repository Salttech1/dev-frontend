import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyendorsementmasterentryComponent } from './policyendorsementmaster-entry.component';

describe('PolicyendorsementmasterEntryComponent', () => {
  let component: PolicyendorsementmasterentryComponent;
  let fixture: ComponentFixture<PolicyendorsementmasterentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyendorsementmasterentryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyendorsementmasterentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
