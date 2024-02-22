import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankadviceletterpendriveComponent } from './bankadviceletterpendrive.component';

describe('BankadviceletterpendriveComponent', () => {
  let component: BankadviceletterpendriveComponent;
  let fixture: ComponentFixture<BankadviceletterpendriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankadviceletterpendriveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankadviceletterpendriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
