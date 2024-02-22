import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfChequeInFavourComponent } from './statement-of-cheque-in-favour.component';

describe('StatementOfChequeInFavourComponent', () => {
  let component: StatementOfChequeInFavourComponent;
  let fixture: ComponentFixture<StatementOfChequeInFavourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementOfChequeInFavourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfChequeInFavourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
