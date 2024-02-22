import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatwiseInfraSummaryComponent } from './flatwise-infra-summary.component';

describe('FlatwiseInfraSummaryComponent', () => {
  let component: FlatwiseInfraSummaryComponent;
  let fixture: ComponentFixture<FlatwiseInfraSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatwiseInfraSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatwiseInfraSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
