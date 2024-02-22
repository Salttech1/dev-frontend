import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptvoucherreprintComponent } from './receiptvoucherreprint.component';

describe('ReceiptvoucherreprintComponent', () => {
  let component: ReceiptvoucherreprintComponent;
  let fixture: ComponentFixture<ReceiptvoucherreprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptvoucherreprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptvoucherreprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
