import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationReportAuthChequeComponent } from './authorisation-report-auth-cheque.component';

describe('AuthorisationReportAuthChequeComponent', () => {
  let component: AuthorisationReportAuthChequeComponent;
  let fixture: ComponentFixture<AuthorisationReportAuthChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationReportAuthChequeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationReportAuthChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
