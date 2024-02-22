import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form3AComponent } from './form3-a.component';

describe('Form3AComponent', () => {
  let component: Form3AComponent;
  let fixture: ComponentFixture<Form3AComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form3AComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form3AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
