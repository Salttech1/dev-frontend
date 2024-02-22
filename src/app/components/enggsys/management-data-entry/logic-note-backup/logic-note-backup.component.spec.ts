import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicNoteBackupComponent } from './logic-note-backup.component';

describe('LogicNoteBackupComponent', () => {
  let component: LogicNoteBackupComponent;
  let fixture: ComponentFixture<LogicNoteBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogicNoteBackupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicNoteBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
