import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcauthorisationlistsgrformatComponent } from './lcauthorisationlistsgrformat.component';

describe('LcauthorisationlistsgrformatComponent', () => {
  let component: LcauthorisationlistsgrformatComponent;
  let fixture: ComponentFixture<LcauthorisationlistsgrformatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcauthorisationlistsgrformatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcauthorisationlistsgrformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
