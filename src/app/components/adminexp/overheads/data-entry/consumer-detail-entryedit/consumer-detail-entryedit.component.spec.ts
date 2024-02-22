import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerDetailEntryeditComponent } from './consumer-detail-entryedit.component';

describe('ConsumerDetailEntryeditComponent', () => {
  let component: ConsumerDetailEntryeditComponent;
  let fixture: ComponentFixture<ConsumerDetailEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerDetailEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerDetailEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
