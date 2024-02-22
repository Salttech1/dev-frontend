import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyitsummaryhorizontalComponent } from './monthlyitsummaryhorizontal.component';

describe('MonthlyitsummaryhorizontalComponent', () => {
  let component: MonthlyitsummaryhorizontalComponent;
  let fixture: ComponentFixture<MonthlyitsummaryhorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyitsummaryhorizontalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyitsummaryhorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
