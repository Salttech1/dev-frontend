import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivedepositslistComponent } from './activedepositslist.component';

describe('ActivedepositslistComponent', () => {
  let component: ActivedepositslistComponent;
  let fixture: ComponentFixture<ActivedepositslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivedepositslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivedepositslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
