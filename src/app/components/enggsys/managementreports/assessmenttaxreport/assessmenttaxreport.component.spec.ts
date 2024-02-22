import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmenttaxreportComponent } from './assessmenttaxreport.component';

describe('AssessmenttaxreportComponent', () => {
  let component: AssessmenttaxreportComponent;
  let fixture: ComponentFixture<AssessmenttaxreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmenttaxreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmenttaxreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
