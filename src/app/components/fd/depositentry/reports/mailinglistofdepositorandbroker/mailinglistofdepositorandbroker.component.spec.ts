import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailinglistofdepositorandbrokerComponent } from './mailinglistofdepositorandbroker.component';

describe('MailinglistofdepositorandbrokerComponent', () => {
  let component: MailinglistofdepositorandbrokerComponent;
  let fixture: ComponentFixture<MailinglistofdepositorandbrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailinglistofdepositorandbrokerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailinglistofdepositorandbrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
