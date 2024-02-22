import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfInterimCertificateReportComponent } from './list-of-interim-certificate-report.component';

describe('ListOfInterimCertificateReportComponent', () => {
  let component: ListOfInterimCertificateReportComponent;
  let fixture: ComponentFixture<ListOfInterimCertificateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfInterimCertificateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfInterimCertificateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
