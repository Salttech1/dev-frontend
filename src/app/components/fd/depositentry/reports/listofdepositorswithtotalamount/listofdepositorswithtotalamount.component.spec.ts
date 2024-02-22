import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofdepositorswithtotalamountComponent } from './listofdepositorswithtotalamount.component';

describe('ListofdepositorswithtotalamountComponent', () => {
  let component: ListofdepositorswithtotalamountComponent;
  let fixture: ComponentFixture<ListofdepositorswithtotalamountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListofdepositorswithtotalamountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListofdepositorswithtotalamountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
