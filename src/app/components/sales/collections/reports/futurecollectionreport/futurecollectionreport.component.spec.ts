import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturecollectionreportComponent } from './futurecollectionreport.component';

describe('FuturecollectionreportComponent', () => {
  let component: FuturecollectionreportComponent;
  let fixture: ComponentFixture<FuturecollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuturecollectionreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuturecollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
