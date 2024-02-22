import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresttaxentryComponent } from './interesttaxentry.component';

describe('InteresttaxentryComponent', () => {
  let component: InteresttaxentryComponent;
  let fixture: ComponentFixture<InteresttaxentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteresttaxentryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteresttaxentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
