import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepProgressEntryComponent } from './mep-progress-entry.component';

describe('MepProgressEntryComponent', () => {
  let component: MepProgressEntryComponent;
  let fixture: ComponentFixture<MepProgressEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MepProgressEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepProgressEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
