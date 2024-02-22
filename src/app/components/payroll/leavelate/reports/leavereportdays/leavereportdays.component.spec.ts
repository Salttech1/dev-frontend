import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavereportdaysComponent } from './leavereportdays.component';

describe('LeavereportdaysComponent', () => {
  let component: LeavereportdaysComponent;
  let fixture: ComponentFixture<LeavereportdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavereportdaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavereportdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
