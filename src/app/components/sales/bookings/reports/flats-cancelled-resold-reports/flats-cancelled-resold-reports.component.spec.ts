import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatsCancelledResoldReportsComponent } from './flats-cancelled-resold-reports.component';

describe('FlatsCancelledResoldReportsComponent', () => {
  let component: FlatsCancelledResoldReportsComponent;
  let fixture: ComponentFixture<FlatsCancelledResoldReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatsCancelledResoldReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatsCancelledResoldReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
