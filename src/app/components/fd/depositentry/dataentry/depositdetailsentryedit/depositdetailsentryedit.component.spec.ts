import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositdetailsentryeditComponent } from './depositdetailsentryedit.component';

describe('DepositdetailsentryeditComponent', () => {
  let component: DepositdetailsentryeditComponent;
  let fixture: ComponentFixture<DepositdetailsentryeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositdetailsentryeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositdetailsentryeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
