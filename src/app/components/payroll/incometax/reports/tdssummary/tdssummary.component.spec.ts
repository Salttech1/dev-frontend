import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdssummaryComponent } from './tdssummary.component';

describe('TdssummaryComponent', () => {
  let component: TdssummaryComponent;
  let fixture: ComponentFixture<TdssummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdssummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdssummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
