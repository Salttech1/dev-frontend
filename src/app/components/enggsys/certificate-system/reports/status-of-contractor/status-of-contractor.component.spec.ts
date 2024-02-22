import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusOfContractorComponent } from './status-of-contractor.component';

describe('StatusOfContractorComponent', () => {
  let component: StatusOfContractorComponent;
  let fixture: ComponentFixture<StatusOfContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusOfContractorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusOfContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
