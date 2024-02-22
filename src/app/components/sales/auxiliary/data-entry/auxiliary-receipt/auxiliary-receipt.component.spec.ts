import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryReceiptComponent } from './auxiliary-receipt.component';

describe('AuxiliaryReceiptComponent', () => {
  let component: AuxiliaryReceiptComponent;
  let fixture: ComponentFixture<AuxiliaryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxiliaryReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuxiliaryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
