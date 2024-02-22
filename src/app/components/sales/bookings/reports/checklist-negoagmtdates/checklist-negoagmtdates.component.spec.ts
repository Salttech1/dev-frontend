import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistNegoagmtdatesComponent } from './checklist-negoagmtdates.component';

describe('ChecklistNegoagmtdatesComponent', () => {
  let component: ChecklistNegoagmtdatesComponent;
  let fixture: ComponentFixture<ChecklistNegoagmtdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistNegoagmtdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistNegoagmtdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
