import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcinterestComponent } from './calcinterest.component';

describe('CalcinterestComponent', () => {
  let component: CalcinterestComponent;
  let fixture: ComponentFixture<CalcinterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcinterestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcinterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
