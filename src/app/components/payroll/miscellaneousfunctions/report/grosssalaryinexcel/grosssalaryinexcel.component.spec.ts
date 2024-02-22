import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrosssalaryinexcelComponent } from './grosssalaryinexcel.component';

describe('GrosssalaryinexcelComponent', () => {
  let component: GrosssalaryinexcelComponent;
  let fixture: ComponentFixture<GrosssalaryinexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrosssalaryinexcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrosssalaryinexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
