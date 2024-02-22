import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmepartiesreportComponent } from './msmepartiesreport.component';

describe('MsmepartiesreportComponent', () => {
  let component: MsmepartiesreportComponent;
  let fixture: ComponentFixture<MsmepartiesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsmepartiesreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsmepartiesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
