import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavereportmonthsComponent } from './leavereportmonths.component';

describe('LeavereportmonthsComponent', () => {
  let component: LeavereportmonthsComponent;
  let fixture: ComponentFixture<LeavereportmonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavereportmonthsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavereportmonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
