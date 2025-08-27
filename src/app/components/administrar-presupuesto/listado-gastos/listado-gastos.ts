import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Presupuesto, Gasto } from '../../../services/presupuesto';

@Component({
  selector: 'app-listado-gastos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-gastos.html',
  styleUrl: './listado-gastos.css'
})
export class ListadoGastos implements OnInit {
  gastos: Gasto[] = [];
  initial = 0;
  remaining = 0;

  constructor(public pres: Presupuesto) {}

  ngOnInit(): void {
    this.pres.gastosObs.subscribe(g => this.gastos = g);
    this.pres.initialObs.subscribe(v => this.initial = v);
    this.pres.remainingObs.subscribe(v => this.remaining = v);
  }

  eliminar(id: number) { this.pres.removeGasto(id); }

  porcentajeRestante(): number {
    if (!this.initial) return 0;
    return Math.max(0, Math.round((this.remaining / this.initial) * 100));
  }

  barraClase(): string {
    const pct = this.porcentajeRestante();
    if (pct <= 33) return 'bg-danger';
    if (pct <= 66) return 'bg-warning';
    return 'bg-success';
  }
}