import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfEdlisreportComponent } from './pf-edlisreport.component';

describe('PfEdlisreportComponent', () => {
  let component: PfEdlisreportComponent;
  let fixture: ComponentFixture<PfEdlisreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfEdlisreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PfEdlisreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
