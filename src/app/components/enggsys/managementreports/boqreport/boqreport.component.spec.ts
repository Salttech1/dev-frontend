import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqreportComponent } from './boqreport.component';

describe('BoqreportComponent', () => {
  let component: BoqreportComponent;
  let fixture: ComponentFixture<BoqreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoqreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoqreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
