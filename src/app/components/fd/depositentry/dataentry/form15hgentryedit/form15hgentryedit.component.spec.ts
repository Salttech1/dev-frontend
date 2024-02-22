import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form15hgentryeditComponent } from './form15hgentryedit.component';

describe('Form15hgentryeditComponent', () => {
  let component: Form15hgentryeditComponent;
  let fixture: ComponentFixture<Form15hgentryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form15hgentryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form15hgentryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
