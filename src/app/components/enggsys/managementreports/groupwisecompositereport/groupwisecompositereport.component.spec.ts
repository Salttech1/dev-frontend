import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupwisecompositereportComponent } from './groupwisecompositereport.component';

describe('GroupwisecompositereportComponent', () => {
  let component: GroupwisecompositereportComponent;
  let fixture: ComponentFixture<GroupwisecompositereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupwisecompositereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupwisecompositereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
