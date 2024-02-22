import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanReportComponent } from './challan-report.component';

describe('ChallanReportComponent', () => {
  let component: ChallanReportComponent;
  let fixture: ComponentFixture<ChallanReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallanReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
