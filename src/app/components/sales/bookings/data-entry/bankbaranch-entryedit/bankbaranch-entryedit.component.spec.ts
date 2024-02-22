import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankbaranchEntryeditComponent } from './bankbaranch-entryedit.component';

describe('BankbaranchEntryeditComponent', () => {
  let component: BankbaranchEntryeditComponent;
  let fixture: ComponentFixture<BankbaranchEntryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankbaranchEntryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankbaranchEntryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
