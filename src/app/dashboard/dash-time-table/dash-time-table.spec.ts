import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTimeTable } from './dash-time-table';

describe('DashTimeTable', () => {
  let component: DashTimeTable;
  let fixture: ComponentFixture<DashTimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashTimeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashTimeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
