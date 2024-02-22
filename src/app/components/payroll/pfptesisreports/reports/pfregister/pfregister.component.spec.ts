import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfregisterComponent } from './pfregister.component';

describe('PfregisterComponent', () => {
  let component: PfregisterComponent;
  let fixture: ComponentFixture<PfregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
