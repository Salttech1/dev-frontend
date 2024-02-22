import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverystatementComponent } from './recoverystatement.component';

describe('RecoverystatementComponent', () => {
  let component: RecoverystatementComponent;
  let fixture: ComponentFixture<RecoverystatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverystatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverystatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
