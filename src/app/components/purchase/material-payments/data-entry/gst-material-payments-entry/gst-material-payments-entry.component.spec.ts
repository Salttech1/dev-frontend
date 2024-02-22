import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstMaterialPaymentsEntryComponent } from './gst-material-payments-entry.component';

describe('GstMaterialPaymentsEntryComponent', () => {
  let component: GstMaterialPaymentsEntryComponent;
  let fixture: ComponentFixture<GstMaterialPaymentsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstMaterialPaymentsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstMaterialPaymentsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
