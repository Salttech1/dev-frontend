import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectedmaturitiesreportComponent } from './projectedmaturitiesreport.component';

describe('ProjectedmaturitiesreportComponent', () => {
  let component: ProjectedmaturitiesreportComponent;
  let fixture: ComponentFixture<ProjectedmaturitiesreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectedmaturitiesreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectedmaturitiesreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
