import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingbillgenerationComponent } from './outgoingbillgeneration.component';

describe('OutgoingbillgenerationComponent', () => {
  let component: OutgoingbillgenerationComponent;
  let fixture: ComponentFixture<OutgoingbillgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingbillgenerationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingbillgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
