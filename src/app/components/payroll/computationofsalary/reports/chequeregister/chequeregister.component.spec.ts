import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeregisterComponent } from './chequeregister.component';

describe('ChequeregisterComponent', () => {
  let component: ChequeregisterComponent;
  let fixture: ComponentFixture<ChequeregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
