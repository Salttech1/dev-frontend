import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwiseCollectionReportComponent } from './monthwise-collection-report.component';

describe('MonthwiseCollectionReportComponent', () => {
  let component: MonthwiseCollectionReportComponent;
  let fixture: ComponentFixture<MonthwiseCollectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthwiseCollectionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthwiseCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
