import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionchallanreportComponent } from './collectionchallanreport.component';

describe('CollectionchallanreportComponent', () => {
  let component: CollectionchallanreportComponent;
  let fixture: ComponentFixture<CollectionchallanreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionchallanreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionchallanreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
