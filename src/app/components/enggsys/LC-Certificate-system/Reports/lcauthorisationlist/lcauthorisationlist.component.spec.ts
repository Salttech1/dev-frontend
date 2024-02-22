import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcauthorisationlistComponent } from './lcauthorisationlist.component';

describe('LcauthorisationlistComponent', () => {
  let component: LcauthorisationlistComponent;
  let fixture: ComponentFixture<LcauthorisationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcauthorisationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcauthorisationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
