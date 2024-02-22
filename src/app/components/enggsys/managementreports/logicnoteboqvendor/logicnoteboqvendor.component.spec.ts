import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicnoteboqvendorComponent } from './logicnoteboqvendor.component';

describe('LogicnoteboqvendorComponent', () => {
  let component: LogicnoteboqvendorComponent;
  let fixture: ComponentFixture<LogicnoteboqvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogicnoteboqvendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicnoteboqvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
