import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseBillEntryComponent } from './reverse-bill-entry.component';

describe('ReverseBillEntryComponent', () => {
  let component: ReverseBillEntryComponent;
  let fixture: ComponentFixture<ReverseBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReverseBillEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReverseBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
