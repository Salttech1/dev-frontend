import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessorunitmasterComponent } from './unitmaster.component';

describe('LessorunitmasterComponent', () => {
  let component: LessorunitmasterComponent;
  let fixture: ComponentFixture<LessorunitmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessorunitmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessorunitmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
