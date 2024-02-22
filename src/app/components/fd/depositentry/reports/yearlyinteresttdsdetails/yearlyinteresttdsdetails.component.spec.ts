import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyinteresttdsdetailsComponent } from './yearlyinteresttdsdetails.component';

describe('YearlyinteresttdsdetailsComponent', () => {
  let component: YearlyinteresttdsdetailsComponent;
  let fixture: ComponentFixture<YearlyinteresttdsdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyinteresttdsdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyinteresttdsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
