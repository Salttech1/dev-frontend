import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfstatisticsComponent } from './pfstatistics.component';

describe('PfstatisticsComponent', () => {
  let component: PfstatisticsComponent;
  let fixture: ComponentFixture<PfstatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfstatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
