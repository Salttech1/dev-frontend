import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeftbankadviceComponent } from './neftbankadvice.component';

describe('NeftbankadviceComponent', () => {
  let component: NeftbankadviceComponent;
  let fixture: ComponentFixture<NeftbankadviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeftbankadviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeftbankadviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
