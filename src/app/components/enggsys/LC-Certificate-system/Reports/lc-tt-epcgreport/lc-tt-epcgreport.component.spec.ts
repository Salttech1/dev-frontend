import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcTtEpcgreportComponent } from './lc-tt-epcgreport.component';

describe('LcTtEpcgreportComponent', () => {
  let component: LcTtEpcgreportComponent;
  let fixture: ComponentFixture<LcTtEpcgreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcTtEpcgreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcTtEpcgreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
