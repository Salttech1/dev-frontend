import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatereportdaysComponent } from './latereportdays.component';

describe('LatereportdaysComponent', () => {
  let component: LatereportdaysComponent;
  let fixture: ComponentFixture<LatereportdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatereportdaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatereportdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
