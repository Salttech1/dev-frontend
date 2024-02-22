import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcauthorisationprintingComponent } from './lcauthorisationprinting.component';

describe('LcauthorisationprintingComponent', () => {
  let component: LcauthorisationprintingComponent;
  let fixture: ComponentFixture<LcauthorisationprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcauthorisationprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcauthorisationprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
