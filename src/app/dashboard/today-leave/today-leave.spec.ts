import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayLeaves } from './today-leave';

describe('TodayLeave', () => {
  let component: TodayLeaves;
  let fixture: ComponentFixture<TodayLeaves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayLeaves]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayLeaves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
