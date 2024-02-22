import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInfraMonthwiseComponent } from './outgoing-infra-monthwise.component';

describe('OutgoingInfraMonthwiseComponent', () => {
  let component: OutgoingInfraMonthwiseComponent;
  let fixture: ComponentFixture<OutgoingInfraMonthwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingInfraMonthwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingInfraMonthwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
