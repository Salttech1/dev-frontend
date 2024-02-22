import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryinitialisationComponent } from './salaryinitialisation.component';

describe('SalaryinitialisationComponent', () => {
  let component: SalaryinitialisationComponent;
  let fixture: ComponentFixture<SalaryinitialisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryinitialisationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryinitialisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
