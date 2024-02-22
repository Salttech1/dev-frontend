import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstCertBillEntryComponent } from './gst-cert-bill-entry.component';

describe('GstCertBillEntryComponent', () => {
  let component: GstCertBillEntryComponent;
  let fixture: ComponentFixture<GstCertBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstCertBillEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstCertBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
