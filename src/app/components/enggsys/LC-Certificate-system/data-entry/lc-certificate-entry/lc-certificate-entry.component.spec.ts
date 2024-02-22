import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCertificateEntryComponent } from './lc-certificate-entry.component';

describe('LcCertificateEntryComponent', () => {
  let component: LcCertificateEntryComponent;
  let fixture: ComponentFixture<LcCertificateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcCertificateEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcCertificateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
