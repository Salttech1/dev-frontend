import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeposittransferComponent } from './deposittransfer.component';

describe('DeposittransferComponent', () => {
  let component: DeposittransferComponent;
  let fixture: ComponentFixture<DeposittransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeposittransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeposittransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
