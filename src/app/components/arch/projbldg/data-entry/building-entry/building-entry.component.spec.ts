import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingEntryComponent } from './building-entry.component';

describe('BuildingEntryComponent', () => {
  let component: BuildingEntryComponent;
  let fixture: ComponentFixture<BuildingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
