import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBudget } from './manage-budget';

describe('ManageBudget', () => {
  let component: ManageBudget;
  let fixture: ComponentFixture<ManageBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
