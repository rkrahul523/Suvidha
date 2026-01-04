import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FftTimeTable } from './fft-time-table';

describe('FftTimeTable', () => {
  let component: FftTimeTable;
  let fixture: ComponentFixture<FftTimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FftTimeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FftTimeTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
