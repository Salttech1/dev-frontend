import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractwiseCertificatewsiseDetailsReportComponent } from './contractwise-certificatewsise-details-report.component';

describe('ContractwiseCertificatewsiseDetailsReportComponent', () => {
  let component: ContractwiseCertificatewsiseDetailsReportComponent;
  let fixture: ComponentFixture<ContractwiseCertificatewsiseDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractwiseCertificatewsiseDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractwiseCertificatewsiseDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
