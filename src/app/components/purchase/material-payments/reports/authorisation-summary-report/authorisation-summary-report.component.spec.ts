import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationSummaryReportComponent } from './authorisation-summary-report.component';

describe('AuthorisationSummaryReportComponent', () => {
  let component: AuthorisationSummaryReportComponent;
  let fixture: ComponentFixture<AuthorisationSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorisationSummaryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorisationSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
