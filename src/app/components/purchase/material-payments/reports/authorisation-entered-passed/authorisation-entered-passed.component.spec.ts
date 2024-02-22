import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationEnteredPassedComponent } from './authorisation-entered-passed.component';

describe('AuthorisationEnteredPassedComponent', () => {
  let component: AuthorisationEnteredPassedComponent;
  let fixture: ComponentFixture<AuthorisationEnteredPassedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationEnteredPassedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationEnteredPassedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
