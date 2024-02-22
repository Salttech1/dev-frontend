import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAssetDetailsComponent } from './policy-asset-details.component';

describe('PolicyAssetDetailsComponent', () => {
  let component: PolicyAssetDetailsComponent;
  let fixture: ComponentFixture<PolicyAssetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyAssetDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
