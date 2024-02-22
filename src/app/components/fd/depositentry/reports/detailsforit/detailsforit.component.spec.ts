import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsforitComponent } from './detailsforit.component';

describe('DetailsforitComponent', () => {
  let component: DetailsforitComponent;
  let fixture: ComponentFixture<DetailsforitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsforitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsforitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
