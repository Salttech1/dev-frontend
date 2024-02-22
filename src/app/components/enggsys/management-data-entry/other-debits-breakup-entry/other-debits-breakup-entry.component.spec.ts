import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDebitsBreakupEntryComponent } from './other-debits-breakup-entry.component';

describe('OtherDebitsBreakupEntryComponent', () => {
  let component: OtherDebitsBreakupEntryComponent;
  let fixture: ComponentFixture<OtherDebitsBreakupEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDebitsBreakupEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDebitsBreakupEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
