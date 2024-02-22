import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LccertificatelistsgrformatComponent } from './lccertificatelistsgrformat.component';

describe('LccertificatelistsgrformatComponent', () => {
  let component: LccertificatelistsgrformatComponent;
  let fixture: ComponentFixture<LccertificatelistsgrformatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LccertificatelistsgrformatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LccertificatelistsgrformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
