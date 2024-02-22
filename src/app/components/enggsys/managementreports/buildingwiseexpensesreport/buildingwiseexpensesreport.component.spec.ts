import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingwiseexpensesreportComponent } from './buildingwiseexpensesreport.component';

describe('BuildingwiseexpensesreportComponent', () => {
  let component: BuildingwiseexpensesreportComponent;
  let fixture: ComponentFixture<BuildingwiseexpensesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingwiseexpensesreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingwiseexpensesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
