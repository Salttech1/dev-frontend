import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraReceiptReportComponent } from './infra-receipt-report.component';

describe('InfraReceiptReportComponent', () => {
  let component: InfraReceiptReportComponent;
  let fixture: ComponentFixture<InfraReceiptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraReceiptReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfraReceiptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
