import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearendprocessingComponent } from './yearendprocessing.component';

describe('YearendprocessingComponent', () => {
  let component: YearendprocessingComponent;
  let fixture: ComponentFixture<YearendprocessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearendprocessingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearendprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
