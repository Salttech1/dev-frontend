import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerTrackingTemplateEntryComponent } from './manpower-tracking-template-entry.component';

describe('ManpowerTrackingTemplateEntryComponent', () => {
  let component: ManpowerTrackingTemplateEntryComponent;
  let fixture: ComponentFixture<ManpowerTrackingTemplateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManpowerTrackingTemplateEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManpowerTrackingTemplateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
