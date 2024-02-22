import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestcalculationComponent } from './interestcalculation.component';

describe('InterestcalculationComponent', () => {
  let component: InterestcalculationComponent;
  let fixture: ComponentFixture<InterestcalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestcalculationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestcalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
