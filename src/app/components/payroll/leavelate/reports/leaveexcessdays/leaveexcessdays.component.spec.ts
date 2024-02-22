import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveexcessdaysComponent } from './leaveexcessdays.component';

describe('LeaveexcessdaysComponent', () => {
  let component: LeaveexcessdaysComponent;
  let fixture: ComponentFixture<LeaveexcessdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveexcessdaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveexcessdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
