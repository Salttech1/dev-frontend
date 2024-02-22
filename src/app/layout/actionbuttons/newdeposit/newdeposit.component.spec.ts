import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdepositComponent } from './newdeposit.component';

describe('NewdepositComponent', () => {
  let component: NewdepositComponent;
  let fixture: ComponentFixture<NewdepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewdepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewdepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
