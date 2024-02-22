import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonmasterComponent } from './personmaster.component';

describe('PersonmasterComponent', () => {
  let component: PersonmasterComponent;
  let fixture: ComponentFixture<PersonmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
