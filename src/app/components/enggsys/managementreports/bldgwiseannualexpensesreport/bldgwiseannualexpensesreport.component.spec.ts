import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BldgwiseannualexpensesreportComponent } from './bldgwiseannualexpensesreport.component';

describe('BldgwiseannualexpensesreportComponent', () => {
  let component: BldgwiseannualexpensesreportComponent;
  let fixture: ComponentFixture<BldgwiseannualexpensesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BldgwiseannualexpensesreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BldgwiseannualexpensesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
