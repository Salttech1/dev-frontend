import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywiseoutgoingsummaryComponent } from './companywiseoutgoingsummary.component';

describe('CompanywiseoutgoingsummaryComponent', () => {
  let component: CompanywiseoutgoingsummaryComponent;
  let fixture: ComponentFixture<CompanywiseoutgoingsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanywiseoutgoingsummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanywiseoutgoingsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
