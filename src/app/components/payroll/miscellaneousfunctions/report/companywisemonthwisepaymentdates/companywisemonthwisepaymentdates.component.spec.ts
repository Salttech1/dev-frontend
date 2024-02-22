import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanywisemonthwisepaymentdatesComponent } from './companywisemonthwisepaymentdates.component';

describe('CompanywisemonthwisepaymentdatesComponent', () => {
  let component: CompanywisemonthwisepaymentdatesComponent;
  let fixture: ComponentFixture<CompanywisemonthwisepaymentdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanywisemonthwisepaymentdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanywisemonthwisepaymentdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
