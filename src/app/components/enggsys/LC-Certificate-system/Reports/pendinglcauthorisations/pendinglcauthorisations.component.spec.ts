import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendinglcauthorisationsComponent } from './pendinglcauthorisations.component';

describe('PendinglcauthorisationsComponent', () => {
  let component: PendinglcauthorisationsComponent;
  let fixture: ComponentFixture<PendinglcauthorisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendinglcauthorisationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendinglcauthorisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
