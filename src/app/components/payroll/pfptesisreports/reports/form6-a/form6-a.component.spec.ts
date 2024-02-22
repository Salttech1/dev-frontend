import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Form6AComponent } from './form6-a.component';

describe('Form6AComponent', () => {
  let component: Form6AComponent;
  let fixture: ComponentFixture<Form6AComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Form6AComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Form6AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
