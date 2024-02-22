import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcstatusreportCertComponent } from './lcstatusreport-cert.component';

describe('LcstatusreportCertComponent', () => {
  let component: LcstatusreportCertComponent;
  let fixture: ComponentFixture<LcstatusreportCertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcstatusreportCertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcstatusreportCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
