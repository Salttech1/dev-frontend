import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMasterEntryeditComponent } from './location-master-entryedit.component';

describe('LocationMasterEntryeditComponent', () => {
  let component: LocationMasterEntryeditComponent;
  let fixture: ComponentFixture<LocationMasterEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationMasterEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMasterEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
