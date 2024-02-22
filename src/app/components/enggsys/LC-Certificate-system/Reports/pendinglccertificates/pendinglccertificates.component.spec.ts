import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendinglccertificatesComponent } from './pendinglccertificates.component';

describe('PendinglccertificatesComponent', () => {
  let component: PendinglccertificatesComponent;
  let fixture: ComponentFixture<PendinglccertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendinglccertificatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendinglccertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
