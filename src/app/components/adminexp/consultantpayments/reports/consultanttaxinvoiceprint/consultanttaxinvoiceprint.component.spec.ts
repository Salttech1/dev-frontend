import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultanttaxinvoiceprintComponent } from './consultanttaxinvoiceprint.component';

describe('ConsultanttaxinvoiceprintComponent', () => {
  let component: ConsultanttaxinvoiceprintComponent;
  let fixture: ComponentFixture<ConsultanttaxinvoiceprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultanttaxinvoiceprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultanttaxinvoiceprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
