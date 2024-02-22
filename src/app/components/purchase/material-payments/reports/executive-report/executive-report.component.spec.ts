import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveReportComponent } from './executive-report.component';

describe('ExecutiveReportComponent', () => {
  let component: ExecutiveReportComponent;
  let fixture: ComponentFixture<ExecutiveReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
