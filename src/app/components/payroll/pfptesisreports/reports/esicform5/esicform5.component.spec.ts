import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esicform5Component } from './esicform5.component';

describe('Esicform5Component', () => {
  let component: Esicform5Component;
  let fixture: ComponentFixture<Esicform5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Esicform5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Esicform5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
