import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicNoteComponent } from './logic-note.component';

describe('LogicNoteComponent', () => {
  let component: LogicNoteComponent;
  let fixture: ComponentFixture<LogicNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogicNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
