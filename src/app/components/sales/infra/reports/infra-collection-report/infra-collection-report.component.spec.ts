import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraCollectionReportComponent } from './infra-collection-report.component';

describe('InfraCollectionReportComponent', () => {
  let component: InfraCollectionReportComponent;
  let fixture: ComponentFixture<InfraCollectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraCollectionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfraCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
