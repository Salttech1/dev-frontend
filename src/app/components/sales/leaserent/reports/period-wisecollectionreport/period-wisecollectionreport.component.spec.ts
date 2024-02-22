import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodWisecollectionreportComponent } from './period-wisecollectionreport.component';

describe('PeriodWisecollectionreportComponent', () => {
  let component: PeriodWisecollectionreportComponent;
  let fixture: ComponentFixture<PeriodWisecollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodWisecollectionreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodWisecollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
