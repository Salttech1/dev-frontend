import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinshawcollectionreportComponent } from './dinshawcollectionreport.component';

describe('DinshawcollectionreportComponent', () => {
  let component: DinshawcollectionreportComponent;
  let fixture: ComponentFixture<DinshawcollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinshawcollectionreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinshawcollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
