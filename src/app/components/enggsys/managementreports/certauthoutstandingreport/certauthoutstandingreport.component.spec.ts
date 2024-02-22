import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertauthoutstandingreportComponent } from './certauthoutstandingreport.component';

describe('CertauthoutstandingreportComponent', () => {
  let component: CertauthoutstandingreportComponent;
  let fixture: ComponentFixture<CertauthoutstandingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertauthoutstandingreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertauthoutstandingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
