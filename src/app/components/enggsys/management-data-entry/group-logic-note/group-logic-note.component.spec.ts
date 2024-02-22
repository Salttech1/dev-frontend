import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLogicNoteComponent } from './group-logic-note.component';

describe('GroupLogicNoteComponent', () => {
  let component: GroupLogicNoteComponent;
  let fixture: ComponentFixture<GroupLogicNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLogicNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupLogicNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
