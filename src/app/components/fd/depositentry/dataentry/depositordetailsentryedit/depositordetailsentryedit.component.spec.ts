import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositordetailsentryeditComponent } from './depositordetailsentryedit.component';

describe('DepositordetailsentryeditComponent', () => {
  let component: DepositordetailsentryeditComponent;
  let fixture: ComponentFixture<DepositordetailsentryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositordetailsentryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositordetailsentryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
