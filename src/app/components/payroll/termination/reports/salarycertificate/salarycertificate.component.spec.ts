import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarycertificateComponent } from './salarycertificate.component';

describe('SalarycertificateComponent', () => {
  let component: SalarycertificateComponent;
  let fixture: ComponentFixture<SalarycertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarycertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalarycertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
