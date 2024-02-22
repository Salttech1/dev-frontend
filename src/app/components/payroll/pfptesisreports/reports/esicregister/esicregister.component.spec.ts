import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicregisterComponent } from './esicregister.component';

describe('EsicregisterComponent', () => {
  let component: EsicregisterComponent;
  let fixture: ComponentFixture<EsicregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsicregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsicregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
