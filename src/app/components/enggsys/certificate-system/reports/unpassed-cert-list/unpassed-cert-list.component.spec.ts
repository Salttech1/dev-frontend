import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpassedCertListComponent } from './unpassed-cert-list.component';

describe('UnpassedCertListComponent', () => {
  let component: UnpassedCertListComponent;
  let fixture: ComponentFixture<UnpassedCertListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpassedCertListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnpassedCertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
