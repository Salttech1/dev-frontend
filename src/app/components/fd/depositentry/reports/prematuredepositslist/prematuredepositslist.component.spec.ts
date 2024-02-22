import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrematuredepositslistComponent } from './prematuredepositslist.component';

describe('PrematuredepositslistComponent', () => {
  let component: PrematuredepositslistComponent;
  let fixture: ComponentFixture<PrematuredepositslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrematuredepositslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrematuredepositslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
