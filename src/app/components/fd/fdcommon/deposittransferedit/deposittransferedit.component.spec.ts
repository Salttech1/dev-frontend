import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeposittransfereditComponent } from './deposittransferedit.component';

describe('DeposittransfereditComponent', () => {
  let component: DeposittransfereditComponent;
  let fixture: ComponentFixture<DeposittransfereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeposittransfereditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeposittransfereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
