import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalinterestpaidforalldepositorsComponent } from './totalinterestpaidforalldepositors.component';

describe('TotalinterestpaidforalldepositorsComponent', () => {
  let component: TotalinterestpaidforalldepositorsComponent;
  let fixture: ComponentFixture<TotalinterestpaidforalldepositorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalinterestpaidforalldepositorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalinterestpaidforalldepositorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
