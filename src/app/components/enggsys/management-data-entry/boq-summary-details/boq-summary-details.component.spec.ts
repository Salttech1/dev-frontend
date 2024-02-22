import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqSummaryDetailsComponent } from './boq-summary-details.component';

describe('BoqSummaryDetailsComponent', () => {
  let component: BoqSummaryDetailsComponent;
  let fixture: ComponentFixture<BoqSummaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoqSummaryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoqSummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
