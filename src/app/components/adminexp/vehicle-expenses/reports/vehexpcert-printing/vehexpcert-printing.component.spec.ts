import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehexpcertPrintingComponent } from './vehexpcert-printing.component';

describe('VehexpcertPrintingComponent', () => {
  let component: VehexpcertPrintingComponent;
  let fixture: ComponentFixture<VehexpcertPrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehexpcertPrintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehexpcertPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
