import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeHelpComponent } from './code-help.component';

describe('CodeHelpComponent', () => {
  let component: CodeHelpComponent;
  let fixture: ComponentFixture<CodeHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
