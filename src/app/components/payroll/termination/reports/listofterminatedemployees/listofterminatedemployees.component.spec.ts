import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofterminatedemployeesComponent } from './listofterminatedemployees.component';

describe('ListofterminatedemployeesComponent', () => {
  let component: ListofterminatedemployeesComponent;
  let fixture: ComponentFixture<ListofterminatedemployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListofterminatedemployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListofterminatedemployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
