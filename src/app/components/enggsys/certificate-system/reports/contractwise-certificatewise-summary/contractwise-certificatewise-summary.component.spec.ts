import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractwiseCertificatewiseSummaryComponent } from './contractwise-certificatewise-summary.component';

describe('ContractwiseCertificatewiseSummaryComponent', () => {
  let component: ContractwiseCertificatewiseSummaryComponent;
  let fixture: ComponentFixture<ContractwiseCertificatewiseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractwiseCertificatewiseSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractwiseCertificatewiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
