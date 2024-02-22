import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicNoteVendorOrdernoComponent } from './logic-note-vendor-orderno.component';

describe('LogicNoteVendorOrdernoComponent', () => {
  let component: LogicNoteVendorOrdernoComponent;
  let fixture: ComponentFixture<LogicNoteVendorOrdernoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogicNoteVendorOrdernoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicNoteVendorOrdernoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
