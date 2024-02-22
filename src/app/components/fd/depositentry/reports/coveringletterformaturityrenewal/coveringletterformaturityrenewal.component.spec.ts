import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoveringletterformaturityrenewalComponent } from './coveringletterformaturityrenewal.component';

describe('CoveringletterformaturityrenewalComponent', () => {
  let component: CoveringletterformaturityrenewalComponent;
  let fixture: ComponentFixture<CoveringletterformaturityrenewalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoveringletterformaturityrenewalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoveringletterformaturityrenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
