import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestChequeDataEntryComponent } from './interest-cheque-data-entry.component';

describe('InterestChequeDataEntryComponent', () => {
  let component: InterestChequeDataEntryComponent;
  let fixture: ComponentFixture<InterestChequeDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestChequeDataEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestChequeDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
