import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyInfoEntryComponent } from './party-info-entry.component';

describe('PartyInfoEntryComponent', () => {
  let component: PartyInfoEntryComponent;
  let fixture: ComponentFixture<PartyInfoEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyInfoEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyInfoEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
