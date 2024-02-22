import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAuthorisationEntryComponent } from './lc-authorisation-entry.component';

describe('LcAuthorisationEntryComponent', () => {
  let component: LcAuthorisationEntryComponent;
  let fixture: ComponentFixture<LcAuthorisationEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcAuthorisationEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcAuthorisationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
