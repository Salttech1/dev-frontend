import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementofduesComponent } from './settlementofdues.component';

describe('SettlementofduesComponent', () => {
  let component: SettlementofduesComponent;
  let fixture: ComponentFixture<SettlementofduesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementofduesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementofduesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
