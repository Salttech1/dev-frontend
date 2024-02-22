import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsdemoComponent } from './wsdemo.component';

describe('WsdemoComponent', () => {
  let component: WsdemoComponent;
  let fixture: ComponentFixture<WsdemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WsdemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WsdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
