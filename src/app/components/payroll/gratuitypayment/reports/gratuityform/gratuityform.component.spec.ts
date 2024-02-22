import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityformComponent } from './gratuityform.component';

describe('GratuityformComponent', () => {
  let component: GratuityformComponent;
  let fixture: ComponentFixture<GratuityformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GratuityformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GratuityformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
