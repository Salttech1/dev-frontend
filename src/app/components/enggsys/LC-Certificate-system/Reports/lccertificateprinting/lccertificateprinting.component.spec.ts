import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LccertificateprintingComponent } from './lccertificateprinting.component';

describe('LccertificateprintingComponent', () => {
  let component: LccertificateprintingComponent;
  let fixture: ComponentFixture<LccertificateprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LccertificateprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LccertificateprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
