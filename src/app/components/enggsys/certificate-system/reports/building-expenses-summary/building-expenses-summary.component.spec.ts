import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingExpensesSummaryComponent } from './building-expenses-summary.component';

describe('BuildingExpensesSummaryComponent', () => {
  let component: BuildingExpensesSummaryComponent;
  let fixture: ComponentFixture<BuildingExpensesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingExpensesSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingExpensesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
