import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingoutgoingholdemployeelistComponent } from './incomingoutgoingholdemployeelist.component';

describe('IncomingoutgoingholdemployeelistComponent', () => {
  let component: IncomingoutgoingholdemployeelistComponent;
  let fixture: ComponentFixture<IncomingoutgoingholdemployeelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingoutgoingholdemployeelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingoutgoingholdemployeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
