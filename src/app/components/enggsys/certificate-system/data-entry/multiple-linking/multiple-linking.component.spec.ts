import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleLinkingComponent } from './multiple-linking.component';

describe('MultipleLinkingComponent', () => {
  let component: MultipleLinkingComponent;
  let fixture: ComponentFixture<MultipleLinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleLinkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
