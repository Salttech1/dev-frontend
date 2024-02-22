import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsauditsummaryComponent } from './tdsauditsummary.component';

describe('TdsauditsummaryComponent', () => {
  let component: TdsauditsummaryComponent;
  let fixture: ComponentFixture<TdsauditsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsauditsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsauditsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
