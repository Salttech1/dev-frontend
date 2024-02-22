import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicNoteAddtionalInformationComponent } from './logic-note-addtional-information.component';

describe('LogicNoteAddtionalInformationComponent', () => {
  let component: LogicNoteAddtionalInformationComponent;
  let fixture: ComponentFixture<LogicNoteAddtionalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogicNoteAddtionalInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicNoteAddtionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
