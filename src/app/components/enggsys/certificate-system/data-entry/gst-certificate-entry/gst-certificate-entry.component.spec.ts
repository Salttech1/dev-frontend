import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstCertificateEntryComponent } from './gst-certificate-entry.component';

describe('GstCertificateEntryComponent', () => {
  let component: GstCertificateEntryComponent;
  let fixture: ComponentFixture<GstCertificateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstCertificateEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstCertificateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
