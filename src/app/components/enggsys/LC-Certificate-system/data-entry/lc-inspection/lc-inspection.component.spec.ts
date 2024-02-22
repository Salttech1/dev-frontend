import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcInspectionComponent } from './lc-inspection.component';

describe('LcInspectionComponent', () => {
  let component: LcInspectionComponent;
  let fixture: ComponentFixture<LcInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
