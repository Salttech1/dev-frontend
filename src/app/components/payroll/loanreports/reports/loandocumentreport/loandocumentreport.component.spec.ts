import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoandocumentreportComponent } from './loandocumentreport.component';

describe('LoandocumentreportComponent', () => {
  let component: LoandocumentreportComponent;
  let fixture: ComponentFixture<LoandocumentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoandocumentreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoandocumentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
