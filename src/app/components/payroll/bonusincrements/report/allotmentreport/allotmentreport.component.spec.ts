import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotmentreportComponent } from './allotmentreport.component';

describe('AllotmentreportComponent', () => {
  let component: AllotmentreportComponent;
  let fixture: ComponentFixture<AllotmentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllotmentreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
