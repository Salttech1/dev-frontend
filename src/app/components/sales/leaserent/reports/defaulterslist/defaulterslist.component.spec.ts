import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulterslistComponent } from './defaulterslist.component';

describe('DefaulterslistComponent', () => {
  let component: DefaulterslistComponent;
  let fixture: ComponentFixture<DefaulterslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaulterslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaulterslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
