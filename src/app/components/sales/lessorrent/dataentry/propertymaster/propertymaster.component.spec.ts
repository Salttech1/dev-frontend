import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertymasterComponent } from './propertymaster.component';

describe('PropertymasterComponent', () => {
  let component: PropertymasterComponent;
  let fixture: ComponentFixture<PropertymasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertymasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
