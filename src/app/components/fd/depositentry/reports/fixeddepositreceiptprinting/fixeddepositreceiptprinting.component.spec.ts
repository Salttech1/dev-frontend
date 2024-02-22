import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixeddepositreceiptprintingComponent } from './fixeddepositreceiptprinting.component';

describe('FixeddepositreceiptprintingComponent', () => {
  let component: FixeddepositreceiptprintingComponent;
  let fixture: ComponentFixture<FixeddepositreceiptprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixeddepositreceiptprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixeddepositreceiptprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
