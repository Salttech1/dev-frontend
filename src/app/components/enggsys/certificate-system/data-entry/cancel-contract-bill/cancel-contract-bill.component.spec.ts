import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelContractBillComponent } from './cancel-contract-bill.component';

describe('CancelContractBillComponent', () => {
  let component: CancelContractBillComponent;
  let fixture: ComponentFixture<CancelContractBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelContractBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelContractBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
