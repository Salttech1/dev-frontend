import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemonthlypffileComponent } from './createmonthlypffile.component';

describe('CreatemonthlypffileComponent', () => {
  let component: CreatemonthlypffileComponent;
  let fixture: ComponentFixture<CreatemonthlypffileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatemonthlypffileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatemonthlypffileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
