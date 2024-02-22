import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NongstCertificateEntryComponent } from './nongst-certificate-entry.component';

describe('NongstCertificateEntryComponent', () => {
  let component: NongstCertificateEntryComponent;
  let fixture: ComponentFixture<NongstCertificateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NongstCertificateEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NongstCertificateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
