import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassedCertificateListComponent } from './passed-certificate-list.component';

describe('PassedCertificateListComponent', () => {
  let component: PassedCertificateListComponent;
  let fixture: ComponentFixture<PassedCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassedCertificateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassedCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
