import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivedepositindividualwiseComponent } from './activedepositindividualwise.component';

describe('ActivedepositindividualwiseComponent', () => {
  let component: ActivedepositindividualwiseComponent;
  let fixture: ComponentFixture<ActivedepositindividualwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivedepositindividualwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivedepositindividualwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
