import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfRetentionOutstandingCertificateComponent } from './list-of-retention-outstanding-certificate.component';

describe('ListOfRetentionOutstandingCertificateComponent', () => {
  let component: ListOfRetentionOutstandingCertificateComponent;
  let fixture: ComponentFixture<ListOfRetentionOutstandingCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfRetentionOutstandingCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfRetentionOutstandingCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
