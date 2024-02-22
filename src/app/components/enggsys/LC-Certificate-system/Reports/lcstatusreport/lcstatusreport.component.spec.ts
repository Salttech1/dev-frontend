import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcstatusreportComponent } from './lcstatusreport.component';

describe('LcstatusreportComponent', () => {
  let component: LcstatusreportComponent;
  let fixture: ComponentFixture<LcstatusreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcstatusreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcstatusreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
