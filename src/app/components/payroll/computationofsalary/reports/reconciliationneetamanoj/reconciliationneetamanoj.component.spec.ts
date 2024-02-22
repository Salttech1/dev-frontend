import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationneetamanojComponent } from './reconciliationneetamanoj.component';

describe('ReconciliationneetamanojComponent', () => {
  let component: ReconciliationneetamanojComponent;
  let fixture: ComponentFixture<ReconciliationneetamanojComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconciliationneetamanojComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconciliationneetamanojComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
