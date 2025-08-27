import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Gasto, Presupuesto } from '../../services/presupuesto';
import { AgregarGasto } from './agregar-gasto/agregar-gasto';
import { ListadoGastos } from './listado-gastos/listado-gastos';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-administrar-presupuesto',
  standalone: true,
  imports: [CommonModule, AgregarGasto, ListadoGastos],
  templateUrl: './administrar-presupuesto.html',
  styleUrl: './administrar-presupuesto.css'
})
export class AdministrarPresupuesto implements OnInit, OnDestroy {
  initial = 0;
  remaining = 0;
  gastos: Gasto[] = [];

  private subs: Subscription[] = [];

  constructor(private pres: Presupuesto, private router: Router) {}

  ngOnInit(): void {
    this.subs.push(this.pres.initialObs.subscribe(v => this.initial = v));
    this.subs.push(this.pres.remainingObs.subscribe(v => this.remaining = v));
    this.subs.push(this.pres.gastosObs.subscribe(g => this.gastos = g));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  volver(): void {
    try {
      window.history.length > 1 ? window.history.back() : this.router.navigate(['/crear']);
    } catch {
      this.router.navigate(['/crear']);
    }
  }

  // Eliminar solo los gastos
  eliminarGastos(): void {
    if (!this.gastos.length) return;
    const ok = window.confirm('¿Seguro que deseas eliminar todos los gastos?');
    if (!ok) return;
    const ids = this.gastos.map(g => g.id);
    ids.forEach(id => this.pres.removeGasto(id));
  }

  // Eliminar todo: presupuesto + gastos
  eliminarPresupuesto(): void {
    if (this.initial === 0) return;
    const ok = window.confirm('⚠️ Esto eliminará el presupuesto inicial y todos los gastos. ¿Deseas continuar?');
    if (!ok) return;
    this.pres.resetAll();
  }

  irACrear(): void {
    this.router.navigate(['/crear']);
  }
}