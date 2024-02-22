import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAndBuildingwiseBillsComponent } from './party-and-buildingwise-bills.component';

describe('PartyAndBuildingwiseBillsComponent', () => {
  let component: PartyAndBuildingwiseBillsComponent;
  let fixture: ComponentFixture<PartyAndBuildingwiseBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyAndBuildingwiseBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyAndBuildingwiseBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
