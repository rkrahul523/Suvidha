import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenReport } from './gen-report';

describe('GenReport', () => {
  let component: GenReport;
  let fixture: ComponentFixture<GenReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
