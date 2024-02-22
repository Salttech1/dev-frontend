import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionreceiptreprintComponent } from './collectionreceiptreprint.component';

describe('CollectionreceiptreprintComponent', () => {
  let component: CollectionreceiptreprintComponent;
  let fixture: ComponentFixture<CollectionreceiptreprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionreceiptreprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionreceiptreprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
