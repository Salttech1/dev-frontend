import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingintercompanytransComponent } from './pendingintercompanytrans.component';

describe('PendingintercompanytransComponent', () => {
  let component: PendingintercompanytransComponent;
  let fixture: ComponentFixture<PendingintercompanytransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingintercompanytransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingintercompanytransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
