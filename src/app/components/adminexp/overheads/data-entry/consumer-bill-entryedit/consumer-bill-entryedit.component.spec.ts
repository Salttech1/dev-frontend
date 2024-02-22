import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerBillEntryeditComponent } from './consumer-bill-entryedit.component';

describe('ConsumerBillEntryeditComponent', () => {
  let component: ConsumerBillEntryeditComponent;
  let fixture: ComponentFixture<ConsumerBillEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerBillEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerBillEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
