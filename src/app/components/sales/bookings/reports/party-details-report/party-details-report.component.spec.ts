import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsReportComponent } from './party-details-report.component';

describe('PartyDetailsReportComponent', () => {
  let component: PartyDetailsReportComponent;
  let fixture: ComponentFixture<PartyDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
