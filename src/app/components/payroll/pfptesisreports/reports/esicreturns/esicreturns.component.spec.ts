import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsicreturnsComponent } from './esicreturns.component';

describe('EsicreturnsComponent', () => {
  let component: EsicreturnsComponent;
  let fixture: ComponentFixture<EsicreturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsicreturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsicreturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
