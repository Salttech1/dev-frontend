import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyAccountsReportComponent } from './society-accounts-report.component';

describe('SocietyAccountsReportComponent', () => {
  let component: SocietyAccountsReportComponent;
  let fixture: ComponentFixture<SocietyAccountsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocietyAccountsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyAccountsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
