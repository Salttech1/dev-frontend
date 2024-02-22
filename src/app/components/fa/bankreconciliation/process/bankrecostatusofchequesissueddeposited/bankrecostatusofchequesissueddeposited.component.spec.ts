import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankrecostatusofchequesissueddepositedComponent } from './bankrecostatusofchequesissueddeposited.component';

describe('BankrecostatusofchequesissueddepositedComponent', () => {
  let component: BankrecostatusofchequesissueddepositedComponent;
  let fixture: ComponentFixture<BankrecostatusofchequesissueddepositedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankrecostatusofchequesissueddepositedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankrecostatusofchequesissueddepositedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
