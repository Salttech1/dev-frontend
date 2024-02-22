import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityprojectionComponent } from './gratuityprojection.component';

describe('GratuityprojectionComponent', () => {
  let component: GratuityprojectionComponent;
  let fixture: ComponentFixture<GratuityprojectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GratuityprojectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GratuityprojectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
