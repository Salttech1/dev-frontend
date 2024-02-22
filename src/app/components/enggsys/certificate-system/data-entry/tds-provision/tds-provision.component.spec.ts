import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSProvisionComponent } from './tds-provision.component';

describe('TDSProvisionComponent', () => {
  let component: TDSProvisionComponent;
  let fixture: ComponentFixture<TDSProvisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TDSProvisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TDSProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
