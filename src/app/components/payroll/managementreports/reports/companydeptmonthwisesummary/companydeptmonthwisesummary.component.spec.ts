import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanydeptmonthwisesummaryComponent } from './companydeptmonthwisesummary.component';

describe('CompanydeptmonthwisesummaryComponent', () => {
  let component: CompanydeptmonthwisesummaryComponent;
  let fixture: ComponentFixture<CompanydeptmonthwisesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanydeptmonthwisesummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanydeptmonthwisesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
