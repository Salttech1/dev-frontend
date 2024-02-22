import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositorinterestdetailsComponent } from './depositorinterestdetails.component';

describe('DepositorinterestdetailsComponent', () => {
  let component: DepositorinterestdetailsComponent;
  let fixture: ComponentFixture<DepositorinterestdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositorinterestdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositorinterestdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
