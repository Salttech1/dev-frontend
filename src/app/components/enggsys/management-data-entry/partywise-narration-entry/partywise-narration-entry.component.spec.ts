import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartywiseNarrationEntryComponent } from './partywise-narration-entry.component';

describe('PartywiseNarrationEntryComponent', () => {
  let component: PartywiseNarrationEntryComponent;
  let fixture: ComponentFixture<PartywiseNarrationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartywiseNarrationEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartywiseNarrationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
