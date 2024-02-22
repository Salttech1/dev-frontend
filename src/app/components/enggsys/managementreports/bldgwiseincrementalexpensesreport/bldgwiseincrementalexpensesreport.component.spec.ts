import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BldgwiseincrementalexpensesreportComponent } from './bldgwiseincrementalexpensesreport.component';

describe('BldgwiseincrementalexpensesreportComponent', () => {
  let component: BldgwiseincrementalexpensesreportComponent;
  let fixture: ComponentFixture<BldgwiseincrementalexpensesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BldgwiseincrementalexpensesreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BldgwiseincrementalexpensesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
