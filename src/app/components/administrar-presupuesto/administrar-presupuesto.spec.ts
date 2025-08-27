import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPresupuesto } from './administrar-presupuesto';

describe('AdministrarPresupuesto', () => {
  let component: AdministrarPresupuesto;
  let fixture: ComponentFixture<AdministrarPresupuesto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarPresupuesto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarPresupuesto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
