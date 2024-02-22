import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerDepositEntryeditComponent } from './consumer-deposit-entryedit.component';

describe('ConsumerDepositEntryeditComponent', () => {
  let component: ConsumerDepositEntryeditComponent;
  let fixture: ComponentFixture<ConsumerDepositEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerDepositEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerDepositEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
