import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationsBldgMatSuppDetailComponent } from './authorisations-bldg-mat-supp-detail.component';

describe('AuthorisationsBldgMatSuppDetailComponent', () => {
  let component: AuthorisationsBldgMatSuppDetailComponent;
  let fixture: ComponentFixture<AuthorisationsBldgMatSuppDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationsBldgMatSuppDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationsBldgMatSuppDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
