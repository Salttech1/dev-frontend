import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePartyEntryComponent } from './quote-party-entry.component';

describe('QuotePartyEntryComponent', () => {
  let component: QuotePartyEntryComponent;
  let fixture: ComponentFixture<QuotePartyEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotePartyEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotePartyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
