import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProgressEntryComponent } from './project-progress-entry.component';

describe('ProjectProgressEntryComponent', () => {
  let component: ProjectProgressEntryComponent;
  let fixture: ComponentFixture<ProjectProgressEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectProgressEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectProgressEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
