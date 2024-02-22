import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfContractorComponent } from './list-of-contractor.component';

describe('ListOfContractorComponent', () => {
  let component: ListOfContractorComponent;
  let fixture: ComponentFixture<ListOfContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfContractorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
