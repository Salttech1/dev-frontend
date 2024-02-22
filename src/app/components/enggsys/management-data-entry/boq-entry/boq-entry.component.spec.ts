import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqEntryComponent } from './boq-entry.component';

describe('BoqEntryComponent', () => {
  let component: BoqEntryComponent;
  let fixture: ComponentFixture<BoqEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoqEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoqEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
