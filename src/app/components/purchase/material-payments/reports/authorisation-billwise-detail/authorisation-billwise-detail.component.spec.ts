import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationBillwiseDetailComponent } from './authorisation-billwise-detail.component';

describe('AuthorisationBillwiseDetailComponent', () => {
  let component: AuthorisationBillwiseDetailComponent;
  let fixture: ComponentFixture<AuthorisationBillwiseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationBillwiseDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationBillwiseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
