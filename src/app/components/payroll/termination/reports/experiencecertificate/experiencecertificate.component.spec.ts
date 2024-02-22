import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencecertificateComponent } from './experiencecertificate.component';

describe('ExperiencecertificateComponent', () => {
  let component: ExperiencecertificateComponent;
  let fixture: ComponentFixture<ExperiencecertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperiencecertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperiencecertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
