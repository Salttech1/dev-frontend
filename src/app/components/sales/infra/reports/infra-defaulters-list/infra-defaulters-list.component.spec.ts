import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraDefaultersListComponent } from './infra-defaulters-list.component';

describe('InfraDefaultersListComponent', () => {
  let component: InfraDefaultersListComponent;
  let fixture: ComponentFixture<InfraDefaultersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraDefaultersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfraDefaultersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
