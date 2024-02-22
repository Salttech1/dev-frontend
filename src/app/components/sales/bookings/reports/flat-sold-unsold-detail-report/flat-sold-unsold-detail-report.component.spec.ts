import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSoldUnsoldDetailReportComponent } from './flat-sold-unsold-detail-report.component';

describe('FlatSoldUnsoldDetailReportComponent', () => {
  let component: FlatSoldUnsoldDetailReportComponent;
  let fixture: ComponentFixture<FlatSoldUnsoldDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatSoldUnsoldDetailReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatSoldUnsoldDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
