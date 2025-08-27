import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGastos } from './listado-gastos';

describe('ListadoGastos', () => {
  let component: ListadoGastos;
  let fixture: ComponentFixture<ListadoGastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoGastos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoGastos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
