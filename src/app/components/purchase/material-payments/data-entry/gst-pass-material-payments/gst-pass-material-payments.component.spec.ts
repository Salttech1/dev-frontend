import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstPassMaterialPaymentsComponent } from './gst-pass-material-payments.component';

describe('GstPassMaterialPaymentsComponent', () => {
  let component: GstPassMaterialPaymentsComponent;
  let fixture: ComponentFixture<GstPassMaterialPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstPassMaterialPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstPassMaterialPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
