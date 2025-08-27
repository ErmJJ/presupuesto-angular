import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarGasto } from './agregar-gasto';

describe('AgregarGasto', () => {
  let component: AgregarGasto;
  let fixture: ComponentFixture<AgregarGasto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarGasto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarGasto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
