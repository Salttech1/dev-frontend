import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlygroupexpensessummaryComponent } from './monthlygroupexpensessummary.component';

describe('MonthlygroupexpensessummaryComponent', () => {
  let component: MonthlygroupexpensessummaryComponent;
  let fixture: ComponentFixture<MonthlygroupexpensessummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlygroupexpensessummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlygroupexpensessummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
