import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyitsummaryComponent } from './monthlyitsummary.component';

describe('MonthlyitsummaryComponent', () => {
  let component: MonthlyitsummaryComponent;
  let fixture: ComponentFixture<MonthlyitsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyitsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyitsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
