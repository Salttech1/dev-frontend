import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedInterestComponent } from './combined-interest.component';

describe('CombinedInterestComponent', () => {
  let component: CombinedInterestComponent;
  let fixture: ComponentFixture<CombinedInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedInterestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
