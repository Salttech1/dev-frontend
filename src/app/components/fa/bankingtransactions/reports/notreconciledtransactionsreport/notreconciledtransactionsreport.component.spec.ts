import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonreconciledtransactionsreportComponent } from './notreconciledtransactionsreport.component';

describe('NonreconciledtransactionsreportComponent', () => {
  let component: NonreconciledtransactionsreportComponent;
  let fixture: ComponentFixture<NonreconciledtransactionsreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonreconciledtransactionsreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonreconciledtransactionsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
