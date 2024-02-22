import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F1PopupComponent } from './f1-popup.component';

describe('F1PopupComponent', () => {
  let component: F1PopupComponent;
  let fixture: ComponentFixture<F1PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F1PopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(F1PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
