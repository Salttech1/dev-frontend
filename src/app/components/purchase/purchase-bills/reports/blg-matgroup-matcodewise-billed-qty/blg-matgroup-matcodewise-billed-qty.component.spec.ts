import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlgMatgroupMatcodewiseBilledQtyComponent } from './blg-matgroup-matcodewise-billed-qty.component';

describe('BlgMatgroupMatcodewiseBilledQtyComponent', () => {
  let component: BlgMatgroupMatcodewiseBilledQtyComponent;
  let fixture: ComponentFixture<BlgMatgroupMatcodewiseBilledQtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlgMatgroupMatcodewiseBilledQtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlgMatgroupMatcodewiseBilledQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
