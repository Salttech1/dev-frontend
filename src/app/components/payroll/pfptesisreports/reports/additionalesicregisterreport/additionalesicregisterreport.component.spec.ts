import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalesicregisterreportComponent } from './additionalesicregisterreport.component';

describe('AdditionalesicregisterreportComponent', () => {
  let component: AdditionalesicregisterreportComponent;
  let fixture: ComponentFixture<AdditionalesicregisterreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalesicregisterreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalesicregisterreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
