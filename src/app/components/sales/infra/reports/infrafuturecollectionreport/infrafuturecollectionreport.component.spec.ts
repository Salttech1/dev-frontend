import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrafuturecollectionreportComponent } from './infrafuturecollectionreport.component';

describe('InfrafuturecollectionreportComponent', () => {
  let component: InfrafuturecollectionreportComponent;
  let fixture: ComponentFixture<InfrafuturecollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrafuturecollectionreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfrafuturecollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
