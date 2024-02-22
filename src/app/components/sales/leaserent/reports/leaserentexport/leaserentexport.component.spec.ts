import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaserentexportComponent } from './leaserentexport.component';

describe('LeaserentexportComponent', () => {
  let component: LeaserentexportComponent;
  let fixture: ComponentFixture<LeaserentexportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaserentexportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaserentexportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
