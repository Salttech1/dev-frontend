import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerDailyTrasactionsEntryComponent } from './manpower-daily-trasactions-entry.component';

describe('ManpowerDailyTrasactionsEntryComponent', () => {
  let component: ManpowerDailyTrasactionsEntryComponent;
  let fixture: ComponentFixture<ManpowerDailyTrasactionsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManpowerDailyTrasactionsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManpowerDailyTrasactionsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
