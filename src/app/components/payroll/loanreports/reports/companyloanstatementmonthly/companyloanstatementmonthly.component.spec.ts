import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyloanstatementmonthlyComponent } from './companyloanstatementmonthly.component';

describe('CompanyloanstatementmonthlyComponent', () => {
  let component: CompanyloanstatementmonthlyComponent;
  let fixture: ComponentFixture<CompanyloanstatementmonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyloanstatementmonthlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyloanstatementmonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
