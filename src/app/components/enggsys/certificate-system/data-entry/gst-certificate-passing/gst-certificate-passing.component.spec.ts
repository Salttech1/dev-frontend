import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstCertificatePassingComponent } from './gst-certificate-passing.component';

describe('GstCertificatePassingComponent', () => {
  let component: GstCertificatePassingComponent;
  let fixture: ComponentFixture<GstCertificatePassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstCertificatePassingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstCertificatePassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
