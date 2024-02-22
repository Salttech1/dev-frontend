import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusoutgoingreportComponent } from './bonusoutgoingreport.component';

describe('BonusoutgoingreportComponent', () => {
  let component: BonusoutgoingreportComponent;
  let fixture: ComponentFixture<BonusoutgoingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusoutgoingreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusoutgoingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
