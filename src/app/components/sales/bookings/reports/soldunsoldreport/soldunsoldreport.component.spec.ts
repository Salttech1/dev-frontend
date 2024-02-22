import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldunsoldreportComponent } from './soldunsoldreport.component';

describe('SoldunsoldreportComponent', () => {
  let component: SoldunsoldreportComponent;
  let fixture: ComponentFixture<SoldunsoldreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldunsoldreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldunsoldreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
