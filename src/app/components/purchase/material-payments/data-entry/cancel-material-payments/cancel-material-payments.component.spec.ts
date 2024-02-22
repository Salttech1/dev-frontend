import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelMaterialPaymentsComponent } from './cancel-material-payments.component';

describe('CancelMaterialPaymentsComponent', () => {
  let component: CancelMaterialPaymentsComponent;
  let fixture: ComponentFixture<CancelMaterialPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelMaterialPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelMaterialPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
