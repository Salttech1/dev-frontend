import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillprintingComponent } from './billprinting.component';

describe('BillprintingComponent', () => {
  let component: BillprintingComponent;
  let fixture: ComponentFixture<BillprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
