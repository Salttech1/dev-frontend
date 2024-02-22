import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFlowEntryComponent } from './material-flow-entry.component';

describe('MaterialFlowEntryComponent', () => {
  let component: MaterialFlowEntryComponent;
  let fixture: ComponentFixture<MaterialFlowEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialFlowEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialFlowEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
