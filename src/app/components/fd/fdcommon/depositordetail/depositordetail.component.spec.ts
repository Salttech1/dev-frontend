import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositordetailComponent } from './depositordetail.component';

describe('DepositordetailComponent', () => {
  let component: DepositordetailComponent;
  let fixture: ComponentFixture<DepositordetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositordetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositordetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
