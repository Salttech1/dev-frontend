import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtslabmonthlyreportComponent } from './ptslabmonthlyreport.component';

describe('PtslabmonthlyreportComponent', () => {
  let component: PtslabmonthlyreportComponent;
  let fixture: ComponentFixture<PtslabmonthlyreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtslabmonthlyreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtslabmonthlyreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
