import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListoftotalmonthwiserepaymentsComponent } from './listoftotalmonthwiserepayments.component';

describe('ListoftotalmonthwiserepaymentsComponent', () => {
  let component: ListoftotalmonthwiserepaymentsComponent;
  let fixture: ComponentFixture<ListoftotalmonthwiserepaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListoftotalmonthwiserepaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListoftotalmonthwiserepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
