import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessKmRunReportComponent } from './excess-km-run-report.component';

describe('ExcessKmRunReportComponent', () => {
  let component: ExcessKmRunReportComponent;
  let fixture: ComponentFixture<ExcessKmRunReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcessKmRunReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcessKmRunReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
