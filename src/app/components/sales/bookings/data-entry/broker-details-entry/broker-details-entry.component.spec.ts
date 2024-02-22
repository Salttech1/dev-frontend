import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsEntryComponent } from './broker-details-entry.component';

describe('BrokerDetailsEntryComponent', () => {
  let component: BrokerDetailsEntryComponent;
  let fixture: ComponentFixture<BrokerDetailsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerDetailsEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerDetailsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
