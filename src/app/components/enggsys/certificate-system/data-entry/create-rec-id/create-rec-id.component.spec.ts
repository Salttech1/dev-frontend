import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecIdComponent } from './create-rec-id.component';

describe('CreateRecIdComponent', () => {
  let component: CreateRecIdComponent;
  let fixture: ComponentFixture<CreateRecIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
