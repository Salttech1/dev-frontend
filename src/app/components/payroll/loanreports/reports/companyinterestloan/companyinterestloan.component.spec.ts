import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyinterestloanComponent } from './companyinterestloan.component';

describe('CompanyinterestloanComponent', () => {
  let component: CompanyinterestloanComponent;
  let fixture: ComponentFixture<CompanyinterestloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyinterestloanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyinterestloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
