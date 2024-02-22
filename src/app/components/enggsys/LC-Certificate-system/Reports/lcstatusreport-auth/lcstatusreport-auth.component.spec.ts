import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcstatusreportAuthComponent } from './lcstatusreport-auth.component';

describe('LcstatusreportAuthComponent', () => {
  let component: LcstatusreportAuthComponent;
  let fixture: ComponentFixture<LcstatusreportAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcstatusreportAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcstatusreportAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
