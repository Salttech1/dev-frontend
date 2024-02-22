import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfreportComponent } from './pfreport.component';

describe('PfreportComponent', () => {
  let component: PfreportComponent;
  let fixture: ComponentFixture<PfreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
