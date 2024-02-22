import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantFlatBillEntryComponent } from './vacant-flat-bill-entry.component';

describe('VacantFlatBillEntryComponent', () => {
  let component: VacantFlatBillEntryComponent;
  let fixture: ComponentFixture<VacantFlatBillEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantFlatBillEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantFlatBillEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
