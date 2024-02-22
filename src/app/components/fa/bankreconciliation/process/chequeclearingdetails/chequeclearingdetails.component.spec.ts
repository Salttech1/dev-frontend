import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeclearingdetailsComponent } from './chequeclearingdetails.component';

describe('ChequeclearingdetailsComponent', () => {
  let component: ChequeclearingdetailsComponent;
  let fixture: ComponentFixture<ChequeclearingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeclearingdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeclearingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
