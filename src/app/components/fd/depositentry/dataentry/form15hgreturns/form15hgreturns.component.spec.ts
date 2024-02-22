import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form15hgreturnsComponent } from './form15hgreturns.component';

describe('Form15hgreturnsComponent', () => {
  let component: Form15hgreturnsComponent;
  let fixture: ComponentFixture<Form15hgreturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form15hgreturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form15hgreturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
