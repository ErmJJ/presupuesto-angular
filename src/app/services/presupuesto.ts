import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Gasto {
  id: number;
  nombre: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})

export class Presupuesto {
  private initialKey = 'presupuesto_initial';
  private remainingKey = 'presupuesto_remaining';
  private gastosKey = 'presupuesto_gastos';

  private initial$ = new BehaviorSubject<number>(0);
  private remaining$ = new BehaviorSubject<number>(0);
  private gastos$ = new BehaviorSubject<Gasto[]>([]);

  initialObs = this.initial$.asObservable();
  remainingObs = this.remaining$.asObservable();
  gastosObs = this.gastos$.asObservable();

  private inited = false;
  private isBrowser = typeof window !== 'undefined' && !!(window.localStorage);

  constructor() {
    this.safeInit();
  }

  private safeInit(): void {
    if (this.inited) return;
    if (!this.isBrowser) { this.inited = true; return; }

    try {
      const initRaw = localStorage.getItem(this.initialKey);
      const remRaw = localStorage.getItem(this.remainingKey);
      const gastosRaw = localStorage.getItem(this.gastosKey);

      const init = initRaw !== null ? Number(initRaw) : 0;
      const gastos = gastosRaw ? JSON.parse(gastosRaw) as Gasto[] : [];

      this.initial$.next(Number.isFinite(init) ? init : 0);
      this.remaining$.next(remRaw !== null ? Number(remRaw) : (Number.isFinite(init) ? init : 0));
      this.gastos$.next(Array.isArray(gastos) ? gastos : []);
    } catch (e) {
      console.warn('PresupuestoService: fallo lectura localStorage', e);
      this.initial$.next(0);
      this.remaining$.next(0);
      this.gastos$.next([]);
    } finally {
      this.inited = true;
    }
  }

  private safePersist(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.initialKey, String(this.initial$.getValue()));
      localStorage.setItem(this.remainingKey, String(this.remaining$.getValue()));
      localStorage.setItem(this.gastosKey, JSON.stringify(this.gastos$.getValue()));
    } catch (e) {
      console.warn('PresupuestoService: fallo escritura localStorage', e);
    }
  }

  setInitial(amount: number) {
    this.safeInit();
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.initial$.next(amount);
    this.remaining$.next(amount);
    this.gastos$.next([]);
    this.safePersist();
  }

  addGasto(nombre: string, cantidad: number): { ok: boolean; message?: string } {
    this.safeInit();
    const remaining = this.remaining$.getValue();

    if (!nombre || !nombre.trim()) return { ok: false, message: 'El nombre del gasto no puede estar vacío' };
    if (!Number.isFinite(cantidad) || cantidad <= 0) return { ok: false, message: 'El monto del gasto debe ser mayor a 0' };
    if (cantidad > remaining) return { ok: false, message: 'El gasto supera el presupuesto restante' };

    const gastos = [...this.gastos$.getValue()];
    const id = gastos.length ? Math.max(...gastos.map(g => g.id)) + 1 : 1;
    const nuevo: Gasto = { id, nombre: nombre.trim(), cantidad };
    gastos.push(nuevo);

    this.gastos$.next(gastos);
    this.remaining$.next(Number((remaining - cantidad).toFixed(2)));
    this.safePersist();

    return { ok: true };
  }

  removeGasto(id: number) {
    this.safeInit();
    const gastos = [...this.gastos$.getValue()];
    const idx = gastos.findIndex(g => g.id === id);
    if (idx === -1) return;
    const [removed] = gastos.splice(idx, 1);
    const nuevoRemaining = Number((this.remaining$.getValue() + removed.cantidad).toFixed(2));
    this.gastos$.next(gastos);
    this.remaining$.next(nuevoRemaining);
    this.safePersist();
  }

  resetAll() {
    this.safeInit();
    this.initial$.next(0);
    this.remaining$.next(0);
    this.gastos$.next([]);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.initialKey);
        localStorage.removeItem(this.remainingKey);
        localStorage.removeItem(this.gastosKey);
      } catch (e) {
        console.warn('PresupuestoService: fallo limpiar localStorage', e);
      }
    }
  }
}