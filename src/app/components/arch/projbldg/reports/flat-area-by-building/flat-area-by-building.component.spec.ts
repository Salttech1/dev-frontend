import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatAreaByBuildingComponent } from './flat-area-by-building.component';

describe('FlatAreaByBuildingComponent', () => {
  let component: FlatAreaByBuildingComponent;
  let fixture: ComponentFixture<FlatAreaByBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatAreaByBuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatAreaByBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
