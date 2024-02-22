import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LccertificatelistComponent } from './lccertificatelist.component';

describe('LccertificatelistComponent', () => {
  let component: LccertificatelistComponent;
  let fixture: ComponentFixture<LccertificatelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LccertificatelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LccertificatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
