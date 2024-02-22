import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsummaryforpossessionComponent } from './collectionsummaryforpossession.component';

describe('CollectionsummaryforpossessionComponent', () => {
  let component: CollectionsummaryforpossessionComponent;
  let fixture: ComponentFixture<CollectionsummaryforpossessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsummaryforpossessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionsummaryforpossessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
