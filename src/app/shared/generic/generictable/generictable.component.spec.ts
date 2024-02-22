import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerictableComponent } from './generictable.component';

describe('GenerictableComponent', () => {
  let component: GenerictableComponent;
  let fixture: ComponentFixture<GenerictableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerictableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerictableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
