import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestchequeprintingComponent } from './interestchequeprinting.component';

describe('InterestchequeprintingComponent', () => {
  let component: InterestchequeprintingComponent;
  let fixture: ComponentFixture<InterestchequeprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestchequeprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestchequeprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
