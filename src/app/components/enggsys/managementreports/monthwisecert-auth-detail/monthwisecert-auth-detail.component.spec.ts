import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwisecertAuthDetailComponent } from './monthwisecert-auth-detail.component';

describe('MonthwisecertAuthDetailComponent', () => {
  let component: MonthwisecertAuthDetailComponent;
  let fixture: ComponentFixture<MonthwisecertAuthDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthwisecertAuthDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthwisecertAuthDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
