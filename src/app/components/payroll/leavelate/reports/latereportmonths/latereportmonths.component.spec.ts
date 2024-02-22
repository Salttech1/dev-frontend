import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatereportmonthsComponent } from './latereportmonths.component';

describe('LatereportmonthsComponent', () => {
  let component: LatereportmonthsComponent;
  let fixture: ComponentFixture<LatereportmonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatereportmonthsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatereportmonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
