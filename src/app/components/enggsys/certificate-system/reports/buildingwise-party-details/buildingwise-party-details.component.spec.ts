import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingwisePartyDetailsComponent } from './buildingwise-party-details.component';

describe('BuildingwisePartyDetailsComponent', () => {
  let component: BuildingwisePartyDetailsComponent;
  let fixture: ComponentFixture<BuildingwisePartyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingwisePartyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingwisePartyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
