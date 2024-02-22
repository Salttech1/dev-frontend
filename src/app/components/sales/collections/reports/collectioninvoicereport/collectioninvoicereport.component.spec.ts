import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectioninvoicereportComponent } from './collectioninvoicereport.component';

describe('CollectioninvoicereportComponent', () => {
  let component: CollectioninvoicereportComponent;
  let fixture: ComponentFixture<CollectioninvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectioninvoicereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectioninvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
