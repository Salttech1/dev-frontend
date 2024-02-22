import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOfRecIdComponent } from './details-of-rec-id.component';

describe('DetailsOfRecIdComponent', () => {
  let component: DetailsOfRecIdComponent;
  let fixture: ComponentFixture<DetailsOfRecIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsOfRecIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsOfRecIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
