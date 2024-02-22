import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementofgratuityComponent } from './settlementofgratuity.component';

describe('SettlementofgratuityComponent', () => {
  let component: SettlementofgratuityComponent;
  let fixture: ComponentFixture<SettlementofgratuityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementofgratuityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementofgratuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
