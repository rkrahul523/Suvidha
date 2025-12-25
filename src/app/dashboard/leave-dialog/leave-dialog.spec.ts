import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDialog } from './leave-dialog';

describe('LeaveDialog', () => {
  let component: LeaveDialog;
  let fixture: ComponentFixture<LeaveDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
