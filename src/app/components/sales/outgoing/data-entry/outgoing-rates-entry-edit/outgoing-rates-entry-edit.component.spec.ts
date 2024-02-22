import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingRatesEntryEditComponent } from './outgoing-rates-entry-edit.component';

describe('OutgoingRatesEntryEditComponent', () => {
  let component: OutgoingRatesEntryEditComponent;
  let fixture: ComponentFixture<OutgoingRatesEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingRatesEntryEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingRatesEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
