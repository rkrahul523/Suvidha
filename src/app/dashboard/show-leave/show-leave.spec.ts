import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLeave } from './show-leave';

describe('ShowLeave', () => {
  let component: ShowLeave;
  let fixture: ComponentFixture<ShowLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowLeave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLeave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
