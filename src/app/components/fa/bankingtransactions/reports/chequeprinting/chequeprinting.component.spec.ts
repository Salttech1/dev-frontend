import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeprintingComponent } from './chequeprinting.component';

describe('ChequeprintingComponent', () => {
  let component: ChequeprintingComponent;
  let fixture: ComponentFixture<ChequeprintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeprintingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeprintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
