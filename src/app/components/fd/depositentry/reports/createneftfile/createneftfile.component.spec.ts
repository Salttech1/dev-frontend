import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateneftfileComponent } from './createneftfile.component';

describe('CreateneftfileComponent', () => {
  let component: CreateneftfileComponent;
  let fixture: ComponentFixture<CreateneftfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateneftfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateneftfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
