import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalreminderlettersnewComponent } from './renewalreminderlettersnew.component';

describe('RenewalreminderlettersnewComponent', () => {
  let component: RenewalreminderlettersnewComponent;
  let fixture: ComponentFixture<RenewalreminderlettersnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalreminderlettersnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalreminderlettersnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
