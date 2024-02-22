import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankguarreportComponent } from './bankguarreport.component';

describe('BankguarreportComponent', () => {
  let component: BankguarreportComponent;
  let fixture: ComponentFixture<BankguarreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankguarreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankguarreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
