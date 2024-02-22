import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form3abefore2004Component } from './form3abefore2004.component';

describe('Form3abefore2004Component', () => {
  let component: Form3abefore2004Component;
  let fixture: ComponentFixture<Form3abefore2004Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form3abefore2004Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form3abefore2004Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
